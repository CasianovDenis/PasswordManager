using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace PasswordManager.Models
{
    public class Json_update
    {
        public Json_update()
        {
            

            var appSettingsPath = Path.Combine(System.IO.Directory.GetCurrentDirectory(), "./ClientApp/src/components/SignIn/time.json");
            var json = File.ReadAllText(appSettingsPath);

            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.Converters.Add(new ExpandoObjectConverter());
            jsonSettings.Converters.Add(new StringEnumConverter());

            dynamic config = JsonConvert.DeserializeObject<ExpandoObject>(json, jsonSettings);

            DateTime hour = DateTime.Now;
            hour.AddHours(2);
            config.Time_expire = hour.ToString();

            var newJson = JsonConvert.SerializeObject(config, Formatting.Indented, jsonSettings);

            File.WriteAllText(appSettingsPath, newJson);
        }
    }
}
