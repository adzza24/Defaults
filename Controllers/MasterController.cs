using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI;
using log4net;
using Microsoft.AspNet.Identity;
using MSD.Nordics.Interfaces.Config;
using MSD.Nordics.Interfaces.Mapper;
using MSD.Nordics.WebInterfaces;
using MSD.Nordics.WebInterfaces.Cache;
using MSD_Umbraco_Portal.UI.Models.Master;
using MSD_Umbraco_Portal.UI.Models.Shared;
using Newtonsoft.Json;
using Umbraco.Core.Models;

namespace MSD_Umbraco_Portal.UI.Controllers
{
    public class MSDMasterController : MSDBaseController
    {
        public MSDMasterController(IMSDUmbracoHelper umbracoHelper, IMSDUmbracoMapper umbracoMapper, IMapper mapper, INodeConfig nodeConfig, ICacheProvider cacheProvider, ILog logger)
            : base(umbracoHelper, umbracoMapper, mapper, nodeConfig, cacheProvider, logger)
        { }

        [ChildActionOnly]
        //[OutputCache(Duration = 2400, VaryByHeader = "host")]
        public PartialViewResult Header()
        {
            var currentPage = _umbracoHelper.CurrentPage;
            var cultureName = GetCultureNameForPublishedContent(currentPage);

            var headerModel = _cacheProvider.CachedGet<HeaderViewModel>(string.Format("{0}_{1}", "Header", cultureName), () =>
            {
                var headerViewModel = new HeaderViewModel();

                var dictionaryTerms = new HeaderDictionaryViewModel();
                _umbracoMapper.MapUsingDictionary(dictionaryTerms);
                headerViewModel.SetDictionary(dictionaryTerms);

                var homePageNode = _umbracoHelper.AncenstorOrSelf(currentPage, 1);
                var homePageUrl = homePageNode != null ? homePageNode.Url : string.Empty;
                headerViewModel.HomeUrl = homePageUrl;

                var registerNode = _umbracoHelper.GetDescendantNodesOfType(homePageNode.Id, _nodeConfig.RegisterNodeAlias).FirstOrDefault();
                var registerPageUrl = registerNode != null ? registerNode.Url : string.Empty;
                headerViewModel.RegisterUrl = registerPageUrl;

                var loginNode = _umbracoHelper.GetDescendantNodesOfType(homePageNode.Id, _nodeConfig.LoginNodeAlias).FirstOrDefault();
                var loginUrl = loginNode != null ? loginNode.Url : string.Empty;
                headerViewModel.LoginUrl = loginUrl;

                return headerViewModel;
            });

            return PartialView("Header", headerModel);
        }

        [ChildActionOnly]
        //OutputCacheAttribute for child actions only supports Duration, VaryByCustom, and VaryByParam 
        //[OutputCache(Duration = 2400, VaryByParam = "none", VaryByHeader = "host")]
        public PartialViewResult Footer()
         {
            var currentPage = _umbracoHelper.CurrentPage;
            var footerViewModel = new FooterViewModel();

            var homePageNode = _umbracoHelper.AncenstorOrSelf(currentPage, 1);
            var homePageUrl = homePageNode != null ? homePageNode.Url : string.Empty;
            footerViewModel.HomeUrl = homePageUrl;

            var dictionaryTerms = new FooterDictionaryViewModel();
            _umbracoMapper.MapUsingDictionary(dictionaryTerms);
            footerViewModel.SetDictionary(dictionaryTerms);

            var registerNode = _umbracoHelper.GetDescendantNodesOfType(homePageNode.Id, _nodeConfig.RegisterNodeAlias).FirstOrDefault();
            if (registerNode != null)
            {
                var registerUrl = new UrlViewModel();
                registerUrl.Name = registerNode.Name;
                registerUrl.Url = registerNode.Url;
                footerViewModel.RegisterUrl = registerUrl;
            }

            var homePageViewModel = new HomeViewModel();
            _umbracoMapper.Map(homePageNode, homePageViewModel);
            if (!string.IsNullOrEmpty(homePageViewModel.FooterLinks) &&
                !string.IsNullOrWhiteSpace(homePageViewModel.FooterLinks))
            {
                var homeLinks = RetrieveHomeFooterLinks(homePageViewModel.FooterLinks);
                footerViewModel.RelatedLinks = homeLinks;
            }
            
            var currentUser = User.Identity;
            //TODO differentiate between umbraco members and umbraco back office users: _umbracoHelper.MemberExists(User.Identity.Name)
            if (User.Identity.IsAuthenticated)
            {
                if (currentPage.DocumentTypeAlias.Equals(_nodeConfig.SiloNodeAlias))
                {
                    var links = RetrieveFooterLinks(currentPage.Id, _nodeConfig.SubSiloNodeAlias).ToList();
                    footerViewModel.Links = links;
                }
                else
                {
                    var links = RetrieveAuthenticatedFooterLinks(currentUser.GetUserName(), homePageNode.Id).ToList();
                    footerViewModel.Links = links;
                }
            }
            else
            {
                var links = RetrieveDefaultFooterLinks(homePageNode.Id, _nodeConfig.AboutGroupAlias, _nodeConfig.AboutPageAlias).ToList();
                footerViewModel.Links = links;
            }
            
            return PartialView("Footer", footerViewModel);
        }
        

        //TODO - no unit tests untill requirements are clear and jira task created
        //initially this was just refactoring existing logic from the view into the controller action
        //it generates dynamic css based on the information stored in the umbraco nodes
        public PartialViewResult BrandCSS()
        {

            var umbracoModel = new UmbracoColorPropertyViewModel();

            var siloModel = new List<DynamicColorViewModel>();
            var dynamicCssViewModel = new DynamicCssViewModel();

            var currentPage = _umbracoHelper.CurrentPage;
            var currentPageNodeAlias = currentPage.DocumentTypeAlias;

            if (currentPageNodeAlias.Equals(_nodeConfig.TreatmentPageNodeAlias))
            {
                _umbracoMapper.Map(currentPage, umbracoModel);
                var brandModel = JsonConvert.DeserializeObject<DynamicColorViewModel>(umbracoModel.Brand);
                dynamicCssViewModel.BrandColour = brandModel;
            }

            // cache this bit based on currentPage.Language
            var homePageNode = _umbracoHelper.AncenstorOrSelf(currentPage, 1);
            var silos = _umbracoHelper.GetDescendantNodesOfType(homePageNode.Id, _nodeConfig.SiloNodeAlias).ToList();

            foreach (var silo in silos)
            {
                _umbracoMapper.Map(silo, umbracoModel);
                var specialtyModel = JsonConvert.DeserializeObject<DynamicColorViewModel>(umbracoModel.SpecialtyColor);
                siloModel.Add(specialtyModel);
            }
            dynamicCssViewModel.SiloColours = siloModel;

            return PartialView("BrandCSS", dynamicCssViewModel);
        }

        [ChildActionOnly]
        [OutputCache(Duration = 240)]
        public PartialViewResult Meta()
        {
            return PartialView("Meta");
        }

        [ChildActionOnly]
        public PartialViewResult Modal()
        {
            var currentPage = _umbracoHelper.CurrentPage;
            var cultureName = GetCultureNameForPublishedContent(currentPage);

            var modalViewModel = new ModalViewModel();

            var dictionaryTerms = new ModalDictionaryViewModel();
            _umbracoMapper.MapUsingDictionary(dictionaryTerms);
            modalViewModel.SetDictionary(dictionaryTerms);

            return PartialView("Modal", modalViewModel);
        }

        [ChildActionOnly]
        [OutputCache(Duration = 240, VaryByParam = "none", Location = OutputCacheLocation.Client, NoStore = true )]
        public PartialViewResult ExitPage()
        {
            var currentPage = _umbracoHelper.CurrentPage;
            var cultureName = GetCultureNameForPublishedContent(currentPage);

            var exitModel = _cacheProvider.CachedGet<ExitPageViewModel>(string.Format("{0}_{1}", "ExitPage", cultureName), () =>
            {
                var exitViewModel = new ExitPageViewModel();

                var homePageNode = _umbracoHelper.AncenstorOrSelf(currentPage, 1);
                var exitNode = _umbracoHelper.GetDescendantNodesOfType(homePageNode.Id, _nodeConfig.ExitNodeAlias).FirstOrDefault();
                _umbracoMapper.Map(exitNode, exitViewModel);

                var dictionaryTerms = new ExitPageDictionaryViewModel();
                _umbracoMapper.MapUsingDictionary(dictionaryTerms);
                exitViewModel.SetDictionary(dictionaryTerms);

                return exitViewModel;
            });

            return PartialView("ExitPage", exitModel);
        }

        [ChildActionOnly]
        public PartialViewResult CurrentLanguage()
        {
            var currentPage = _umbracoHelper.CurrentPage;
            var cultureName = GetCultureNameForPublishedContent(currentPage);
            var languageViewModel = new LanguageViewModel();
            languageViewModel.NodeLanguage = cultureName;
            languageViewModel.NodeName = currentPage.Name;
            languageViewModel.NodeUrl = currentPage.Url;

            return PartialView("CurrentLanguage", languageViewModel);
        }

        #region Helpers

        private IEnumerable<UrlViewModel> RetrieveDefaultFooterLinks(int rootNodeId, string descendantNodeAlias, string childNodeAlias)
        {
            var aboutViewModel = new List<UrlViewModel>();
            var aboutPageNodes = new List<IPublishedContent>();
            var descendantNodes =
                _umbracoHelper.GetDescendantNodesOfType(rootNodeId, descendantNodeAlias).ToList();
            foreach (var item in descendantNodes)
            {
                var childNodes = _umbracoHelper.GetNodesWithParent(item.Id, childNodeAlias).ToList();
                aboutPageNodes.AddRange(childNodes);
            }

            _umbracoMapper.MapCollection(aboutPageNodes, aboutViewModel);
            return aboutViewModel;
        }

        private IEnumerable<UrlViewModel> RetrieveFooterLinks(int parentNodeId, string childNodeAlias)
        {
            var aboutViewModel = new List<UrlViewModel>();
            var childNodes =
                _umbracoHelper.GetNodesWithParent(parentNodeId, childNodeAlias);

            _umbracoMapper.MapCollection(childNodes, aboutViewModel);
            return aboutViewModel;
        }


        private IEnumerable<UrlViewModel> RetrieveAuthenticatedFooterLinks(string username, int parentNodeId)
        {
            string specialtyName = string.Empty;
            var linksViewModel = new List<UrlViewModel>();
            var member = _umbracoHelper.RetrieveUmbracoMember(username);
            if (member != null)
            {
                specialtyName = member.GetValue<string>(_nodeConfig.MemberSpecialtyPropertyName);
                if (!string.IsNullOrEmpty(specialtyName) && !string.IsNullOrWhiteSpace(specialtyName))
                {
                    var node = _umbracoHelper.GetDescendantNode(parentNodeId, _nodeConfig.SiloNodeAlias, specialtyName);
                    if (node != null)
                    {
                        var childNodes = _umbracoHelper.GetNodesWithParent(node.Id, _nodeConfig.SubSiloNodeAlias);
                        _umbracoMapper.MapCollection(childNodes, linksViewModel);
                    }
                }
            }
            return linksViewModel;
        }

        private IEnumerable<RelatedLinkViewModel> RetrieveHomeFooterLinks(string footerLinksValue)
        {
            var relatedLinks = JsonConvert.DeserializeObject<List<RelatedLinkViewModel>>(footerLinksValue);
            return relatedLinks;
        }

      

        #endregion Helpers
    }
}
