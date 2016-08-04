using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using log4net;
using MSD.Nordics.Interfaces.Config;
using MSD.Nordics.Interfaces.Mapper;
using MSD.Nordics.WebInit.Service;
using MSD.Nordics.WebInterfaces;
using MSD.Nordics.WebInterfaces.Cache;
using MSD_Umbraco_Portal.UI.Models.Account;
using MSD_Umbraco_Portal.UI.Models.Shared;
using Umbraco.Core.Models;
using Umbraco.Web.Mvc;

namespace MSD_Umbraco_Portal.UI.Controllers
{
    public class LoginModalController : MSDSurfaceBaseController
    {
        internal readonly ISyncService _syncService;
        internal readonly IMembershipService _membershipService;
        internal readonly IFormsAuthenticationService _formsAuthenticationService;

        public LoginModalController(IMSDUmbracoHelper umbracoHelper, IMSDUmbracoMapper umbracoMapper, IMapper mapper, INodeConfig nodeConfig, ICacheProvider cacheProvider,
            ISyncService syncService, IMembershipService membershipService, IFormsAuthenticationService formsAuthenticationService, ILog logger)
            : base(umbracoHelper, umbracoMapper, mapper, nodeConfig, cacheProvider, logger)
        {

            if (syncService == null)
            {
                throw new ArgumentNullException("syncService");
            }

            if (membershipService == null)
            {
                throw new ArgumentNullException("membershipService");
            }

            if (formsAuthenticationService == null)
            {
                throw new ArgumentNullException("formsAuthenticationService");
            }

            _syncService = syncService;
            _membershipService = membershipService;
            _formsAuthenticationService = formsAuthenticationService;
        }

        public ActionResult Index()
        {
            return View("Modal");
        }

        [ChildActionOnly]
        //OutputCacheAttribute for child actions only supports Duration, VaryByCustom, and VaryByParam 
        //[OutputCache(Duration = 2400, VaryByParam = "none", VaryByHeader = "host")]
        public PartialViewResult Modal()
        {
            var currentPage = _umbracoHelper.CurrentPage;

            var cultureName = GetCultureNameForPublishedContent(currentPage);

            var loginModel = _cacheProvider.CachedGet<LoginViewModel>(string.Format("{0}_{1}", "Login", cultureName), () =>
            {
                var model = new LoginViewModel();
                model.Language = cultureName;

                var homePageNode = _umbracoHelper.AncenstorOrSelf(currentPage, 1);
                var loginNode = _umbracoHelper.GetDescendantNodesOfType(homePageNode.Id, _nodeConfig.LoginNodeAlias).FirstOrDefault();
                _umbracoMapper.Map(loginNode, model);

                var dictionaryTerms = new LoginDictionaryViewModel();
                _umbracoMapper.MapUsingDictionary(dictionaryTerms);
                model.SetDictionary(dictionaryTerms);

                var forgotUrl = new UrlViewModel();
                var forgotNode = _umbracoHelper.GetNodeWithParent(loginNode.Id, _nodeConfig.ForgotPasswordNodeAlias);
                _umbracoMapper.Map(forgotNode, forgotUrl);
                model.ForgotPasswordLink = forgotUrl;

                var registerUrl = new UrlViewModel();
                var registerNode = _umbracoHelper.GetNodeWithParent(homePageNode.Id, _nodeConfig.RegisterNodeAlias);
                _umbracoMapper.Map(registerNode, registerUrl);
                model.RegisterLink = registerUrl;

                return model;
            });

            return PartialView("~/Views/Partials/Modals/Login.cshtml", loginModel);
        }

        [HttpPost]
        public async Task<JsonNetResult> Modal(LoginPostViewModel model)
        {
            var loginResponse = new GetLoginResponse();
            if (string.IsNullOrWhiteSpace(model.Language) || string.IsNullOrEmpty(model.Language))
            {
                loginResponse.Success = false;
                loginResponse.ResponseData = null;
                loginResponse.Message = "An error has occured.";

                if (_logger.IsErrorEnabled)
                {
                    _logger.Error("Language is null or empty in  Modal POST action of surface controller LoginController");
                }

                return ReturnJsonResponse(loginResponse);
            }

            var culture = GetCultureInformationForLanguage(model.Language);
            string locale = culture.Locale;
            string countryCode = culture.CountryCode;
           
            if (ModelState.IsValid)
            {
                var syncResult = await _syncService.SynchroniseUmbracoMember(locale, countryCode, model.Username, model.Password);
                //differentiate between the back office users and website members
                if (_membershipService.ValidateUser(model.Username, model.Password) && _umbracoHelper.MemberExists(model.Username))
                {
                    _formsAuthenticationService.SignIn(model.Username, model.RememberMe);

                    var umbracoMember = _umbracoHelper.RetrieveUmbracoMember(model.Username);
                    var user = MapUser(umbracoMember);


                    loginResponse.Success = true;
                    loginResponse.ResponseData = user;
                    return ReturnJsonResponse(loginResponse);
                }
                loginResponse.Success = false;
                loginResponse.ResponseData = null;
                loginResponse.Message = "Invalid credentials";
                return ReturnJsonResponse(loginResponse);

            }

            loginResponse.Success = false;
            loginResponse.Message = GetErrorsFromModelState(ModelState).FirstOrDefault();
            return ReturnJsonResponse(loginResponse);
        }



        #region Helpers

        private List<string> GetErrorsFromModelState(ModelStateDictionary modelState)
        {
            var query = from state in modelState.Values
                        from error in state.Errors
                        select error.ErrorMessage;

            var errorList = query.ToList();
            return errorList;
        }

        private Culture GetCultureInformationForLanguage(string language)
        {
            if (!string.IsNullOrEmpty(language) && !string.IsNullOrWhiteSpace(language))
            {
                var cultureInfo = CultureMappings.GetLocaleForCulture(language);
                return cultureInfo;
            }
            return null;
        }

        private string GetCultureNameForPublishedContent(IPublishedContent content)
        {
            var culture = _umbracoHelper.GetCulture(content);
            if (culture != null)
            {
                return culture.Name;
            }
            return string.Empty;
        }

        private UserViewModel MapUser(IMember umbracoMember)
        {
            var validationStatus = (int)umbracoMember.GetValue(_nodeConfig.MemberStatusPropertyName);
            var user = new UserViewModel() { ValidationStatus = validationStatus, Email = umbracoMember.Email };
            return user;
        }


        #endregion Helpers
    }
}