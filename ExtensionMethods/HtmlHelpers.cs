using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

using Newtonsoft.Json;

using Examine;

using Umbraco;
using Umbraco.Web;
using Umbraco.Web.Mvc;
using Umbraco.Web.Models;
using Umbraco.Web.Macros;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Core.Logging;

using MSD;
using MSD.Nordics;
using MSD.Nordics.WebInterfaces;
using MSD.Nordics.WebInterfaces.Cache;

using Umbraco.Web.Templates;

namespace MSD.Nordics.WebHelpers.ExtensionMethods
{
    public static class HtmlHelpers
    {
        public static MvcHtmlString JavaScriptVariableFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string javascriptVariableName)
        {
            var scriptTag = new TagBuilder("script");

            var expr = expression.Compile();
            var exprVal = expr(htmlHelper.ViewData.Model);
            var json = JsonConvert.SerializeObject(exprVal);
            var scriptContents = string.Format("var {0} = {1};", javascriptVariableName, json);
            scriptTag.InnerHtml = scriptContents;
            var htmlString = new MvcHtmlString(scriptTag.ToString());

            return htmlString;
        }

        public static string CleanseSearchTerm(string input)
        {
            UmbracoHelper uHelper = new UmbracoHelper(UmbracoContext.Current);
            return uHelper.StripHtml(input).ToString();
        }

        public static IEnumerable<string> Tokenize(string input)
        {
            return Regex.Matches(input, @"[\""].+?[\""]|[^ ]+")
                .Cast<Match>()
                .Select(m => m.Value.Trim('\"'))
                .ToList();
        }

        // Highlights all occurances of the search terms in a body of text
        public static IHtmlString Highlight(IHtmlString input, IEnumerable<string> searchTerms)
        {
            return Highlight(input.ToString(), searchTerms);
        }

        // Highlights all occurances of the search terms in a body of text
        public static IHtmlString Highlight(string input, IEnumerable<string> searchTerms)
        {
            input = HttpUtility.HtmlDecode(input);

            foreach (var searchTerm in searchTerms)
            {
                input = Regex.Replace(input, Regex.Escape(searchTerm), @"<strong>$0</strong>", RegexOptions.IgnoreCase);
            }

            return new HtmlString(input);
        }

        // Formats a string and returns as HTML
        public static IHtmlString FormatHtml(string input, params object[] args)
        {
            return new MvcHtmlString(string.Format(input, args));
            
        }

        // Gets a dictionary value with a fallback
        public static string GetDictionaryValue(string key, string fallback)
        {
            UmbracoHelper uHelper = new UmbracoHelper(UmbracoContext.Current);
            var value = uHelper.GetDictionaryValue(key);

            return !string.IsNullOrEmpty(value)
                ? value
                : fallback;
        }

        // Truncates a string on word breaks
        public static string Truncate(IHtmlString input, int maxLength)
        {
            return Truncate(input.ToString(), maxLength);
        }

        // Truncates a string on word breaks
        public static string Truncate(string input, int maxLength)
        {
            UmbracoHelper uHelper = new UmbracoHelper(UmbracoContext.Current);
            var truncated = uHelper.Truncate(input, maxLength, true).ToString();
            if (truncated.Length < input.Length)
            {
                var lastSpaceIndex = truncated.LastIndexOf(' ');
                if (lastSpaceIndex > 0)
                {
                    truncated = truncated.Substring(0, lastSpaceIndex) + "&hellip;";
                }
            }

            return truncated;
        }

        // Gets a macro parameter in a safe manner with fallback
        public static string GetMacroParam(PartialViewMacroModel model, string key, string fallback)
        {
            return GetMacroParam(model, key, s => s, fallback);
        }

        // Gets a macro parameter in a safe manner with fallback
        public static TType GetMacroParam<TType>(PartialViewMacroModel model, string key, Func<string, TType> convert, TType fallback)
        {
            if (!model.MacroParameters.ContainsKey(key))
            {
                return fallback;
            }

            var value = model.MacroParameters[key];
            if (value == null || value.ToString().Trim() == "")
            {
                return fallback;
            }

            try
            {
                return convert(value.ToString());
            }
            catch (Exception)
            {
                return fallback;
            }
        }

        // Splits a coma seperated string into a list
        public static IList<string> SplitToList(string input)
        {
            IEnumerable<string> list = input.Split(',');
            return list.Select(f => f.Trim())
                .Where(f => !string.IsNullOrEmpty(f))
                .ToList();
        }

        public static string RemoveEndTags(string input)
        {
            string lastTag = "";
            if (input.EndsWith(">"))
            {
                lastTag = input.Substring(input.LastIndexOf('<'));
                input = input.Substring(0, input.LastIndexOf('<'));
            }
            if (input.EndsWith(">"))
            {
                lastTag = RemoveEndTags(input) + lastTag;
            }

            return lastTag;
        }
        public static bool HasContent(dynamic grid)
        {
            bool hasContent = false;
            if (grid != null && grid.sections.First != null && grid.sections.First.rows != null && grid.sections.First.rows.First != null && grid.sections.First.rows.First.areas != null && grid.sections.First.rows.First.areas.First != null && grid.sections.First.rows.First.areas.First.controls != null)
            {
                hasContent = grid.sections.First.rows.First.areas.First.controls.HasValues;
            }

            return hasContent;
        }
    }
}
