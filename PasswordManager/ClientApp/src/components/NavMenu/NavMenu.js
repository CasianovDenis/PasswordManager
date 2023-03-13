import React, { Component , useEffect , useState , useContext } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

import { Link } from 'react-router-dom';
import { Context } from '../Context';

import user_icon from '../public_files/user_icon.png';

import './NavMenu.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import GetCookie from '../public_files/GetCookie.js';

export default function NavMenu(props) {

    const [collapsed, setCollapsed] = useState(true);
    const [change, setChange] = useState(false);

    const [auth_status, setAuthStatus] = useState(false);

    const [context, setContext] = useContext(Context);
    const userName = GetCookie("username");

    const toggleNavbar = () => setCollapsed(!collapsed);

    try {
        if (context == 'succes_entered') change == false ? setChange(true) : setChange(false);
    }
    catch(ex) {
        console.log(ex);
    }

    useEffect(() => {

        setContext(null);

        let token = GetCookie("auth_token");

        if (GetCookie("status_account") == "online" && token.length == 25 && token.match(/^[A-Za-z0-9]*$/)) {

            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };



            fetch('http://localhost:32349/api/verifie_token/' + userName +'/'+token, requestOptions)
                .then(response => response.json())
                .then((responseData) => {

                    if (responseData == 'actual token') setAuthStatus(true);

                });
        
        }
        else 
         setAuthStatus(false);
        




    },[change])




    const Exit = () => {
        var now = new Date();
        var time = now.getTime();
        time += 3600 * 1000;
        now.setTime(time);


        document.cookie = "username= ; expires =" + now.toUTCString();

        document.cookie = "status_account=; expires = " + now.toUTCString();

        document.cookie = "auth_token=; expires = " + now.toUTCString();

        setAuthStatus(false);

        

    }

    if (auth_status == true)
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} style={{ color: "white" }} to="/">PasswordManager</NavbarBrand>
                        <NavbarToggler onClick={toggleNavbar} className="mr-2" style={{ backgroundColor: "white" }} />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={collapsed} navbar>
                            <ul className="navbar-nav flex-grow">

                               

                                <NavItem >
                                    <div class="dropdown">

                                        <img src={user_icon} class="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false" style={{ cursor: "pointer" }} />

                                        <div class="dropdown-menu " id="dropdown_menu" aria-labelledby="dropdownMenuButton" >

                                            <p class="dropdown-item" style={{ cursor: "pointer" }}>Name : {userName}</p>
                                            <NavLink tag={Link} class="dropdown-item" to="/Account" >Account</NavLink>
                                            <NavLink tag={Link} class="dropdown-item" to="/Settings" >Settings</NavLink>
                                            <NavLink tag={Link} class="dropdown-item" onClick={Exit} >Exit</NavLink>
                                        </div>
                                    </div>

                                </NavItem>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );

    else
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} style={{ color: "white" }} to="/">PasswordManager</NavbarBrand>
                        <NavbarToggler onClick={toggleNavbar} className="mr-2" style={{ backgroundColor: "white" }} />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={collapsed} navbar>
                            <ul className="navbar-nav flex-grow">

                                <NavItem>
                                    <NavLink tag={Link} to="/SignIn"
                                        style={{ color: "white" }}>Log In</NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink tag={Link} to="/SignUp"
                                        style={{ color: "white" }}>Sign Up</NavLink>
                                </NavItem>


                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
}
