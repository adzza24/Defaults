using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MSD.Nordics.WebInterfaces;
using Umbraco.Core.Models;
using Zone.UmbracoMapper;

namespace MSD.Nordics.WebHelpers.Umbraco
{
    public class MSDUmbracoMapper : UmbracoMapper, IMSDUmbracoMapper
    {
        public IMSDUmbracoMapper Map<T>(IPublishedContent content, T model) where T : class
        {
            return (IMSDUmbracoMapper)base.Map(content, model);
        }

        public IMSDUmbracoMapper MapCollection<T>(
            IEnumerable<IPublishedContent> contentCollection, IList<T> modelCollection)
            where T : class, new()
        {
            return (IMSDUmbracoMapper)base.MapCollection(contentCollection, modelCollection);
        }

        public IMSDUmbracoMapper MapUsingDictionary<T>(T model) where T : class
        {
            var dummyPublishedContent = new DummyEmptyPublishedContent();

            var propeties = typeof(T).GetProperties().Where(p => p.CanWrite).ToList();

            var dictionary = propeties.Select(
                p => new KeyValuePair<string, PropertyMapping>(p.Name, new PropertyMapping { DictionaryKey = p.Name }))
                .ToDictionary(d => d.Key, d => d.Value);

            return (IMSDUmbracoMapper)base.Map(dummyPublishedContent, model, dictionary);
        }
    }
}
