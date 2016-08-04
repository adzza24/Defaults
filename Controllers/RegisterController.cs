using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using log4net;
using MSD.Nordics.Interfaces.Config;
using MSD.Nordics.Interfaces.Mapper;
using MSD.Nordics.ServiceClient.MSDServiceReference;
using MSD.Nordics.WebInit.Service;
using MSD.Nordics.WebInit.Service.Model;
using MSD.Nordics.WebInterfaces;
using MSD.Nordics.WebInterfaces.Cache;
using MSD_Umbraco_Portal.UI.Models.Account;
using MSD_Umbraco_Portal.UI.Models.Shared;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Mvc;

namespace MSD_Umbraco_Portal.UI.Controllers
{
    public class RegisterController : MSDBaseController
    {
        internal readonly IRegistrationService _registrationService;
        internal readonly ISyncService _syncService;

        public RegisterController(IMSDUmbracoHelper umbracoHelper, IMSDUmbracoMapper umbracoMapper, IMapper mapper, INodeConfig nodeConfig, ICacheProvider cacheProvider, 
            IRegistrationService registrationService, ISyncService syncService, ILog logger)
            : base(umbracoHelper, umbracoMapper, mapper, nodeConfig, cacheProvider, logger)
        {
            if (registrationService == null)
            {
                throw new ArgumentNullException("registrationService");
            }

            if (syncService == null)
            {
                throw new ArgumentNullException("syncService");
            }

            _registrationService = registrationService;
            _syncService = syncService;
        }

        // GET: Register
        public async Task<ActionResult> Register()
        {
            var cultureName = GetCultureNameForPublishedContent(_umbracoHelper.CurrentPage);
            var model = new RegisterViewModel() { Culture = cultureName };

            _umbracoMapper.Map(_umbracoHelper.CurrentPage, model);

            var dictionaryTerms = new RegisterDictionaryViewModel();
            _umbracoMapper.MapUsingDictionary(dictionaryTerms);
            model.SetDictionary(dictionaryTerms);

            model.InternalDomains = await _registrationService.GetDomainsAsync();
            model.InternalMailingLists = await RetrieveMailing();
            model.Professions = await RetrieveProfessions(model.Culture);
            model.Specialties = await RetrieveSpecialties(model.Culture);

            model.ThankYouUrl =
                _umbracoHelper.GetNodeWithParent(_umbracoHelper.CurrentPage.Id, _nodeConfig.AboutPageAlias).Url;

            return View("~/Views/Register.cshtml", model);
        }

        //POST: Register
        [HttpPost]
        public async Task<JsonNetResult> Register(RegisterPostViewModel model)
        {
            var culture = GetCultureInformationForPublishedContent(_umbracoHelper.CurrentPage);
            
            var registerResponse = new GetRegisterResponse();
            if (model == null)
            {
                registerResponse.Success = false;
                registerResponse.Message = "Error - Register Post Model is null;";
                return ReturnJsonResponse(registerResponse);
            }

            if (!ModelState.IsValid)
            {
                var errors = GetErrorsFromModelState(ModelState);
                //Error to be displayed for the user
                //if model state is invalid (front-end validation is by-passed) then the error message displayed is not required to be localised
                model.ErrorMessage = errors.First();
                registerResponse.Success = false;
                registerResponse.ResponseData = model;
                registerResponse.Message = errors.First();
                return ReturnJsonResponse(registerResponse);
            }
            
            var requestDto = _mapper.Map<RegisterPostViewModel, RegistrationRequestDTO>(model);
            requestDto.Locale = culture.Locale;
            requestDto.CountryCode = culture.CountryCode;

            var responseDto = await _registrationService.SaveAsync(requestDto);
            if (responseDto.Status == (int)ResponseStatus.Failure)
            {
                registerResponse.Success = false;
                model.ErrorMessage = responseDto.Message;
                registerResponse.ResponseData = model;
                registerResponse.Message = responseDto.Message;
                return ReturnJsonResponse(registerResponse);
            }

            var syncResult = await _syncService.SynchroniseUmbracoMember(culture.Locale, culture.CountryCode, model.EmailAddressValue, model.PasswordValue);
            if (!syncResult)
            {
                registerResponse.Success = false;
                model.ErrorMessage = "Error - Umbraco Member Registration failed";
                registerResponse.ResponseData = model;
                registerResponse.Message = string.Empty;
                return ReturnJsonResponse(registerResponse);
            }

            string validationStatusMessage = null;
            var validationStatus = _umbracoHelper.GetMemberPropertyValue<int>(model.EmailAddressValue,
                _nodeConfig.MemberStatusPropertyName);
          
            if (validationStatus == (int)MemberValidationStatus.Pending)
            {
               var dictionaryTerms = new RegisterDictionaryViewModel();
                _umbracoMapper.MapUsingDictionary(dictionaryTerms);
                validationStatusMessage = dictionaryTerms.ValidationStatusMessage;
            }

            registerResponse.Success = true;
            registerResponse.Message = validationStatusMessage;
            registerResponse.ResponseData = model;
            return ReturnJsonResponse(registerResponse);
        }

        #region API
        private async Task<IEnumerable<ProfessionViewModel>> RetrieveProfessions(string culture)
        {
            var locale = CultureMappings.GetLocaleForCulture(culture).Locale;
            var professionsDto = await _registrationService.GetProfessionsAsync(locale);
            var professionsViewModel =
                _mapper.Map<IEnumerable<TextValuePairDTO>, IEnumerable<ProfessionViewModel>>(professionsDto);
            return professionsViewModel;
        }

        private async Task<IEnumerable<SpecialtyViewModel>> RetrieveSpecialties(string culture)
        {
            var cultureInfo = CultureMappings.GetLocaleForCulture(culture);
            var specialtiesDto = await _registrationService.GetSpecialtiesAsync(cultureInfo.Locale);
            var specialtiesViewModel =
                _mapper.Map<IEnumerable<TextValuePairDTO>, IEnumerable<SpecialtyViewModel>>(specialtiesDto);
            return specialtiesViewModel;
        }

        private async Task<IEnumerable<InternalMailingViewModel>> RetrieveMailing()
        {
            var mailingList = await _registrationService.GetMailingAsync();
            var mailings = _mapper.Map<IEnumerable<TextValuePairDTO>,
            IEnumerable<InternalMailingViewModel>>(mailingList);
            return mailings;
        }

        #endregion API

        #region Helpers

        private List<string> GetErrorsFromModelState(ModelStateDictionary modelState)
        {
            var query = from state in modelState.Values
                        from error in state.Errors
                        select error.ErrorMessage;

            var errorList = query.ToList();
            return errorList;
        }

        //TODO - use from base
        private Culture GetCultureInformationForPublishedContent(IPublishedContent content)
        {
            var culture = _umbracoHelper.GetCulture(content);
            var cultureInfo = CultureMappings.GetLocaleForCulture(culture.Name);
            return cultureInfo;
        }

        //TODO - use from base
        private string GetCultureNameForPublishedContent(IPublishedContent content)
        {
            var culture = _umbracoHelper.GetCulture(content);
            if (culture != null)
            {
                return culture.Name;
            }
            return string.Empty;
        }


        #endregion Helpers

    }
}