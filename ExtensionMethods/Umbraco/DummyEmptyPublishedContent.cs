using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models;
using Umbraco.Core.Models.PublishedContent;

namespace MSD.Nordics.WebHelpers.Umbraco
{
    internal class DummyEmptyPublishedContent : IPublishedContent
    {
        public IEnumerable<IPublishedContent> Children
        {
            get { return null; }
        }

        public IEnumerable<IPublishedContent> ContentSet
        {
            get { return null; }
        }

        public PublishedContentType ContentType
        {
            get { return null; }
        }

        public DateTime CreateDate
        {
            get { return DateTime.Now; }
        }

        public int CreatorId
        {
            get { return 0; }
        }

        public string CreatorName
        {
            get { return string.Empty; }
        }

        public string DocumentTypeAlias
        {
            get { return string.Empty; }
        }

        public int DocumentTypeId
        {
            get { return 0; }
        }

        public int GetIndex()
        {
            return 0;
        }

        public IPublishedProperty GetProperty(string alias, bool recurse)
        {
            return null;
        }

        public IPublishedProperty GetProperty(string alias)
        {
            return null;
        }

        public int Id
        {
            get { return 0; }
        }

        public bool IsDraft
        {
            get { return false; }
        }

        public PublishedItemType ItemType
        {
            get { return PublishedItemType.Content; }
        }

        public int Level
        {
            get { return 0; }
        }

        public string Name
        {
            get { return string.Empty; }
        }

        public IPublishedContent Parent
        {
            get { return null; }
        }

        public string Path
        {
            get { return string.Empty; }
        }

        public ICollection<IPublishedProperty> Properties
        {
            get { return new List<IPublishedProperty>(); }
        }

        public int SortOrder
        {
            get { return 0; }
        }

        public int TemplateId
        {
            get { return 0; }
        }

        public DateTime UpdateDate
        {
            get { return DateTime.Now; }
        }

        public string Url
        {
            get { return string.Empty; }
        }

        public string UrlName
        {
            get { return string.Empty; }
        }

        public Guid Version
        {
            get { return Guid.Empty; }
        }

        public int WriterId
        {
            get { return 0; }
        }

        public string WriterName
        {
            get { return string.Empty; }
        }

        public object this[string alias]
        {
            get { return null; }
        }
    }
}
