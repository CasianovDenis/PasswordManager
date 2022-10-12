import React, { Component } from 'react';
import  Modal_password   from './Modal_password';
import key from './key.png';

export default function Account() {
    
        function getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
   

        //create object which get data from input
    
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                "Username": getCookie("username"),
                "Name": "null",
                "Password": "null"

            })
        };

        //call api from backend and send json data,which create before

        fetch('http://localhost:32349/api/getdata', requestOptions)
            .then(response => response.json())
            .then((responseData) => {

                for (let index = 0; index < responseData.length; index++)
                {
                   

                    var image = document.createElement("img");
                    image.src = key;
                    image.style = 'width:25px; height:25px; float:left ';

                    var element = document.getElementById("new");
                    element.appendChild(image);

                    var tag_name = document.createElement("p");
                    var text_name = document.createTextNode("Name: " + responseData[index].Name);

                    var tag_password = document.createElement("p");
                    var text_password = document.createTextNode("Password: " + "*********");

                    var tag_description = document.createElement("p");
                    var text_description = document.createTextNode("Description: " + responseData[index].Description);

                    
                    //var text = document.createTextNode("Name: " + responseData[index].Name + "Password: " + 
                      //  +hide_pass + "Description: " + responseData[index].Description);

//                    tag.style = 'margin:50px';
                    // tag_password.name = responseData[index].Password;
                    //tag_password.onclick = this.myFunction;
                    //tag_password.className = display_data_user;
                    tag_name.appendChild(text_name);
                    tag_password.appendChild(text_password);
                    tag_description.appendChild(text_description);

                    element.appendChild(tag_name);
                    element.appendChild(tag_password);
                    element.appendChild(tag_description);
        }
            });

    return (

        <div >
            <Modal_password />
            <hr />

            <div id="new" >


            </div>
        </div>
    );
}


