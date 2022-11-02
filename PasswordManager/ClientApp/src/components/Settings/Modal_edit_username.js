import React, { useState, useRef } from 'react';
import style from './Settings.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import edit_icon from './edit_icon.png';

export default function Modal_edit_username() {

    const [message, setMessage] = useState('');
   

    const refnewName = useRef("");
    


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

    const editusername = () => {

        setMessage("Please wait");

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "Username": getCookie("username"),
                "NewUsername": refnewName.current.value
                
            })
        };

        //call api from backend and send json data,which create before

        fetch('http://localhost:32349/api/edit_username', requestOptions)
            .then(response => response.json())
            .then((responseData) => {

                if (responseData == "Succes") {

                    setMessage("Username change successfully");

                    document.cookie = "window=active";


                    // +1 hour when create cookie
                    var now = new Date();
                    var time = now.getTime();
                    time += 3600 * 1000;
                    now.setTime(time);

                   
                    document.cookie = "username=" + refnewName.current.value + "; expires = " + now.toUTCString();

                    document.cookie = "status_account=online; expires = " + now.toUTCString();

                    var field = document.getElementById("newusername");
                    field.value = "";
                }

                else
                    setMessage(responseData);


            });
    }





        return (

            <body>


                <img src={edit_icon} className={ style.username_edit_icon} data-toggle="modal" data-target="#edit_username" />

                <div class="modal fade" id="edit_username" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Edit username</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">

                                <p> Old username:</p>
                                <input type="text" class="form-control" style={{ width: "40%" }} value={getCookie("username")} disabled />

                                <br />
                                <p> New username:</p>
                                <input type="text" id="newusername" ref={refnewName} class="form-control" style={{ width: "40%" }} required />
    
                            </div>
                            <p>{message}</p>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={editusername}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </body>
        );


    
}




