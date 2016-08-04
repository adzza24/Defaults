using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using MSD.Nordics.Interfaces;
using MSD.Nordics.Interfaces.ViewModels;
using MSD_Umbraco_Portal.UI.Attributes;
using MSD_Umbraco_Portal.UI.Models.Shared;
using Umbraco.Core.Models;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    /// <summary>
    /// If front-end validation is bypassed, and ModelState is invalid, the error message returned is not localised
    /// team decission to do it as in the old registration form
    /// </summary>
    public class RegisterPostViewModel : ViewModel, IRegisterPostViewModel
    {
        #region API
       
        //passed in by front-end - 
        public IList<InternalMailingViewModel> InternalMailingLists { get; set; }

         [RequiredWhenExternalRegistrant]
         public int? Profession { get; set; }

         [RequiredWhenExternalRegistrant]
         public int? Specialty { get; set; }

        //Not passed in by front-end, populated again from service call on post
         public IEnumerable<string> InternalDomains { get; set; }
        
        #endregion API

        //TODO - remove
        //[Required]
        // [StringLength(2, MinimumLength = 2)]
        //public string CountryCode { get; set; }

        //TODO - remove
        //[Required]
        // [StringLength(5, MinimumLength = 5)]
        // public string Locale { get; set; }

        [Required]
        public string FirstNameValue { get; set; }

        [Required]
        public string LastNameValue { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(
            MAXIMUM_EMAIL_LENGTH,
            ErrorMessage = "The {0} must be at least {2} characters long.",
            MinimumLength = MINIMUM_EMAIL_LENGTH
            )]
        [DataType(DataType.EmailAddress)]
        public string EmailAddressValue { get; set; }

        [Required]
        public string PostcodeValue { get; set; }

        [Required]
        public string DateOfBirthValue { get; set; }

        [Required]
        public bool TermsAndConditionsAccepted { get; set; }

        [Required]
        public string PasswordValue { get; set; }

        /// <summary>
        /// Error message received from API validation on form submission (this message comes localised from the database)
        /// </summary>
        public string ErrorMessage { get; set; }

    }
}