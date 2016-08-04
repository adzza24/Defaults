using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    public class LoginPostViewModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
        
        public bool RememberMe { get; set; }

        public string Language { get; set; }
    }
}