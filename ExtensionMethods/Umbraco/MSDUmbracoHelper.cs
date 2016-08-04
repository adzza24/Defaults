using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Examine;
using Examine.Providers;
using Examine.SearchCriteria;
using log4net;
using MSD.Nordics.WebHelpers.Umbraco.Model;
using MSD.Nordics.WebInterfaces;
using MSD.Nordics.WebInterfaces.Model;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Umbraco.Web;
using Umbraco.Web.Security;

namespace MSD.Nordics.WebHelpers.Umbraco
{
    public class MSDUmbracoHelper : IMSDUmbracoHelper
    {
        private UmbracoContext _umbracoContext;
        private UmbracoHelper _umbracoHelper;
        private IMemberService _umbracoMemberService;
        private ExamineManager _umbracoExamineManager;
        private MembershipHelper _umbracoMembershipHelper;
        private ILog _logger;

        public IPublishedContent CurrentPage { get; private set; }

        public MSDUmbracoHelper(ILog logger)
        {
            _umbracoContext = UmbracoContext.Current;

            if (_umbracoContext != null && _umbracoContext.PublishedContentRequest != null)
            {
                CurrentPage = _umbracoContext.PublishedContentRequest.PublishedContent;
                _umbracoHelper = new UmbracoHelper(_umbracoContext, CurrentPage);
            }
            _umbracoMemberService = _umbracoContext.Application.Services.MemberService;

            _umbracoExamineManager = ExamineManager.Instance;
            _umbracoMembershipHelper = new MembershipHelper(_umbracoContext);
            _logger = logger;
        }

        #region UmbracoHelper

        public IPublishedContent AncenstorOrSelf(IPublishedContent content, int maxLevel)
        {
            return content.AncestorOrSelf(maxLevel);
        }

        /// <summary>
        /// Given a search term, it by default searches the Umbraco search index for content matching the term. 
        /// Wildcards are enabled by default, and searchProvider can optionally be set a different one.
        /// </summary>
        /// <param name="term"></param>
        /// <param name="useWildCards"></param>
        /// <param name="searchProvider"></param>
        /// <returns></returns>
        public IEnumerable<IPublishedContent> TypedSearch(string term, bool useWildCards = true, string searchProvider = null)
        {
            return _umbracoHelper.TypedSearch(term, useWildCards, searchProvider);
        }


        /// <summary>
        /// Given a search term, it by default searches the Umbraco search index for content matching the term. 
        /// Wildcards are enabled by default, and searchProvider can optionally be set a different one.
        /// </summary>
        /// <param name="term"></param>
        /// <param name="useWildCards"></param>
        /// <param name="searchProvider"></param>
        /// <returns></returns>
        public IEnumerable<IPublishedContent> TypedSearch(ISearchCriteria criteria, BaseSearchProvider searchProvider = null)
        {
            return _umbracoHelper.TypedSearch(criteria, searchProvider);
        }


        /// <summary>
        /// Given a node ID , returns a IPublishedContent
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IPublishedContent TypedContent(string id)
        {
            return _umbracoHelper.TypedContent(id);
        }

        public CultureInfo GetCulture(IPublishedContent node)
        {
            var culture = node.GetCulture();
            return culture;
        }

        #endregion UmbracoHelper

        #region MemberService

        public int RegisterUmbracoMember(string username, string email, string memberName, string password, string memberTypeAlias, List<string> roles)
        {
            try
            {
                var newMember = _umbracoMemberService.CreateMember(email, email, memberName, memberTypeAlias);
                _umbracoMemberService.Save(newMember);
                _umbracoMemberService.SavePassword(newMember, password);
                if (newMember != null)
                {
                    AssingRolesForMember(newMember.Id, roles);
                    return newMember.Id;
                }

            }
            catch (Exception)
            {

            }
            return -1;
        }

        public void AssingRolesForMember(int memberId, List<string> roles)
        {
            var memberRoles = _umbracoMemberService.GetAllRoles(memberId).ToArray();
            if (memberRoles.Any())
            {
                _umbracoMemberService.DissociateRoles(new int[] { memberId }, memberRoles);
            }
            _umbracoMemberService.AssignRoles(new int[] { memberId }, roles.ToArray());
        }

        public IMember RetrieveUmbracoMember(string username)
        {
            return _umbracoMemberService.GetByUsername(username);
        }

        public bool UmbracoMemberExists(string emailAddress)
        {
            var existingMember = _umbracoMemberService.GetByEmail(emailAddress);
            return (existingMember != null);
        }

        public bool SaveMemberPassword(string username, string newPassword)
        {
            try
            {
                var member = _umbracoMemberService.GetByUsername(username);
                if (member != null)
                {
                    _umbracoMemberService.SavePassword(member, newPassword);
                    return true;
                }
                return false;
            }
            catch (Exception ee)
            {
                if (_logger.IsErrorEnabled)
                {
                    _logger.Error("Error in SaveMemberPassword of MSDUmbracoHelper");
                    _logger.Error(string.Format("Exception was thrown when trying to change the password for member with username {0}", username));
                    _logger.Error(string.Format("Exception message is {0}", ee.Message));
                }
                return false;
            }
        }

        public bool MemberExists(string username)
        {
            return _umbracoMemberService.Exists(username);
        }

        public bool UpdateUmbracoMemberPropertyValue(string memberEmail, string propertyName, object value)
        {
            var existingMember = _umbracoMemberService.GetByEmail(memberEmail);
            if (existingMember != null)
            {
                if (existingMember.Properties.Contains(propertyName))
                {
                    existingMember.SetValue(propertyName, value);
                    _umbracoMemberService.Save(existingMember);
                    return true;
                }
            }
            if (_logger.IsErrorEnabled)
            {
                _logger.Error("Error in UpdateUmbracoMemberPropertyValue of MSDUmbracoHelper");
                _logger.Error(string.Format("Property with name {0} not found. Could not populate the property of the umbraco member {1}", propertyName, memberEmail));
            }
            return false;
        }

        public T GetMemberPropertyValue<T>(string memberEmail, string  propertyName)
        {
            var existingMember = _umbracoMemberService.GetByEmail(memberEmail);
            if (existingMember != null)
            {
                var propertyValue = existingMember.GetValue<T>(propertyName);
                return propertyValue;
            }
            if (_logger.IsErrorEnabled)
            {
                _logger.Error("Error in GetMemberPropertyValue of MSDUmbracoHelper");
                _logger.Error(string.Format("Could not retrieve the property {0} of the umbraco member {1}. The member does not exist in the cms or the property does not exist for that member.", propertyName, memberEmail));
            }
            return default(T);

        }

        public bool DeleteUmbracoMember(string username)
        {
            var existingMember = _umbracoMemberService.GetByUsername(username);
            if (existingMember != null)
            {
                _umbracoMemberService.Delete(existingMember);
                return true;
            }
            return false;
        }

        public bool UpdateMemberEmailAddress(string username, string newUsername)
        {
            try
            {
                var member = _umbracoMemberService.GetByUsername(username);
                member.Username = newUsername;
                member.Email = newUsername;
                member.Name = newUsername;
                _umbracoMemberService.Save(member);
            }
            catch (Exception ee)
            {
                if (_logger.IsErrorEnabled)
                {
                    _logger.Error("Error in UpdateMemberEmailAddress of MSDUmbracoHelper");
                    _logger.Error(string.Format("Exception was thrown when trying to change the emailAddress and username for member with username {0}", username));
                    _logger.Error(string.Format("Exception message is {0}", ee.Message));
                } 
                return false;
            }
            return true;
        }

        #endregion MemberService

        #region ExamineSearch

        /// <summary>
        /// Retrieves root published content node with the given node name and document type alias.
        /// </summary>
        /// <param name="nodeName">published content node name</param>
        /// <param name="nodeAlias">document type alias of the node</param>
        /// <returns></returns>
        public IPublishedContent GetRootNode(string nodeName, string nodeAlias)
        {
            var query = _umbracoExamineManager.CreateSearchCriteria().NodeTypeAlias(nodeAlias).And().NodeName(nodeName).Compile();
            var node = _umbracoHelper.TypedSearch(query).FirstOrDefault();

            if (node.Ancestor() == null)
                return node;
            return null;
        }


        /// <summary>
        /// Retrieves child published content node (first or default) of the document type alias specified for the given parent node.
        /// </summary>
        /// <param name="parentNodeId">parent node id</param>
        /// <param name="nodeAlias">child node document type alias</param>
        /// <returns></returns>
        public IPublishedContent GetNodeWithParent(int parentNodeId, string nodeAlias)
        {
            var query = ExamineManager.Instance.CreateSearchCriteria()
                        .NodeTypeAlias(nodeAlias)
                        .And()
                        .ParentId(parentNodeId).Compile();

            var node = _umbracoHelper.TypedSearch(query).FirstOrDefault();

            return node;
        }

        /// <summary>
        /// Retrieves child published content node (first or default) of the document type alias and name specified for the given parent node
        /// </summary>
        /// <param name="parentNodeId">parent node id</param>
        /// <param name="nodeAlias">child node document type alias</param>
        /// /// <param name="nodeName">child node name</param>
        /// <returns></returns>
        public IPublishedContent GetNodeWithParent(int parentNodeId, string nodeAlias, string nodeName)
        {
            var query = ExamineManager.Instance.CreateSearchCriteria()
                        .NodeName(nodeName)
                        .And()
                        .NodeTypeAlias(nodeAlias)
                        .And()
                        .ParentId(parentNodeId).Compile();

            var node = _umbracoHelper.TypedSearch(query).FirstOrDefault();

            return node;
        }

        /// <summary>
        /// Retrieves descendant published content nodes of the a certain document type alias for the given ancestor node identified by its Id 
        /// (uses Examine)
        /// </summary>
        /// <param name="ancenstorNodeId">ancenstor node id</param>
        /// <param name="descendantNodeAlias">descendant node document type alias</param>
        /// <returns></returns>
        public IEnumerable<IPublishedContent> GetDescendantNodesOfType(int ancenstorNodeId, string descendantNodeAlias)
        {
            var query =
                ExamineManager.Instance.CreateSearchCriteria()
                    .RawQuery(string.Format(@"+path:\-1,{0},* +nodeTypeAlias:{1}", ancenstorNodeId, descendantNodeAlias));

            return _umbracoHelper.TypedSearch(query);
        }

        /// <summary>
        /// Retrieves descendant published content node of the document type alias and with a certain name for the given ancenstor node identified by Id 
        /// (uses Examine)
        /// </summary>
        /// <param name="ancenstorNodeId">ancenstor node id</param>
        /// <param name="descendantNodeAlias">descendant node document type alias</param>
        ///  /// <param name="descendantNodeName">descendant node name</param>
        /// <returns></returns>
        public IPublishedContent GetDescendantNode(int ancenstorNodeId, string descendantNodeAlias, string descendantNodeName)
        {
            var nodesOfType = GetDescendantNodesOfType(ancenstorNodeId, descendantNodeAlias);
            return nodesOfType.FirstOrDefault(item => item.Name.Equals(descendantNodeName));
        }

        /// <summary>
        /// Retrieves child published content nodse of the document type alias specified for the given parent node
        /// (uses Examine)
        /// </summary>
        /// <param name="parentNodeId">parent node id</param>
        /// <param name="nodeAlias">child node document type alias</param>
        /// <returns></returns>
        public IEnumerable<IPublishedContent> GetNodesWithParent(int parentNodeId, string nodeAlias)
        {
            var query = ExamineManager.Instance.CreateSearchCriteria()
                .NodeTypeAlias(nodeAlias)
                .And()
                .ParentId(parentNodeId).Compile();

            var nodes = _umbracoHelper.TypedSearch(query);

            return nodes;
        }

        public ILinkModel GetNodeUrl(int nodeId)
        {
            var linkModel = new LinkModel();
            return linkModel;
        }

        #endregion ExamineSearch

        //TODO - remove
        #region UserService


        private bool CreateAdminUserWithFullSectionAccess(string username, string email, string password)
        {
            try
            {
                var adminType = _umbracoContext.Application.Services.UserService.GetUserTypeByAlias("admin");
                if (adminType != null)
                {
                    var checkExisting = _umbracoContext.Application.Services.UserService.GetByUsername(username);
                    if (checkExisting == null)
                    {
                        var userAdmin = _umbracoContext.Application.Services.UserService.CreateUserWithIdentity(username, email, adminType);
                        _umbracoContext.Application.Services.UserService.SavePassword(userAdmin, password);
                        AddFullSectionAccessToUser(username);
                        return true;
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
            return false;

        }

        private bool AddFullSectionAccessToUser(string username)
        {
            try
            {
                var user = _umbracoContext.Application.Services.UserService.GetByUsername(username);
                if (user != null)
                {
                    var sections = _umbracoContext.Application.Services.SectionService.GetSections();
                    foreach (var section in sections)
                    {
                        _umbracoContext.Application.Services.UserService.AddSectionToAllUsers(section.Alias,
                            new int[] { user.Id });
                    }
                    return true;
                }
            }
            catch (Exception)
            {


            }
            return false;
        }

        public void GetMemberGroups()
        {
            var memberGroups = _umbracoContext.Application.Services.MemberGroupService.GetAll();
            foreach (var memberGroup in memberGroups)
            {
                _umbracoContext.Application.Services.MemberGroupService.Delete(memberGroup);
            }


        }



        #endregion UserService

    }
}
