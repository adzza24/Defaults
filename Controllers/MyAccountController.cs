using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;
using log4net;
using MSD.Nordics.Interfaces.Config;
using MSD.Nordics.Interfaces.Mapper;
using MSD.Nordics.WebInit.Service;
using MSD.Nordics.WebInterfaces;
using MSD.Nordics.WebInterfaces.Cache;
using MSD_Umbraco_Portal.UI.Models.Account;
using MSD_Umbraco_Portal.UI.Models.Shared;
using Umbraco.Web.Mvc;

namespace MSD_Umbraco_Portal.UI.Controllers
{
    public class MyAccountController : MSDSurfaceBaseController
    {
        internal readonly IMemberProfileService _profileService;
        internal readonly IMembershipService _membershipService;
        internal readonly IFormsAuthenticationService _formsAuthenticationService;

        public MyAccountController(IMSDUmbracoHelper umbracoHelper, IMSDUmbracoMapper umbracoMapper, IMapper mapper,
            INodeConfig nodeConfig, ICacheProvider cacheProvider, ILog logger, IMemberProfileService profileService, IMembershipService membershipService, IFormsAuthenticationService formsAuthenticationService)
            : base(umbracoHelper, umbracoMapper, mapper, nodeConfig, cacheProvider, logger)
        {
            if (profileService == null)
            {
                throw new ArgumentNullException("profileService");
            }

            if (membershipService == null)
            {
                throw new ArgumentNullException("membershipService");
            }

            if (formsAuthenticationService == null)
            {
                throw new ArgumentNullException("formsAuthenticationService");
            }

            _profileService = profileService;
            _membershipService = membershipService;
            _formsAuthenticationService = formsAuthenticationService;
        }

        // GET: MyAccountSubscribe
        [HttpGet]
        public ActionResult ChangeSubscription()
        {
            var currentPage = _umbracoHelper.CurrentPage;
            var language = GetCultureNameForPublishedContent(currentPage);
            var locale = GetCultureInformationForLanguage(language).Locale;

            var viewModel = new SubscriptionViewModel();
            viewModel.Language = language;

            if (User != null && User.Identity.IsAuthenticated)
            {
                //ToDo - This is a bad idea, because you still block your UI thread waiting and doing nothing useful.
                //var consentResponse =   await _profileService.GetSubscription(User.Identity.Name, locale).ConfigureAwait(false);
                var consentResponse = Task.Run(async () => await _profileService.GetSubscription(User.Identity.Name, locale)).Result;
                if (consentResponse != null)
                {
                    viewModel.IsSubscribed = consentResponse.IsApproved;
                }
            }

            return PartialView("~/Views/Partials/Account/ChangeSubscription.cshtml", viewModel);

        }

        [HttpPost]
        public async Task<JsonNetResult> UpdateAccountSubscription(SubscriptionPostViewModel model)
        {
            var response = new GetSubscriptionResponse();

            if (string.IsNullOrWhiteSpace(model.Language) || string.IsNullOrEmpty(model.Language))
            {
                response.Success = false;
                response.ResponseData = null;
                response.Message = "An error has occured.";

                if (_logger.IsErrorEnabled)
                {
                    _logger.Error("Language is null or empty in  MyAccountSubscribe POST action of surface controller MyAccountController");
                }

                return ReturnJsonResponse(response);
            }

            var culture = GetCultureInformationForLanguage(model.Language);
            string locale = culture.Locale;

            if (!ModelState.IsValid)
            {
                response.Success = false;
                response.Message = GetErrorsFromModelState(ModelState).FirstOrDefault();
                return ReturnJsonResponse(response);
            }

            var result = await _profileService.UpdateSubscription(model.EmailAddress, locale, model.IsSubscribed);
            if (result == null)
            {
                response.Success = false;
                response.ResponseData = null;
                response.Message = "An error has occured.";
            }

            if (result.Status != (int)ResponseStatus.Success)
            {
                response.Success = false;
                response.ResponseData = model;
                response.Message = result.Message;
                return ReturnJsonResponse(response);
            }

            response.Success = true;
            response.Message = result.Message;
            return ReturnJsonResponse(response);
        }

        [HttpGet]
        public PartialViewResult ChangePassword()
        {
            var currentPage = _umbracoHelper.CurrentPage;
            var language = GetCultureNameForPublishedContent(currentPage);
            
            var viewModel = new ChangePasswordViewModel();
            viewModel.Language = language;

            return PartialView("~/Views/Partials/Account/ChangePassword.cshtml", viewModel);
        }

        [HttpPost]
        public JsonNetResult ChangePassword(ChangePasswordPostViewModel model)
        {
            var response = new GetChangePasswordResponse();

            if (string.IsNullOrWhiteSpace(model.Language) || string.IsNullOrEmpty(model.Language))
            {
                response.Success = false;
                response.ResponseData = null;
                response.Message = "An error has occured.";

                if (_logger.IsErrorEnabled)
                {
                    _logger.Error("Language is null or empty in  ChangePassword POST action of surface controller MyAccountController");
                }

                return ReturnJsonResponse(response);
            }
           
            if (!ModelState.IsValid)
            {
                response.Success = false;
                response.Message = GetErrorsFromModelState(ModelState).FirstOrDefault();
                return ReturnJsonResponse(response);
            }

            bool result;
            try
            {
                result = _membershipService.ChangePassword(model.EmailAddress, model.OldPassword, model.NewPassword);
                if (result)
                {
                    AuthenticateMember(model.EmailAddress, model.RememberMe);
                }
            }
            catch (Exception ee)
            {
                if (_logger.IsErrorEnabled)
                {
                    _logger.Error(string.Format("Exception was thrown for in ChangePassword POST action of MyAccout controller for member with username {0}. The excepton is {1}", model.EmailAddress, ee.Message));
                }
                result = false;
            }

            response.Success = result;
            return ReturnJsonResponse(response);
        }


        public PartialViewResult ChangeEmailAddress()
        {
            var currentPage = _umbracoHelper.CurrentPage;
            var language = GetCultureNameForPublishedContent(currentPage);

            var viewModel = new ChangeEmailViewModel();
            viewModel.Language = language;

            return PartialView("~/Views/Partials/Account/ChangeEmailAddress.cshtml", viewModel);
        }

        [HttpPost]
        public async Task<JsonNetResult> ChangeEmailAddress(ChangeEmailPostViewModel model)
        {
            var response = new GetChangeEmailResponse();

            if (string.IsNullOrWhiteSpace(model.Language) || string.IsNullOrEmpty(model.Language))
            {
                response.Success = false;
                response.ResponseData = null;
                response.Message = "An error has occured.";

                if (_logger.IsErrorEnabled)
                {
                    _logger.Error("Language is null or empty in  ChangeEmailAddress POST action of surface controller MyAccountController");
                }

                return ReturnJsonResponse(response);
            }

            if (!_membershipService.ValidateUser(model.CurrentEmail, model.Password))
            {
                ModelState.AddModelError("Password", "The password is incorrect");
            }

            var culture = GetCultureInformationForLanguage(model.Language);
            string locale = culture.Locale;

            if (!ModelState.IsValid)
            {
                response.Success = false;
                response.Message = GetErrorsFromModelState(ModelState).FirstOrDefault();
                return ReturnJsonResponse(response);
            }

            var result = await _profileService.UpdateEmail(model.CurrentEmail, locale, model.NewEmail);
            if (result == null)
            {
                response.Success = false;
                response.ResponseData = null;
                response.Message = "An error has occured.";
            }

            if (result.Status != (int)ResponseStatus.Success)
            {
                response.Success = false;
                response.ResponseData = model;
                response.Message = result.Message;
                return ReturnJsonResponse(response);
            }

            bool isUpdated = _umbracoHelper.UpdateMemberEmailAddress(model.CurrentEmail, model.NewEmail);
            if (!isUpdated)
            {
                response.Success = false;
                response.Message = "An error has occured.";
                return ReturnJsonResponse(response);
            }

            AuthenticateMember(model.NewEmail, model.RememberMe);
            response.Success = true;
            response.Message = result.Message;
            return ReturnJsonResponse(response);

        }

        [HttpPost]
        public async Task<JsonNetResult> DeleteMemberAccount(DeleteAccountViewModel model)
        {
            var response = new GetDeleteAccountResponse();

            if (string.IsNullOrWhiteSpace(model.Language) || string.IsNullOrEmpty(model.Language))
            {
                response.Success = false;
                response.ResponseData = null;
                response.Message = "An error has occured.";

                if (_logger.IsErrorEnabled)
                {
                    _logger.Error("Language is null or empty in  DeleteMemberAccount POST action of surface controller MyAccountController");
                }

                return ReturnJsonResponse(response);
            }

            var culture = GetCultureInformationForLanguage(model.Language);
            string locale = culture.Locale;

            if (!ModelState.IsValid)
            {
                response.Success = false;
                response.Message = GetErrorsFromModelState(ModelState).FirstOrDefault();
                return ReturnJsonResponse(response);
            }

            var result = await _profileService.DeleteAccount(model.Email, locale, model.Reason);
            if (result == null)
            {
                response.Success = false;
                response.ResponseData = null;
                response.Message = "An error has occured.";
            }

            if (result.Status != (int)ResponseStatus.Success)
            {
                response.Success = false;
                response.ResponseData = model;
                response.Message = result.Message;
                return ReturnJsonResponse(response);
            }

            bool isDeleted = _umbracoHelper.DeleteUmbracoMember(model.Email);
            if (!isDeleted)
            {
                response.Success = false;
                response.Message = "An error has occured.";
                return ReturnJsonResponse(response);
            }

            Logout();
            response.Success = true;
            response.Message = result.Message;
            return ReturnJsonResponse(response);
        }


        private void AuthenticateMember(string username, bool rememberMe)
        {
            _formsAuthenticationService.SignOut();
            _formsAuthenticationService.SignIn(username, rememberMe);
        }

        private void Logout()
        {
            _formsAuthenticationService.SignOut();
            Session.Clear();
        }



    }
}