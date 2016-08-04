using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using log4net;
using MSD.Nordics.Interfaces.Config;
using MSD.Nordics.Interfaces.Mapper;
using MSD.Nordics.WebInterfaces;
using MSD.Nordics.WebInterfaces.Cache;

namespace MSD_Umbraco_Portal.UI.Controllers
{
    public class LogoutController : MSDBaseController
    {
        internal readonly IFormsAuthenticationService _formsAuthenticationService;
        
        public LogoutController(IMSDUmbracoHelper umbracoHelper, IMSDUmbracoMapper umbracoMapper, IMapper mapper, INodeConfig nodeConfig, ICacheProvider cacheProvider, ILog logger, IFormsAuthenticationService formsAuthenticationService) : base(umbracoHelper, umbracoMapper, mapper, nodeConfig, cacheProvider, logger)
        {
             if (formsAuthenticationService == null)
            {
                throw new ArgumentNullException("formsAuthenticationService");
            }

            _formsAuthenticationService = formsAuthenticationService;
        }

        [HttpGet]
        public ActionResult LogoutMember()
        {
            Session.Clear();
            _formsAuthenticationService.SignOut();
            return Redirect("/");
        }
    }
}