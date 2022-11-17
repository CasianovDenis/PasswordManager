using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace PasswordManager.Models
{
    public class SendEmail
    {
        public SendEmail(string Password,string Email)
        {
            //Send email which contain crypted password
            SmtpClient Smtp = new SmtpClient("smtp.mail.ru", 587);
            Smtp.EnableSsl = true;
            Smtp.Credentials = new NetworkCredential("kasyanov_2001@mail.ru", "VnpsqpHSY8pysJn7Lmum");//real email and password
                                                                                                      //was hide
            MailMessage Message = new MailMessage();
            Message.From = new MailAddress("kasyanov_2001@mail.ru");//real email was hide

            Message.To.Add(new MailAddress(Email));
            Message.Subject = "one-time password";
            Message.Body = "Use this password " + Password + " for log in account online password manager "
                 + "\n" +
                "This password is one-time,after you log in account you can not use password again.";

            Smtp.Send(Message);
        }
    }
}
