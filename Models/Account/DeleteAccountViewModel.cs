using System.ComponentModel.DataAnnotations;

namespace MSD_Umbraco_Portal.UI.Models.Account
{
    public class DeleteAccountViewModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Language { get; set; }

        public string Reason { get; set; }
    }
}