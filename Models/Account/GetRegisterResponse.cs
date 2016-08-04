using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MSD.Nordics.Interfaces;
using MSD.Nordics.Interfaces.ViewModels;
using MSD_Umbraco_Portal.UI.Models.Shared;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    public class GetRegisterResponse : JsonResponseBase<IRegisterPostViewModel>
    {
    }
}