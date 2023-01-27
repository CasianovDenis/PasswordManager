import React, { useEffect,useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toaster } from 'evergreen-ui';

import Modal_password from './Modal_password';

import delete_icon from './delete_icon.png';
import key from './key.png';
import copy_icon from './copy_icon.png';
import style from './Account.module.css'

import GetCookie from '../public_files/GetCookie.js';



export default function Account() {
    
    const [dbdata, setDbData] = React.useState([]);
    const [request, setRequest] = useState(true);

    const redirect = useHistory();
   

    if (GetCookie("status_account") != "online") redirect.push('/');

   
   
        useEffect(() => {

            
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({

                    "Username": GetCookie("username"),
                    "Name": "null",
                    "Password": "null"

                })
            };

            if (request == true) {
                fetch('http://localhost:32349/api/getdatastore', requestOptions)
                    .then(response => response.json())
                    .then((responseData) => {
                        setDbData(responseData)
                        setRequest(false);
                    });

               
            }
        }, [dbdata]);
    



        const delete_password = (ev) => {

            let item = ev.target.getAttribute('title');

            if (window.confirm("You want to delete data: " + item) == true) {

                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "Username": GetCookie("username"),
                        "Name": item,
                        "Password": "null"

                    })
                };

              

                fetch('http://localhost:32349/api/deletedatastore', requestOptions)
                    .then(response => response.json())
                    .then((responseData) => {

                        if (responseData != "Succes") alert("Error : data can not deleted");

                    });
            }

        }

        const copy = (ev) => {

            let item = ev.target.getAttribute('alt');
            let password;
            for (let index = 0; index < dbdata.length; index++)
                if (dbdata[index].Name == item) password = dbdata[index].Password;


           
            navigator.clipboard.writeText(password);

           
            toaster.success('Password was copied successfully');
        }


    
    return (



        <div classname={style.account_div}>
  

            <Modal_password />

          

            <div className={style.display_div }>
                {dbdata.map(item => {

                return (
                    <div className={style.user_data}  >

                        <img src={key} style={{width:"25px",height:"25px"} }/> Your Data
                        <p >Name: {item.Name}</p>
                        <p>Password: <p  class="hide_password">********</p></p>

                        <img src={copy_icon} className={style.copy_icon} onClick={copy}
                            alt={item.Name} />

                        <p>Description: {item.Description}</p>

                       
                        <img src={delete_icon} className={style.delete_image} onClick={delete_password}
                            title={item.Name} />
                       
                    </div>
                    
                 
                        
                    );

            })}
            </div>
           
        </div>
    );
}



   
