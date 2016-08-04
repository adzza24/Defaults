using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Master
{
    public class HeaderViewModel
    {
        public string RegisterUrl { get; set; }
        public string HomeUrl { get; set; }
        public string MyAccountUrl { get; set; }
        public string LoginUrl { get; set; }

        public HeaderDictionaryViewModel Dictionary { get; private set; }
        internal void SetDictionary(HeaderDictionaryViewModel dictionary)
        {
            Dictionary = dictionary;
        }
    }
}