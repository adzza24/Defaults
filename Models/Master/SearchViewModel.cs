using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MSD_Umbraco_Portal.UI.Models.Shared;
using Newtonsoft.Json;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Examine;
using Umbraco.Core.Logging;
using Umbraco.Web.Models;

namespace MSD_Umbraco_Portal.UI.Models.Master
{
    public class SearchViewModel
    {
        // Query Parameters
        public string SearchTerm { get; set; }
        public IEnumerable<string> SearchTerms { get; set; }
        public int CurrentPage { get; set; }

        // Options
        public int RootContentNodeId { get; set; }
        public int RootMediaNodeId { get; set; }
        public string IndexType { get; set; }
        public IList<string> SearchFields { get; set; }
        public IList<string> PreviewFields { get; set; }
        public int PreviewLength { get; set; }
        public int PageSize { get; set; }
        public string HideFromSearchField { get; set; }
        public string SearchFormLocation { get; set; }
        public bool ResultsFormatAsJson { get; set; }

        // Results
        public int TotalResults { get; set; }
        public int TotalPages { get; set; }

        public IEnumerable<SearchResult> AllResults { get; set; }
        public IEnumerable<SearchResult> PagedResults { get; set; }
    }
}