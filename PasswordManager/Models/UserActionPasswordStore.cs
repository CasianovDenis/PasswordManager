using System.ComponentModel.DataAnnotations;

namespace PasswordManager.Models
{
    public class UserActionPasswordStore : Password_store
    {
        [Required]
        public string AuthorizationToken { get; set; }
    }
}
