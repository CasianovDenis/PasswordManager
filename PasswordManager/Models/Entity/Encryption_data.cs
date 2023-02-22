using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordManager.Models
{
    public class Encryption_data
    {
        [Key]
        public int ID { get; set; }

        
        public string Username { get; set; }


        public byte[] Key { get; set; }

        public byte[] IV { get; set; }
    }
}
