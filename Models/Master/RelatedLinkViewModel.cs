using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Master
{
    public class RelatedLinkViewModel
    {
        public string Caption { get; set; }
        public string Link { get; set; }
        public bool NewWindow { get; set; }
        public string Title { get; set; }
        
        //public bool IsInternal { get; set; }
        //public int Internal { get; set; }
        //public bool Edit { get; set; }
        //public string Type { get; set; }
        
    }
}