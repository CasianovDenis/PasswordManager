import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import user_icon from './user_icon.png';
import './NavMenu.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import GetCookie from '../GetCookie.js';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

      this.toggleNavbar = this.toggleNavbar.bind(this);

     
      let user_name = GetCookie("username");


      if (GetCookie("status_account") == "online") {
          
              if (user_name != "") {
                  this.state = {
                      collapsed: true,
                      status_link: "none",
                      status_dropdown: "block",
                      username: user_name
                  };
              }
      }
      else {
          this.state = {
              collapsed: true,
              status_link: "block",
              status_dropdown: "none"
          };
      }


     
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

    Exit =() => {
        var now = new Date();
        var time = now.getTime();
        time += 3600 * 1000;
        now.setTime(time);

        window.localStorage.clear();

        document.cookie = "username= ; expires =" + now.toUTCString();

        document.cookie = "status_account=; expires = " + now.toUTCString();

        window.open("http://localhost:32349/", '_self', "noopener noreferrer");
    }
  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white box-shadow mb-3" light>
          <Container>
                    <NavbarBrand tag={Link} style={{color:"white"} }to="/">PasswordManager</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
               
            <NavItem>
                <NavLink tag={Link} className="text-dark" to="/SignIn"
                    style={{ display: this.state.status_link }}>Log In</NavLink>
                 </NavItem>

                <NavItem>
                <NavLink tag={Link} className="text-dark" to="/SignUp"
                    style={{ display: this.state.status_link }}>Sign Up</NavLink>
            </NavItem>

                <NavItem style={{ display: this.state.status_dropdown }}>
                    <div class="dropdown">

                        <img src={user_icon} class="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false" />

                        <div class="dropdown-menu " aria-labelledby="dropdownMenuButton" >

                            <p class="dropdown-item" style={{ cursor: "pointer" }}>Name : {this.state.username}</p>
                            <NavLink tag={Link} class="dropdown-item" to="/Account" >Account</NavLink>
                            <NavLink tag={Link} class="dropdown-item" to="/Settings" >Settings</NavLink>
                            <NavLink tag={Link} class="dropdown-item" onClick={this.Exit} >Exit</NavLink>
                        </div>
                    </div>

                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
