using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    public class ChangeEmailPostViewModel
    {
        [Required]
        public string CurrentEmail { get; set; }

        [Required]
        public string NewEmail { get; set; }

        [Required]
        public string Language { get; set; }

        [Required]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}