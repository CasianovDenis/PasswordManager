using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordManager.Models
{
    public class TempData
    {
        [Required]
        public string Username { get; set; }

        public string NewUsername { get; set; }

        public string NewEmail { get; set; }

        public string NewQuestion { get; set; }

        public string NewAnswer { get; set; }

        public string OldAnswer { get; set; }

    }
}
