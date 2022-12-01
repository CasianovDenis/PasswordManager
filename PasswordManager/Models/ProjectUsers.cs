using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordManager.Models
{
    public class ProjectUsers
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public string Username { get; set; }
        
        public string Email { get; set; }
       
        public string Password { get; set; }
       
        public string Secret_question { get; set; }
        public string Secret_answer { get; set; }

        public string Time_ban {get; set;}

    }
}
