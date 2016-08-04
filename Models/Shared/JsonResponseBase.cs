using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Shared
{
    public abstract class JsonResponseBase<T>
    {
        /// <summary>
        /// Whether the request was successful.
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Any messages to return to the frontend.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// The response payload data.
        /// </summary>
        public T ResponseData { get; set; }

        /// <summary>
        /// Validation errors to be displayed in the frontend.
        /// </summary>
        //public IEnumerable<JsonValidationError> Errors { get; set; }
    }
}