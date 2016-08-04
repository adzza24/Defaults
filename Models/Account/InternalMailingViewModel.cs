using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MSD.Nordics.Interfaces.ViewModels;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    public class InternalMailingViewModel : IInternalMailingViewModel
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public bool Selected { get; set; }
    }
}