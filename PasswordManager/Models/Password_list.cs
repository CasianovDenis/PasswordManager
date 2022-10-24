using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordManager.Models
{
    public class Password_list
    {
        
            // These are just simple ways of creating a getter and setter in c#
            public string Name { get; set; }
            public string Description { get; set; }
            public string Password { get; set; }

            // A constructor which sets all your getters and setters
            public Password_list(string name, string description, string password)
            {
                Name = name;
                Description = description;
                Password = password;
            }
        
    }
}
