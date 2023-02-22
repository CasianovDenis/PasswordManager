using System.ComponentModel.DataAnnotations;

namespace PasswordManager.Models
{
    public class EditUserData
    {
        [Required]
        public string Username { get; set; }

        public string NewUsername { get; set; }

        public string NewEmail { get; set; }

        public string NewQuestion { get; set; }

        public string NewAnswer { get; set; }

        public string OldAnswer { get; set; }

        [Required]
        public string AuthorizationToken { get; set; }

    }
}
