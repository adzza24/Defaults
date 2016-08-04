using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MSD_Umbraco_Portal.UI.Models.Shared
{
    public abstract class ViewModel
    {
        protected const int MINIMUM_EMAIL_LENGTH = 6;
        /// <summary>
        /// Maximum email address length Lyris can handle.
        /// </summary>
        protected const int MAXIMUM_EMAIL_LENGTH = 150;

        protected const int MINIMUM_PASSWORD_LENGTH = 6;
        protected const int MAXIMUM_PASSWORD_LENGTH = 100;

        public static int MinimumEmailLength { get { return MINIMUM_EMAIL_LENGTH; } }
        public static int MaximumEmailLength { get { return MAXIMUM_EMAIL_LENGTH; } }

        public static int MinimumPasswordLength { get { return MINIMUM_PASSWORD_LENGTH; } }
        public static int MaximumPasswordLength { get { return MAXIMUM_PASSWORD_LENGTH; } }
    }
}