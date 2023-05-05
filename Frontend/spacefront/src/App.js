import { BrowserRouter as Router, NavLink,Routes,Route} from "react-router-dom";
import Cookies from 'js-cookie';
import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import PlanetCreatePage from "./pages/PlanetCreatePage"
import PlanetPage from "./pages/PlanetPage"
import ExpeditionPage from "./pages/ExpeditionPage"
import BattlePage from "./pages/Battlepage"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Messages, { AllMessages, CreateMessage, SingleMessage } from "./pages/Messages";

import './App.css';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setLoggedIn(true);
    }
  }, []);
  return (
    <>
      <Router>
      {loggedIn && (
        <Navbar bg="transparent" expand={false} className="mb-3">
          <Container fluid>
            <Navbar.Toggle className="bg-light"/>
            <Navbar.Offcanvas placement="start" className="bg-dark">
              <Offcanvas.Header closeButton className="btn btn-light offcanvas-header-start"  style={{ width: '67px' }} />
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3 textnav">
                <NavLink to={"/"} className="nav-link">
                    <span className="nav-link fs-6">Logout</span>
                  </NavLink>
                  <NavLink to={"/planet"} className="nav-link">
                    <span className="nav-link fs-6">Planet</span>
                  </NavLink>
                  <NavLink to={"/expedition"} className="nav-link">
                    <span className="nav-link fs-6">Expedition</span>
                  </NavLink>
                  <NavLink to={"/battle"} className="nav-link">
                    <span className="nav-link fs-6">Battle</span>
                  </NavLink>
                  <NavLink to={"/messages"} className="nav-link">
                    <span className="nav-link fs-6">Messages</span>
                  </NavLink>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      )}
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/createplanet" element={<PlanetCreatePage />} />
          <Route exact path="/planet" element={<PlanetPage />} />
          <Route exact path="/expedition" element={<ExpeditionPage />} />
          <Route exact path="/battle" element={<BattlePage />} />
          <Route exact path="/messages" element={<Messages />}>
            <Route index element={<AllMessages />}/>
            <Route exact path="all-messages" element={<AllMessages />}/>
            <Route exact path="create-message" element={<CreateMessage />}/>
            <Route exact path="single-message/:username" element={<SingleMessage />}/>
          </Route>
        </Routes>
      </Router>
    </>
  );
}


/*<PrivateRoute  
          exact
          path="/"
          component={}
          isAuthenticated={isAuthenticated}
        /> 
    const isAuthenticated = localStorage.getItem("token") !== null;
        */

        
export default App;