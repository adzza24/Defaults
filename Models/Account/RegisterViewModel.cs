using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MSD_Umbraco_Portal.UI.Models.Shared;
using Newtonsoft.Json;
using umbraco.editorControls.tinyMCE3.webcontrol.plugin;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    public class RegisterViewModel
    {
        
        public string Culture { get; set; }
        
        //TODO - remove
        // public string CountryCode { get; set; }
        
        //TODO - remove
        //public string Locale { get; set; }
        

        // //TODO - use T4 template to generate class containing all the properties in the FiledTypes region from the mapped Umbraco Node Properties
        #region Properties Mapped from Umbraco Node

        public string Name { get; set; }
        public string TextArea { get; set; }
        public string PersonalDetailsTitle { get; set; }
        public string TermsAndConditionsCheckbox { get; set; }
        public string AccountDetailsTitle { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string ConfirmEmailAddress { get; set; }
        public string MarketingList { get; set; }
        public string Postcode { get; set; }
        public string Profession { get; set; }
        public string Specialty { get; set; }
        public string DateOfBirth { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

        //TODO
        public string ThankYouUrl { get; set; }

        #region Default Error Messages

        public string RequireField { get; set; }
        public string InvalidEmail { get; set; }
        public string UnmatchedEmailAddress { get; set; }
        public string UnmatchedPasswords { get; set; }
        public string InvalidPassword { get; set; }
        public string AgeInvalid { get; set; }

        #endregion Default Error Messages


        #endregion Properties Mapped from Umbraco Node

        #region FieldTypes

        public string FirstNameLabel
        {
            get 
            {
                return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(FirstName).Label ?? string.Empty;
            }
        }
        public string FirstNameValue { get; set; }
        public bool FirstNameRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(FirstName).Required; }
        }
        public string FirstNameErrorMessage
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(FirstName).ErrorMessage ?? string.Empty; }
        }

        public string LastNameLabel
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(LastName).Label ?? string.Empty; }
        }
        public bool LastNameRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(LastName).Required; }
        }
        public string LastNameErrorMessage
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(LastName).ErrorMessage ?? string.Empty ; }
        }
        public string LastNameValue { get; set; }

        public string EmailAddressLabel
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(EmailAddress).Label ?? string.Empty; }
        }
        public bool EmailAddressRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(EmailAddress).Required; }
        }
        public string EmailAddressErrorMessage
        {
            get
            {
                return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(EmailAddress).ErrorMessage ?? string.Empty;
            }
        }
        public string EmailAddressValue { get; set; }

        public string ConfirmEmailAddressLabel
        {
            get
            {
                return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(ConfirmEmailAddress).Label ?? string.Empty;
            }
        }
        public bool ConfirmEmailAddressRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(ConfirmEmailAddress).Required; }
        }
        public string ConfirmEmailAddressErrorMessage
        {
            get
            {
                return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(ConfirmEmailAddress).ErrorMessage ??
                       string.Empty;
            }
        }
        public string ConfirmEmailAddressValue { get; set; }

        public string MarketingListLabel
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(MarketingList).Label ?? string.Empty; }
        }
        public bool MarketingListRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(MarketingList).Required; }
        }
        public string MarketingListErrorMessage
        {
            get
            {
                return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(MarketingList).ErrorMessage ??
                       string.Empty;
            }
        }
        public string MarketingListValue { get; set; }

        public string PostcodeLabel
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Postcode).Label ?? string.Empty; }
        }
        public bool PostcodeRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Postcode).Required; }
        }
        public string PostcodeErrorMessage
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Postcode).ErrorMessage ?? string.Empty; }
        }
        public string PostcodeValue { get; set; }

        public string DateOfBirthLabel
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(DateOfBirth).Label ?? string.Empty; }
        }
        public bool DateOfBirthRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(DateOfBirth).Required; }
        }
        public string DateOfBirthErrorMessage
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(DateOfBirth).ErrorMessage ?? string.Empty; }
        }
        public string DateOfBirthValue { get; set; }

        public string ProfessionLabel
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Profession).Label ?? string.Empty; }
        }
        public bool ProfessionRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Profession).Required; }
        }
        public string ProfessionErrorMessage
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Profession).ErrorMessage ?? string.Empty; }
        }

        public string SpecialtyLabel
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Specialty).Label ?? string.Empty; }
        }
        public bool SpecialtyRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Specialty).Required; }
        }
        public string SpecialtyErrorMessage
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Specialty).ErrorMessage ?? string.Empty; }
        }

        public string PasswordLabel
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Password).Label ?? string.Empty; }
        }
        public bool PasswordRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Password).Required; }
        }
        public string PasswordErrorMessage
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Password).ErrorMessage ?? string.Empty; }
        }
        public string PasswordValue { get; set; }

        public string ConfirmPasswordLabel
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(ConfirmPassword).Label ?? string.Empty; }
        }
        public bool ConfirmPasswordRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(ConfirmPassword).Required; }
        }
        public string ConfirmPasswordErrorMessage
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(ConfirmPassword).ErrorMessage ?? string.Empty; }
        }
        public string ConfirmPasswordValue { get; set; }

        #endregion FieldType

        #region Properties Mapped from Umbraco Dictionary
        
        public RegisterDictionaryViewModel Dictionary { get; private set; }
        internal void SetDictionary(RegisterDictionaryViewModel dictionary)
        {
            Dictionary = dictionary;
        }
        
        #endregion


        #region API


        public IEnumerable<SpecialtyViewModel> Specialties { get; set; }

        public IEnumerable<ProfessionViewModel> Professions { get; set; }

        public IEnumerable<InternalMailingViewModel> InternalMailingLists { get; set; }

        //[RequiredWhenExternalRegistrant]
        //public int? SelectedProfession { get; set; }

        //[RequiredWhenExternalRegistrant]
        //public int? SelectedSpecialty { get; set; }

        //public int?[] SelectedMailingList { get; set; }

        public IEnumerable<string> InternalDomains { get; set; }

        #endregion API

       
    }
}