using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Shared
{
    public class JsonValidationError
    {
        /// <summary>
        /// The key of the property that failed validation.
        /// </summary>
        public string Key { get; set; }

        /// <summary>
        /// The validation message for that property.
        /// </summary>
        public string Message { get; set; }
    }
}