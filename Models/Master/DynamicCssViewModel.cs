using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Master
{
    public class DynamicCssViewModel
    {
        public List<DynamicColorViewModel> SiloColours { get; set; }
        public DynamicColorViewModel BrandColour { get; set; }
        public string CacheForce1 { get; set; }
    }
}