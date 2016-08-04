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
using MSD_Umbraco_Portal.UI.Models.Shared;
using Umbraco.Core.Models;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;

namespace MSD_Umbraco_Portal.UI.Controllers
{
    public class MSDBaseController : Controller, IRenderMvcController
    {
        protected internal readonly IMSDUmbracoHelper _umbracoHelper;
        protected internal readonly IMSDUmbracoMapper _umbracoMapper;
        protected internal readonly IMapper _mapper;
        protected internal readonly INodeConfig _nodeConfig;
        protected internal readonly ICacheProvider _cacheProvider;
        protected internal readonly ILog _logger;
        
        public MSDBaseController(IMSDUmbracoHelper umbracoHelper, IMSDUmbracoMapper umbracoMapper, IMapper mapper, INodeConfig nodeConfig, ICacheProvider cacheProvider, ILog logger)
        {

            if (umbracoHelper == null)
            {
                throw new ArgumentNullException("umbracoHelper");
            }

            if (umbracoMapper == null)
            {
                throw new ArgumentNullException("umbracoMapper");
            }

            if (mapper == null)
            {
                throw new ArgumentNullException("mapper");
            }

            if (nodeConfig == null)
            {
                throw new ArgumentNullException("nodeConfig");
            }

            if (cacheProvider == null)
            {
                throw new ArgumentNullException("cacheProvider");
            }

            if (logger == null)
            {
                throw new ArgumentNullException("logger");
            }

            _umbracoHelper = umbracoHelper;
            _umbracoMapper = umbracoMapper;
            _mapper = mapper;
            _nodeConfig = nodeConfig;
            _cacheProvider = cacheProvider;
            _logger = logger;
        }


        protected JsonNetResult ReturnJsonResponse<T>(JsonResponseBase<T> jsonResponse)
        {
            var json = new JsonNetResult();
            json.Formatting = Newtonsoft.Json.Formatting.Indented;

            if (jsonResponse != null)
            {
                if (!jsonResponse.Success)
                {
                    Response.StatusCode = 400;
                }
            }
            else
            {
                jsonResponse.Success = false;
                jsonResponse.Message = "Internal Server Error";
                Response.StatusCode = 500;
            }

            json.Data = jsonResponse;
            return json;
        }

        protected string GetCultureNameForPublishedContent(IPublishedContent content)
        {
            var culture = _umbracoHelper.GetCulture(content);
            if (culture != null)
            {
                return culture.Name;
            }
            
            var errorMessage = content == null ? "content node is null" : string.Format("culture is null for node with id {0} and name {1}", content.Id, content.Name); 
            _logger.Error(string.Format("Culture for node could not be retrieved because {0}", errorMessage));
            
            return string.Empty;
        }


        public ActionResult Index(RenderModel model)
        {
            throw new NotImplementedException();
        }

        protected List<string> GetErrorsFromModelState(ModelStateDictionary modelState)
        {
            var query = from state in modelState.Values
                        from error in state.Errors
                        select error.ErrorMessage;

            var errorList = query.ToList();
            return errorList;
        }
    }
}