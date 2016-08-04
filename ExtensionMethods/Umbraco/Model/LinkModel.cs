using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MSD.Nordics.WebInterfaces.Model;

namespace MSD.Nordics.WebHelpers.Umbraco.Model
{
    public class LinkModel : ILinkModel
    {
        public string Name { get; set; }
        public string Url { get; set; }
    }
}
