using Effortless.Net.Encryption;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PasswordManager.Controllers
{

    [Produces("application/json")]
    [Route("api/projectusers")]
    [ApiController]
    public class ProjectUsersController : Controller
    {
        private readonly ConString _conString;

        public ProjectUsersController(ConString conection)
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


                    if (newuser.Secret_question != "")
                    {
                        if (newuser.Secret_answer != "")
                        {

                            newuser.AuthorizationToken = "null";
                            _conString.ProjectUsers.Add(newuser);
                            _conString.SaveChanges();




                            //create record in encryption table
                            Encryption_data e_data = new Encryption_data();

                            e_data.Username = newuser.Username;

                            e_data.Key = null;
                            e_data.IV = null;
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


        [HttpGet("~/api/send_one_time_password/{Username}")]
        public JsonResult Smtp_password(string Username)
        {
            try
            {

                var dbdata = _conString.ProjectUsers.Single(data => data.Username == Username);
                DateTime currentTime = DateTime.Now;
                DateTime timeDB = Convert.ToDateTime(dbdata.Time_ban);

                if (dbdata.Time_ban == null || currentTime > timeDB)
                {


                    RandomNumberGenerator generator = new RandomNumberGenerator();
                    int rand = generator.RandomNumber(16, 25);

                    string str = generator.RandomString(rand, false);

                    string pass = generator.RandomPassword();



                    byte[] key = Bytes.GenerateKey();
                    byte[] iv = Bytes.GenerateIV();
                    var crypt_password = Strings.Encrypt(pass, key, iv);



                    dbdata.Password = crypt_password;


                    _conString.SaveChanges();




                    SendOneTimePasswordEmail send = new SendOneTimePasswordEmail(crypt_password, dbdata.Email);



                    var dbdata_encrypt = _conString.Encryption_data.Single(data => data.Username == Username);
                    dbdata_encrypt.Key = key;
                    dbdata_encrypt.IV = iv;
                    _conString.SaveChanges();

                    return Json("Password is sended in the email." + '\n' +
                                        "Mail can come delay or you can find him in the spam");

                }
                else
                    return Json("time ban");
            }
            catch
            {
                return Json("user not exist");
            }

        }

        [Route("~/api/login")]
        [HttpPost]
        public JsonResult Login_account(ProjectUsers user)
        {
            try
            {
                //get key and iv for descrypt pass
                var dbdata_encryption = _conString.Encryption_data.Single(data => data.Username == user.Username);

                //decrypt password from post object
                string decrypt_password_1 = Strings.Decrypt(user.Password.Trim(' '), dbdata_encryption.Key, dbdata_encryption.IV);

                //decrypt password from db
                var user_data = _conString.ProjectUsers.Single(data => data.Username == user.Username);
                string decrypt_password_2 = Strings.Decrypt(user_data.Password.Trim(' '), dbdata_encryption.Key, dbdata_encryption.IV);

                if (decrypt_password_1 == decrypt_password_2)
                {
                    user_data.Password = "";
                    user_data.AuthorizationToken = RandomString(25);

                    dbdata_encryption.IV = null;
                    dbdata_encryption.Key = null;
                    _conString.SaveChanges();
                    return Json(user_data.AuthorizationToken);
                }
                else
                    return Json("Password does not match");
            }
            catch
            {
                return Json("Password incorect");
            }

        }

        [Route("~/api/login_wrong")]
        [HttpPost]
        public JsonResult Login_wrong(ProjectUsers user)
        {
            try
            {
                //get key and iv for descrypt pass
                var dbdata_encryption = _conString.Encryption_data.Single(data => data.Username == user.Username);


                var dbdata = _conString.ProjectUsers.Single(data => data.Username == user.Username);


                dbdata.Password = null;
                DateTime currentTime = DateTime.Now;

                dbdata.Time_ban = currentTime.AddMinutes(30).ToString();
                dbdata_encryption.IV = null;
                dbdata_encryption.Key = null;
                _conString.SaveChanges();

                return Json("Password canceled,you was used all your attempts ");

            }
            catch
            {
                return Json("User not exist");
            }

        }

        [Route("~/api/sendanswer")]
        [HttpPost]
        public JsonResult SendAnswer(ProjectUsers user)
        {
            try
            {
                var user_data = _conString.ProjectUsers.Single(data => data.Username == user.Username);



                if (DecodeFrom64(user.Secret_answer) == DecodeFrom64(user_data.Secret_answer))
                {

                    user_data.AuthorizationToken = RandomString(25);

                    _conString.SaveChanges();


                    return Json(user_data.AuthorizationToken);
                }

                return Json("Answer isn't right");
            }
            catch
            {

                return Json("User not exist");

            }

        }



        [HttpGet("~/api/getquestion/{Username}")]
        public JsonResult GetQuestion(string Username)
        {
            try
            {
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == Username);



                List<TimeText_list> new_list = new List<TimeText_list>();

                new_list.Add(new TimeText_list(DecodeFrom64(dbdata.Secret_question), dbdata.Time_ban));
                return Json(new_list);
            }
            catch
            {

                return Json(null);

            }

        }


        [HttpGet("~/api/getuserdata/{Username}/{authorizationToken}")]
        public JsonResult GetData(string Username, string authorizationToken)
        {
            try
            {
                var user_data = _conString.ProjectUsers.Single(data => data.Username == Username);

                if (user_data.AuthorizationToken == authorizationToken)
                {
                    user_data.Secret_question = DecodeFrom64(user_data.Secret_question);

                    return Json(user_data);
                }
                else
                    return Json("Incorrect authorization token");
            }
            catch
            {

                return Json("Incorrect username");

            }

        }

        [Route("~/api/edit_username")]
        [HttpPut]
        public JsonResult EditUsername(EditUserData editUser)
        {
            try
            {
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == editUser.NewUsername);

                return Json("This username already exist");

            }
            catch
            {
                var dbdata_user = _conString.ProjectUsers.Single(data => data.Username == editUser.Username);

                if (dbdata_user.AuthorizationToken == editUser.AuthorizationToken)
                {
                    dbdata_user.Username = editUser.NewUsername;


                    var dbdata_encryption = _conString.Encryption_data.Single(data => data.Username == editUser.Username);

                    dbdata_encryption.Username = editUser.NewUsername;


                    var dbdata_store = _conString.Password_store.Where(data => data.Username == editUser.Username).ToList();

                    for (int index = 0; index < dbdata_store.Count; index++)
                        dbdata_store[index].Username = editUser.NewUsername;


                    _conString.SaveChanges();


                    return Json("Succes");
                }
                else
                    return Json("Incorrect authorization token");
            }

        }

        [Route("~/api/edit_email")]
        [HttpPut]
        public JsonResult EditEmail(EditUserData editUser)
        {
            try
            {
                var verifie_email = _conString.ProjectUsers.Single(data => data.Email == editUser.NewEmail);

                return Json("This email already exist");

            }
            catch
            {
                var user_data = _conString.ProjectUsers.Single(data => data.Username == editUser.Username);

                if (user_data.AuthorizationToken == editUser.AuthorizationToken)
                {
                    user_data.Email = editUser.NewEmail;
                    _conString.SaveChanges();

                    return Json("Succes");
                }
                else
                    return Json("Incorrect authorization token");
            }

        }

        [Route("~/api/edit_secret_question")]
        [HttpPut]
        public JsonResult EditQuestion(EditUserData editUser)
        {
            try
            {
                var user_data = _conString.ProjectUsers.Single(data => data.Username == editUser.Username);



                if (DecodeFrom64(editUser.OldAnswer) == DecodeFrom64(user_data.Secret_answer))
                {

                    if (DecodeFrom64(editUser.OldAnswer) != DecodeFrom64(editUser.NewAnswer))
                    {
                        if (user_data.AuthorizationToken == editUser.AuthorizationToken)
                        {
                            user_data.Secret_question = EncodeTo64(editUser.NewQuestion);
                            user_data.Secret_answer = editUser.NewAnswer;
                            _conString.SaveChanges();
                            return Json("Succes");
                        }
                        else
                            return Json("Incorrect Authorization token");

                    }

                    return Json("New answer match old");

                }

                return Json("Answer for actual question isn't right");


            }
            catch (Exception ex)
            {

                return Json(ex);


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

        public static string RandomString(int length)
        {
            Random random = new Random();

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }

}
