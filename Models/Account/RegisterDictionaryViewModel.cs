using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    public class RegisterDictionaryViewModel
    {
        //"Required-field"
        public string RequiredField { get; set; }
        public string Specialty { get; set; }
        public string Password { get; set; }
        //Confirm-password
        public string ConfirmPassword { get; set; }
        //Correct-fields
        public string CorrectFields { get; set; }
        public string Submit { get; set; }

        public string ValidationStatusMessage { get; set; }
    }
}