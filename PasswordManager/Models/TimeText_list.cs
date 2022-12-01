using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordManager.Models
{
    public class TimeText_list
    {
        public string Text { get; set; }

        public string Time { get; set; }

       public TimeText_list(string text,string time)
        {
            Text = text;
            Time = time;
        }
    }
}
