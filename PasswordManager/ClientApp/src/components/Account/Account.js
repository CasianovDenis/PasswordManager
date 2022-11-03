import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Modal_password from './Modal_password';
import Modal_delete from './Modal_delete';
import key from './key.png';
import style from './Account.module.css'

export default function Account() {
    
    const [responseData, setResponseData] = React.useState([]);

    const redirect = useHistory();

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

    if (getCookie("status_account") != "online") redirect.push('/');

 
    //    //create object which get data from input
    useEffect(() => {
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

        fetch('http://localhost:32349/api/getdatastore', requestOptions)
            .then(response => response.json())
            .then((responseData) => {
                setResponseData(responseData)

            });

    }, []);
    

    

    return (

        <div >
            <Modal_password />
            <Modal_delete />
            <hr />
            {responseData.map(item => {
                return (
                    <div className={style.div_data } >
                        <img src={key} style={{width:"25px",height:"25px"} }/> Your Data
                    <p>Name: {item.Name}</p>
                        <p>Password: {item.Password}</p>
                        <p>Description: {item.Description}</p>
                        
                        </div>
                    );
            })}
           
        </div>
    );
}


