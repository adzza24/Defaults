using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    public class ChangePasswordPostViewModel
    {
        [Required]
        public string Language { get; set; }
        
        [Required]
        public string OldPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }

        [Required]
        public string EmailAddress { get; set; }

        public bool RememberMe { get; set; }
    }
}