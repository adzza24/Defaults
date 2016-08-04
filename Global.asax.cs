using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using MSD.Nordics.WebInit;
using MSD.Nordics.WebInit.DependencyResolution;
using MSD_Umbraco_Portal.UI.App_Start;
using Umbraco.Web;

namespace MSD_Umbraco_Portal.UI
{
    public class MvcApplication : UmbracoApplication
    {
        protected override void OnApplicationStarting(object sender, EventArgs e)
        {
            var container = WebIoC.Initialise();
            DependencyResolver.SetResolver(new MSDDependencyResolver(container));
           

            //MSD.Nordics.WebInit.AutoMapperConfig.Initialise.Init();
            AutoMapperConfig.Init();
            
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            
            base.OnApplicationStarting(sender, e);
        }

        //public override string GetVaryByCustomString(HttpContext context, string arg)
        //{
        //    if (arg == "host")
        //    {
        //        return context.Request.Headers["host"];
        //    }
        //    return String.Empty;
        //}
    }
}