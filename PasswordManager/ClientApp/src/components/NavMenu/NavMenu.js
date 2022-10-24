import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import user_icon from './user_icon.png';
import './NavMenu.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

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

      this.toggleNavbar = this.toggleNavbar.bind(this);

      let status_account = getCookie("status_account");
      let user_name = getCookie("username");


      if (status_account == "online") {
          
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
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">PasswordManager</NavbarBrand>
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
