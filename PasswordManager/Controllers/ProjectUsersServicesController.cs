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

         /*public ProjectUsersServicesController()
        {
            

        }*/

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

        [Route("~/api/smtp")]
        [HttpPost]
        public JsonResult Smtp_password(ProjectUsers user)
        {
            try
            {
                //get email from db
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == user.Username);
                DateTime currentTime = DateTime.Now;
                DateTime timeDB = Convert.ToDateTime(dbdata.Time_ban);

                if (dbdata.Time_ban == null || currentTime > timeDB)
                {
                    if (dbdata.Password == null)
                    {
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




                        SendEmail send = new SendEmail(crypt_password, dbdata.Email);


                        //update encryption data in db
                        var dbdata_encrypt = _conString.Encryption_data.Single(data => data.Username == user.Username);
                        dbdata_encrypt.Key = key;
                        dbdata_encrypt.IV = iv;
                        _conString.SaveChanges();

                        return Json("Password is sended in the email." + '\n' +
                                            "Mail can come delay or you can find him in the spam");
                    }
                    else
                        return Json("old password");
                }
                else
                    return Json("time ban");
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
                //get key and iv for descrypt pass
                var dbdata_encryption = _conString.Encryption_data.Single(data => data.Username == user.Username);

//decrypt password from post object
          string decrypt_password_1 = Strings.Decrypt(user.Password.Trim(' '), dbdata_encryption.Key, dbdata_encryption.IV);

//decrypt password from db
        var dbdata = _conString.ProjectUsers.Single(data => data.Username == user.Username);
        string decrypt_password_2 = Strings.Decrypt(dbdata.Password.Trim(' '), dbdata_encryption.Key, dbdata_encryption.IV);

                if (decrypt_password_1==decrypt_password_2)
                {
                    dbdata.Password = "";
                   // _conString.SaveChanges();
                    dbdata_encryption.IV = null;
                    dbdata_encryption.Key = null;
                  _conString.SaveChanges();
                    return Json("Access_granted");
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


                //use one time password
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == user.Username);


                dbdata.Password = null;
                DateTime currentTime = DateTime.Now;
               
                dbdata.Time_ban= currentTime.AddMinutes(30).ToString();
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
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == user.Username);



                if (DecodeFrom64(user.Secret_answer) == DecodeFrom64(dbdata.Secret_answer))
                {

                  
                    _conString.SaveChanges();


                    return Json("Succes");
                }

                return Json("Answer isn't right");
            }
            catch
            {

                return Json("User not exist");

            }

        }


        [Route("~/api/getquestion")]
        [HttpPost]
        public JsonResult GetQuestion(ProjectUsers user)
        {
            try
            {
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == user.Username);

               

                List<TimeText_list> new_list = new List<TimeText_list>();

                new_list.Add(new TimeText_list(DecodeFrom64(dbdata.Secret_question),dbdata.Time_ban));
                return Json(new_list);
            }
            catch
            {

                return Json(null);

            }

        }

        [Route("~/api/getuserdata")]
        [HttpPost]
        public JsonResult GetData(ProjectUsers user)
        {
            try
            {
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == user.Username);

                dbdata.Secret_question = DecodeFrom64(dbdata.Secret_question);

                return Json(dbdata);
            }
            catch
            {

                return Json(null);

            }

        }

        [Route("~/api/edit_username")]
        [HttpPost]
        public JsonResult EditUsername(TempData tempdata)
        {
            try
            {
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == tempdata.NewUsername);

                return Json("This username already exist");
                
            }
            catch
            {
                var dbdata_user = _conString.ProjectUsers.Single(data => data.Username == tempdata.Username);
                dbdata_user.Username = tempdata.NewUsername;
                _conString.SaveChanges();

                var dbdata_encryption = _conString.Encryption_data.Single(data => data.Username == tempdata.Username);

                dbdata_encryption.Username = tempdata.NewUsername;
                _conString.SaveChanges();

                var dbdata_store = _conString.Password_store.Where(data => data.Username == tempdata.Username).ToList();

                for (int index=0;index<dbdata_store.Count;index++)
                 dbdata_store[index].Username = tempdata.NewUsername;
                
                
                _conString.SaveChanges();


                return Json("Succes");

            }

        }

        [Route("~/api/edit_email")]
        [HttpPost]
        public JsonResult EditEmail(TempData tempdata)
        {
            try
            {
                var dbdata = _conString.ProjectUsers.Single(data => data.Email == tempdata.NewEmail);

                return Json("This email already exist");

            }
            catch
            {
                var dbdata_user = _conString.ProjectUsers.Single(data => data.Username == tempdata.Username);
                dbdata_user.Email = tempdata.NewEmail;
                _conString.SaveChanges();

                return Json("Succes");

            }

        }

        [Route("~/api/edit_secret_question")]
        [HttpPost]
        public JsonResult EditQuestion(TempData tempdata)
        {
            try
            {
                var dbdata = _conString.ProjectUsers.Single(data => data.Username == tempdata.Username);

                if (DecodeFrom64(tempdata.OldAnswer) == DecodeFrom64(dbdata.Secret_answer))
                {
                    dbdata.Secret_question = EncodeTo64(tempdata.NewQuestion);
                    dbdata.Secret_answer = EncodeTo64(tempdata.NewAnswer);
                    _conString.SaveChanges();
                    return Json("Succes"); 
                }
                return Json("Answer for actual question isn't right");
            }
            catch
            {
               

                return Json("User not found");

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
