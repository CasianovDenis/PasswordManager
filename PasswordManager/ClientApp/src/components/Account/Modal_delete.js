import React, { useState,useRef } from 'react';
import style from './Account.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import delete_icon from './delete_icon.png';

export default function Modal_delete() {

    const [message, setMessage] = useState('');

    const refName_record = useRef("");
    
    

    const deletepassword = () => {

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


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "Username": getCookie("username"),
                "Name": refName_record.current.value,
                "Password":"null"
                
            })
        };

        //call api from backend and send json data,which create before

        fetch('http://localhost:32349/api/deletedatastore', requestOptions)
            .then(response => response.json())
            .then((responseData) => {

                if (responseData == "Succes") {

                    setMessage("Data was deleted successfully");

                    sessionStorage.setItem("windows", "active");

                    window.open("http://localhost:32349/Account", '_self', "noopener noreferrer");
                }

                else
                    setMessage(responseData);


            });
    }





        return (

            <body>

                <button className={style.button_delete} role="button" data-toggle="modal" data-target="#delete_password" >
                    <img src={delete_icon} className={style.add_image} /> <span class="text">Delete data</span></button>

                <div class="modal fade" id="delete_password" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Delete data</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p> Name :</p>
                                <input type="text" ref={refName_record } class="form-control" style={{ width: "40%" }} required />
                                <br />
                               
                            </div>
                            <p>{message}</p>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={deletepassword}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </body>
        );


    
}




