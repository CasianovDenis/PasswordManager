using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordManager.Models
{
    public class ConString : DbContext
    {

        public ConString(DbContextOptions<ConString> options) : base(options)
        {

        }

        public DbSet<ProjectUsers> ProjectUsers { get; set; }
        public DbSet<Encryption_data> Encryption_data { get; set; }

        public DbSet<Password_store> Password_store { get; set; }
    }
}
