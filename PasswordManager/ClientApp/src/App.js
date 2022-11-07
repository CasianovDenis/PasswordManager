import React, { useEffect } from 'react';
import { Route } from 'react-router';
import  Layout  from './components/NavMenu/Layout';
import  Home  from './components/Home/Home';
import  SignIn  from './components/SignIn/SignIn';
import  SignUp  from './components/SignUp/SignUp';
import Account from './components/Account/Account';
import Secret from './components/SecretQuestion/Secret';
import Settings from './components/Settings/Settings';

import './custom.css'

export default function App() {
     
    
    return (
        <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/SignIn' component={SignIn} />
            <Route path='/SignUp' component={SignUp} />
            <Route path='/Account' component={Account} />
            <Route path='/Secret' component={Secret} />
            <Route path='/Settings' component={Settings} />
        </Layout>
    );
}

