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


        [Route("~/api/getdata")]
        [HttpPost]
        public JsonResult GetAll(Password_store get_store)
        {
            var dbdata = _conString.Password_store.Where(data => data.Username == get_store.Username).ToList();

            for(int index=0;index>dbdata.Count;index++)
            {
                dbdata[index].Name = DecodeFrom64(dbdata[index].Name);
                dbdata[index].Description = DecodeFrom64(dbdata[index].Description);
                dbdata[index].Password = Strings.Decrypt(dbdata[index].Password, dbdata[index].Key, dbdata[index].IV);
            }
            return Json(dbdata);
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
