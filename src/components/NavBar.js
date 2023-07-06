import React, { useEffect } from 'react';

import { Container, Navbarn } from 'react-bootstrap';
import logo from '../assets/img/logo.svg';
import navIcon1 from '../assets/nav-icon1.svg';
import navIcon2 from '../assets/nav-icon2.svg';
import navIcon3 from '../assets/nav-icon3.svg';
//just for the navbar icons



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
        <img src={'logo'} alt="Logo" />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" className={activeLink ==='home' ? 'active navbar-link' : 'navbar-link'} onclick={()=> onUpdateActiveLink("Home")}>Home</Nav.Link>
            <Nav.Link href="#skills"className={activeLink ==='skills' ? 'active navbar-link' : 'navbar-link'}onclick={()=> onUpdateActiveLink("Skills")}>skills</Nav.Link>
            <Nav.Link href="#projects"className={activeLink ==='projects' ? 'active navbar-link' : 'navbar-link'}onclick={()=> onUpdateActiveLink("Projects")}>projects</Nav.Link>
       </Nav>
       <span className="navbar-text">
        <div className="social-icons">
          <a href="#"><img src={navIcon1} alt="icon1" /></a> 
          <a href="#"><img src={navIcon2} alt="icon2" /></a>
          <a href="#"><img src={navIcon3} alt="icon3" /></a>
        </div>
         <button className="vvd" onClick={()=>console.log('connect')}></button><span>lets connect!</span>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
//so basically these navbars are from react-bootstrap and they are responsive and they are easy to use and they are very good for the design of the website

export default YourNavbarComponent;
