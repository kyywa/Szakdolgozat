import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import Cookies from 'js-cookie';
import swal from 'sweetalert';
import { useNavigate, Link } from 'react-router-dom';

import "../App.css";

export function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('authToken');
    setLoggedIn(false);
    window.location.reload();
  }

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    axios.post("https://localhost:7172/api/Auth/Login", {
      email,
      password
    })
    .then(response => {
      const token = response.data;
      Cookies.set('authToken', token, { expires: 7 });
      axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
      setLoggedIn(true);
      navigate('/planet');
      window.location.reload();
    })
    .catch(error => {
      setError(error.message);
      swal ( "Oops" ,  "Login failed!" ,  "error" )
    })     
  }
  
  
  return (
    <div className="Login Loginbox">
      <img src="../images/logo2.png" alt="Project Galaxy Logo" title="Project Galaxy Logo"></img>
      {loggedIn ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Form onSubmit={handleSubmit} className="text">
          <Form.Group size="lg" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </Form.Group>
          <Form.Group style={{ marginTop: "10px"}} size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Group>
          <Button style={{ marginTop: "10px", marginBottom: "10px" }} block size="lg" type="submit" disabled={!validateForm()}>
            Login
          </Button>
          <div className="row">
          <Link to="/register" className="link">
            Register if you don't have an account yet
          </Link>
          </div>
        </Form>
      )}
    </div>
  );
}

export default LoginPage;
