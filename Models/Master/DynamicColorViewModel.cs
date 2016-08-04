using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace MSD_Umbraco_Portal.UI.Models.Master
{
    public class DynamicColorViewModel
    {
        [JsonProperty("Name")]
        public string Name { get; set; }
        
        [JsonProperty("colors")]
        public ColorViewModel Colors { get; set; }
     
        //{
        //  "name": "diabetes",
        //  "colors": {
        //    "primary": "#e68529",
        //    "secondary": "#f7912f",
        //    "third": "#fde9d5"
        //  }
        public string SpecialtyColor { get; set; }

//        {
//  "name": "Noxafil",
//  "colors": {
//    "primary": "#407a36",
//    "secondary": "#fbdc31",
//    "third": "#fffbea"
//  }
//}
        public string Brand { get; set; }
    }
}