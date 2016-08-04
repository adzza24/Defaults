using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    public class SubscriptionPostViewModel
    {
        [Required]
        public string Language { get; set; }
        
        [Required]
        public bool IsSubscribed { get; set; }

        [Required]
        public string EmailAddress { get; set; }
    }
}