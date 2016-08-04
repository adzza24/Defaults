using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MSD_Umbraco_Portal.UI.Models.Shared;
using Newtonsoft.Json;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    public class LoginViewModel
    {
        #region Properties Mapped from Umbraco Node
        public string Language { get; set; }
        
        public string Name { get; set; }
        
        //??
        //public string RegisterUrl { get; set; }
        
        public string AccountPendingText { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string KeepMeLoggedIn { get; set; }
        public string Url { get; set; }

        #endregion


        #region FieldTypes

        public string UsernameLabel
        {
            get 
            { 
                return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Username).Label ?? string.Empty;
            }
        }
        public string UsernameValue { get; set; }
        public bool UsernameRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Username).Required; }
        }
        public string UsernameErrorMessage
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Username).ErrorMessage ?? string.Empty; }
        }

        public string PasswordLabel
        {
            get
            {
                return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Password).Label ?? string.Empty;
            }
        }

        public string PasswordValue
        {
            get; set;
        }
        public bool PasswordRequired
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Password).Required; }
        }
        public string PasswordErrorMessage
        {
            get { return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(Password).ErrorMessage ?? string.Empty; }
        }

        public string KeepMeLoggedInLabel
        {
            get
            {
                return JsonConvert.DeserializeObject<UmbracoPropertyViewModel>(KeepMeLoggedIn).Label ?? string.Empty;
            }
        }
        public bool KeepMeLoggedInValue { get; set; }

        #endregion FieldTypes

        
        #region Properties Mapped from Umbraco Dictionary
        
        public LoginDictionaryViewModel Dictionary { get; private set; }
        internal void SetDictionary(LoginDictionaryViewModel dictionary)
        {
            Dictionary = dictionary;
        }


        #endregion Properties Mapped from Umbraco Dictionary

        #region Default Error Messages

            public string RequireField { get; set; }
        
        #endregion Default Error Messages


        public UrlViewModel RegisterLink { get; set; }
        public UrlViewModel ForgotPasswordLink { get; set;  }



    }
}