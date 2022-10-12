using Effortless.Net.Encryption;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasswordManager.Controllers
{

    [Produces("application/json")]
    [Route("api/projectusers")]
    [ApiController]
    public class ProjectUsersServicesController : Controller
    {
        private readonly ConString _conString;

        public ProjectUsersServicesController(ConString conection)
        {
            _conString = conection;

        }

        [Route("~/api/createuser")]
        [HttpPost]
        public JsonResult CreateAccount([FromBody] ProjectUsers newuser)
        {
            try
            {
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == newuser.Username);
                return Json("This username already exist");
            }
            catch
            {
                try
                {
                    var dbdata = _conString.ProjectUsers.Single(data => data.Email == newuser.Email);
                    return Json("This email already exist");
                }
                catch
                {

                   
                    if (newuser.Secret_question!= "")
                    {
                        if (newuser.Secret_answer != "")
                        {
                           
                            newuser.Secret_question = EncodeTo64(newuser.Secret_question);
                            newuser.Secret_answer = EncodeTo64(newuser.Secret_answer);
                            _conString.ProjectUsers.Add(newuser);
                            _conString.SaveChanges();

                            byte[] key = Bytes.GenerateKey();
                            byte[] iv = Bytes.GenerateIV();
                           

                            //create record in encryption table
                            Encryption_data e_data = new Encryption_data();

                            e_data.Username = newuser.Username;

                            e_data.Key = key;
                            e_data.IV = iv;
                            _conString.Encryption_data.Add(e_data);
                            _conString.SaveChanges();

                            return Json("Create");
                        }
                        else
                            return Json("Secret answer can not be empty");
                    }
                    else
                        return Json("Secret question can not be empty");


                }

            }

        }

        [Route("~/api/smtp")]
        [HttpPost]
        public JsonResult Smtp_password(ProjectUsers user)
        {
            try
            {
                //get email from db
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == user.Username);



                // generate password   
                RandomNumberGenerator generator = new RandomNumberGenerator();
                int rand = generator.RandomNumber(16, 25);

                string str = generator.RandomString(rand, false);

                string pass = generator.RandomPassword();


                //encrypt password 
                byte[] key = Bytes.GenerateKey();
                byte[] iv = Bytes.GenerateIV();
                var crypt_password = Strings.Encrypt(pass, key, iv);

                //update db data

                dbdata.Password = crypt_password;

                _conString.SaveChanges();


                Json_update obj = new Json_update();

                SendEmail send = new SendEmail(crypt_password, dbdata.Email);


                //update encryption data in db
                var dbdata_encrypt = _conString.Encryption_data.Single(data => data.Username == user.Username);
                dbdata_encrypt.Key = key;
                dbdata_encrypt.IV = iv;
                _conString.SaveChanges();

                return Json("succes");
            }
            catch
            {
                return Json("user_not_exist");
            }

        }

        [Route("~/api/login")]
        [HttpPost]
        public JsonResult Login_account(ProjectUsers user)
        {
            try
            {
                //get jey and iv for descrypt pass
                var dbdata_encryption = _conString.Encryption_data.Single(data => data.Username == user.Username);

//decrypt password from post object
          string decrypt_password_1 = Strings.Decrypt(user.Password.Trim(' '), dbdata_encryption.Key, dbdata_encryption.IV);

//decrypt password from db
        var dbdata = _conString.ProjectUsers.Single(data => data.Username == user.Username);
        string decrypt_password_2 = Strings.Decrypt(dbdata.Password.Trim(' '), dbdata_encryption.Key, dbdata_encryption.IV);

                if (decrypt_password_1==decrypt_password_2)
                {
                    return Json("Access_granted");
                }
                else
                    return Json("Password does not match");
            }
            catch
            {
                return Json("User not exist");
            }

        }


        static public string DecodeFrom64(string encodedData)

        {

            byte[] encodedDataAsBytes = System.Convert.FromBase64String(encodedData);

            string returnValue = System.Text.ASCIIEncoding.ASCII.GetString(encodedDataAsBytes);

            return returnValue;

        }

        static public string EncodeTo64(string toEncode)

        {

            byte[] toEncodeAsBytes = System.Text.ASCIIEncoding.ASCII.GetBytes(toEncode);

            string returnValue = System.Convert.ToBase64String(toEncodeAsBytes);

            return returnValue;

        }
    }

}
