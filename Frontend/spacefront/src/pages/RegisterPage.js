import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

import "../App.css";

export function RegisterPage() {

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function validateForm() {

    return username.length > 0 && email.length > 0 && password.length > 0 && password === password2;

  }

  function handleSubmit(event) {

    event.preventDefault();
    setError(null);

    fetch("https://localhost:7172/api/Auth/Register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    })
      .then(console.log(JSON.stringify({ email, password, username })))
      .then((response) => {
        if (!response.ok) {
          throw new Error("idiot");
        }
        swal("Good job!", "Successful register!", "success");
        navigate('/');
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
        swal ( "Oops" ,  "Register failed!" ,  "error" )
      });

  }

  return (

    <div className="Register Loginbox">

      <Form onSubmit={handleSubmit} className="text">
        <Form.Group size="lg" controlId="name">

          <Form.Label>Username</Form.Label>

          <Form.Control

            autoFocus

            type="username"

            value={username}

            maxLength={30}

            onChange={(e) => setUserName(e.target.value)}

          />

        </Form.Group>

        <Form.Group style={{ marginTop: "10px" }} size="lg" controlId="email">

          <Form.Label>Email</Form.Label>

          <Form.Control

            autoFocus

            type="email"

            value={email}

            maxLength={50}

            onChange={(e) => setEmail(e.target.value)}

          />

        </Form.Group>

        <Form.Group style={{ marginTop: "10px" }} size="lg" controlId="password">

          <Form.Label>Password</Form.Label>

          <Form.Control

            type="password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

          />

        </Form.Group>

        <Form.Group
          style={{ marginTop: "10px" }}
          size="lg"
          controlId="confirmPassword"
        >
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </Form.Group>


        <Button style={{ marginTop: "10px" }} block size="lg" type="submit" disabled={!validateForm()}>

          Register

        </Button>

      </Form>

    </div>

  );
}

export default RegisterPage;
