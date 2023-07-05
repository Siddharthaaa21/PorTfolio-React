import React, { useEffect } from 'react';

import { Container, Navbarn } from 'react-bootstrap';

 export const YourNavbarComponent = () => {
  const [activwLink, setActiveLink] = useState('home');
  //is for the active link in the navbar to be highlighted when clicked on it 
  const [scrolled, setScrolled] = useState(false);
  //is for the navbar to change color when scrolled down
  useEffect(() => {
    const onScroll = () => {
      //if the window is scrolled down more than 100px then the navbar will change color
    if(window.scrollY > 50){
      setScrolled(true);
    }else{
      setScrolled(false);
    }}
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };//this is for the active link in the navbar to be highlighted when clicked on it
  
    ///scollY is the number of pixels that the document is currently scrolled vertically
   
  return (
    <Navbar  expand="lg" className={scolled ? "scolled" : ""}>
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <img src={''} alt="Logo" />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" className={activeLink ==='home' ? 'active navbar-link' : 'navbar-link'} onclick={()=> onUpdateActiveLink("Home")}>Home</Nav.Link>
            <Nav.Link href="#skills"className={activeLink ==='skills' ? 'active navbar-link' : 'navbar-link'}onclick={()=> onUpdateActiveLink("Skills")}>skills</Nav.Link>
            <Nav.Link href="#projects"className={activeLink ==='projects' ? 'active navbar-link' : 'navbar-link'}onclick={()=> onUpdateActiveLink("Projects")}>projects</Nav.Link>

            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
//so basically these navbars are from react-bootstrap and they are responsive and they are easy to use and they are very good for the design of the website

export default YourNavbarComponent;
