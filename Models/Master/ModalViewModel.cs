using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Master
{
    public class ModalViewModel
    {
        public ModalDictionaryViewModel Dictionary { get; private set; }
        internal void SetDictionary(ModalDictionaryViewModel dictionary)
        {
            Dictionary = dictionary;
        }
    }
}