using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Master
{
    public class ExitPageViewModel
    {
        public string Title { get; set; }
        public string TextArea { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }

        public ExitPageDictionaryViewModel Dictionary { get; private set; }
        internal void SetDictionary(ExitPageDictionaryViewModel dictionary)
        {
            Dictionary = dictionary;
        }
    }
}