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

        public string Password_local { get; set; }
        public string Password_input { get; set; }
       
    }
}
