using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MSD_Umbraco_Portal.UI.Models.Shared;
using Newtonsoft.Json;

namespace MSD_Umbraco_Portal.UI.Models.Master
{
    public class ColorViewModel
    {
        [JsonProperty("primary")]
        public string Primary { get; set; }

        [JsonProperty("secondary")]
        public string Secondary { get; set; }

         [JsonProperty("third")]
        public string Third { get; set; }

       
    }
}