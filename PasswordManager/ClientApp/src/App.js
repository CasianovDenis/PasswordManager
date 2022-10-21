import React, { useEffect } from 'react';
import { Route } from 'react-router';
import  Layout  from './components/NavMenu/Layout';
import  Home  from './components/Home/Home';
import  SignIn  from './components/SignIn/SignIn';
import  SignUp  from './components/SignUp/SignUp';
import  Account  from './components/Account/Account';

import './custom.css'

export default function App() {

    useEffect(() => {

        window.addEventListener('beforeunload', function (e) {
            
            let data = sessionStorage.getItem("window");
            if (data != "active") {
                window.localStorage.clear();
                document.cookie = "username=";
                document.cookie = "status_account=offline";}
        });

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

        let time = window.localStorage.getItem('sesion_time');
        const date = new Date().toLocaleString();

        if (time != null) {
            if (Date.parse(date) > Date.parse(time)) {

                document.cookie = "username=";
                document.cookie = "status_account=offline";
            }
        }
        
        
    })
    return (
        <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/SignIn' component={SignIn} />
            <Route path='/SignUp' component={SignUp} />
            <Route path='/Account' component={Account} />
        </Layout>
    );
}

