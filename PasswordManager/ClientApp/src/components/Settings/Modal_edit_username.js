import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import style from './Settings.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import edit_icon from './edit_icon.png';

import GetCookie from '../public_files/GetCookie.js';

export default function Modal_edit_username(props) {

    const [message, setMessage] = useState('');
   
    const redirect = useHistory();
    const refnewName = useRef("");

    const editusername = () => {
       
        setMessage("Please wait");

        if (refnewName.current.value.match(/^[A-Za-z0-9]+$/)) {

            if (refnewName.current.value.length <= 25) {

                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "Username": GetCookie("username"),
                        "NewUsername": refnewName.current.value,
                        "AuthorizationToken": GetCookie("auth_token")
                    })
                };

              

                fetch('http://localhost:32349/api/edit_username', requestOptions)
                    .then(response => response.json())
                    .then((responseData) => {

                        if (responseData == "Succes") {

                            setMessage("Username change successfully");

                            
                            var now = new Date();
                            var time = now.getTime();
                            time += 3600 * 1000;
                            now.setTime(time);


                            document.cookie = "username=" + refnewName.current.value + "; expires = " + now.toUTCString();

                            document.cookie = "status_account=online; expires = " + now.toUTCString();

                            var field = document.getElementById("newusername");
                            field.value = "";

                            refnewName.current.value = "";

                            props.func('succes');

                            redirect.go('Account');
                        }

                        else
                            setMessage(responseData);


                    });
            }
            else
                setMessage("Username is too long,maximum 25 letters");
        }
        else
            setMessage("Username can not contain symbols and space");
    }





        return (

            <>


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
                                <input type="text" class="form-control" style={{ width: "60%" }} value={GetCookie("username")} disabled />

                                <br />
                                <p> New username:</p>
                                <input type="text" id="newusername" ref={refnewName} class="form-control" style={{ width: "60%" }} required />
    
                            </div>
                            <p style={{ marginLeft: "5px" }}>{message}</p>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={editusername}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );


    
}




