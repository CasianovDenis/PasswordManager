using Effortless.Net.Encryption;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PasswordManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordStoreController : Controller
    {
        private readonly ConString _conString;

        public PasswordStoreController(ConString conection)
        {
            _conString = conection;

        }



        [HttpGet("~/api/getdatastore/{Username}/{authorizationToken}")]
        public JsonResult GetDataStore(string Username, string authorizationToken)
        {
            try
            {
                var user_passwords = _conString.Password_store.Where(data => data.Username == Username).ToList();

                var user_data = _conString.ProjectUsers.Single(data => data.Username == Username);

                if (user_data.AuthorizationToken == authorizationToken)
                {
                    List<Password_list> password_list = new List<Password_list>();

                    foreach (var item in user_passwords)
                    {
                        password_list.Add(new Password_list(DecodeFrom64(item.Name), DecodeFrom64(item.Description), Strings.Decrypt(item.Password, item.Key, item.IV)));
                    }


                    return Json(password_list);
                }
                else
                    return Json("incorrect authorization token");
            }
            catch (Exception ex)
            {
                return Json(ex);
            }
        }


        [Route("~/api/add_data")]
        [HttpPost]
        public JsonResult InsertData(UserActionPasswordStore add_store)
        {
            try
            {
                var user_data = _conString.ProjectUsers.Single(data => data.Username == add_store.Username);

                if (user_data.AuthorizationToken == add_store.AuthorizationToken)
                {

                    if (add_store.Name != "" && add_store.Password != "")
                    {
                        Password_store newdata = new Password_store();

                        newdata.Username = add_store.Username;

                        newdata.Name = EncodeTo64(add_store.Name);

                        newdata.Description = EncodeTo64(add_store.Description);

                        byte[] key = Bytes.GenerateKey();
                        byte[] iv = Bytes.GenerateIV();
                        newdata.Password = Strings.Encrypt(add_store.Password, key, iv);
                        newdata.Key = key;
                        newdata.IV = iv;


                        _conString.Add(newdata);
                        _conString.SaveChanges();
                        return Json("Succes");
                    }
                    else
                        return Json("Name or Password field is empty");
                }
                else
                    return Json("Incorrect authorization token");
            }
            catch
            {
                return Json("User not exist");

            }

        }

        [Route("~/api/deletedatastore")]
        [HttpDelete]
        public JsonResult DeleteData(UserActionPasswordStore delete_data)
        {
            try
            {
                var user_data = _conString.ProjectUsers.Single(data => data.Username == delete_data.Username);

                if (user_data.AuthorizationToken == delete_data.AuthorizationToken)
                {
                    var user_passwords = _conString.Password_store.Where(data => data.Username == delete_data.Username).ToList();
                    foreach (var item in user_passwords)
                    {

                        if (delete_data.Name == DecodeFrom64(item.Name))
                        {
                            _conString.Remove(item);
                            _conString.SaveChanges();
                            return Json("Succes");
                        }

                    }
                    return Json("This name not exist");
                }
                return Json("Incorrect authorization token");
            }
            catch
            {
                return Json("This name not exist");
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
