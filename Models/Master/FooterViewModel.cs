using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MSD_Umbraco_Portal.UI.Models.Shared;

namespace MSD_Umbraco_Portal.UI.Models.Master
{
    public class FooterViewModel
    {
        public FooterViewModel()
        {
            Links = new List<UrlViewModel>();
            RelatedLinks = new List<RelatedLinkViewModel>();
        }

        public string HomeUrl { get; set; }
        public UrlViewModel RegisterUrl { get; set; }
        public IEnumerable<UrlViewModel> Links { get; set; }
        public IEnumerable<RelatedLinkViewModel> RelatedLinks { get; set; }

        public FooterDictionaryViewModel Dictionary { get; private set; }
        internal void SetDictionary(FooterDictionaryViewModel dictionary)
        {
            Dictionary = dictionary;
        }
    }
}