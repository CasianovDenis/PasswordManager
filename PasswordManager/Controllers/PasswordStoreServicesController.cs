using Effortless.Net.Encryption;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordStoreServicesController : Controller
    {
        private readonly ConString _conString;

        public PasswordStoreServicesController(ConString conection)
        {
            _conString = conection;

        }


        [Route("~/api/getdatastore")]
        [HttpPost]
        public JsonResult GetAll(Password_store get_store)
        {
            var dbdata = _conString.Password_store.Where(data => data.Username == get_store.Username).ToList();
            List<Password_list> password_list = new List<Password_list>();

            foreach (var item in dbdata)
            {
                password_list.Add(new Password_list(DecodeFrom64(item.Name), DecodeFrom64(item.Description), Strings.Decrypt(DecodeFrom64(item.Password),item.Key, item.IV)));
            }
            
            
            return Json(password_list);
        }


        [Route("~/api/add_data")]
        [HttpPost]
        public JsonResult InsertData([FromBody] Password_store add_store)
        {
            try
            {
                var exist_user = _conString.ProjectUsers.Single(data => data.Username == add_store.Username);

                if (add_store.Name != null && add_store.Password != null)
                {
                    add_store.Name = EncodeTo64(add_store.Name);
                    
                    add_store.Description = EncodeTo64(add_store.Name);

                    byte[] key = Bytes.GenerateKey();
                    byte[] iv = Bytes.GenerateIV();
                    add_store.Password = EncodeTo64(Strings.Encrypt(add_store.Password, key, iv));
                    add_store.Key = key;
                    add_store.IV = iv;


                    _conString.Password_store.Add(add_store);
                    _conString.SaveChanges();
                    return Json("Succes");
                }
                else
                    return Json("Field are empty");
            }
            catch
            {
                return Json("User not exist");

            }
           
        }

        [Route("~/api/deletedatastore")]
        [HttpPost]
        public JsonResult DeleteData(Password_store get_store)
        {
            try
            {
                var dbdata = _conString.Password_store.Where(data => data.Username == get_store.Username).ToList();
                foreach (var item in dbdata)
                {

                    if (get_store.Name == DecodeFrom64(item.Name))
                    {
                        _conString.Remove(item);
                        _conString.SaveChanges();
                    }
                }
                
                return Json("Succes");
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
