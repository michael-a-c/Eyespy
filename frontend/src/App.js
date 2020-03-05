import React from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import logo from "./logo192.png";
import { Link, BrowserRouter, Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";

function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <meta name="theme-color" content="#343a40" />
        <title>EyeSpy</title>
      </Helmet>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Link to="/">
          <Navbar.Brand className="navbar-brand">
            <img
              src={logo}
              width="50"
              height="50"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
            <div className="navbar-text">EyeSpy</div>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">About</Nav.Link>
            <Nav.Link href="#link">Devices</Nav.Link>
          </Nav>
        </Navbar.Collapse>

      </Navbar>

      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/">
          <Welcome />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
