using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordManager.Models
{
    public class Password_store
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Name { get; set; }
       [Required]
        public string Password { get; set; }
        public string Description { get; set; }
       
        public byte[] Key { get; set; }
        public byte[] IV { get; set; } 

    }
}
