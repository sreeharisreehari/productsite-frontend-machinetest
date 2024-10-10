import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BsMinecart } from "react-icons/bs";

function Header() {
  return (
    <div>

<Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home"><BsMinecart /> E-Bay</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            {/* <Nav.Link href="#features">Features</Nav.Link> */}
          </Nav>
        </Container>
      </Navbar>


    </div>
  )
}

export default Header