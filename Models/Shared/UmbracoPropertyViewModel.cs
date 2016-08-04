using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Shared
{
    public class UmbracoPropertyViewModel
    {
        public string Label { get; set; }
        public bool Required  { get; set; }
        public string RegexValidation { get; set; }
        public string ErrorMessage { get; set; }
    }
}