import {Container,Row,Col }  from "react-bootstrap"
//importing Container from react-bootstrap library used to create  fixed width container
import logo from "../assets/img/logo.svg"
import navIcon1 from "../assets/img/nav-icon1.svg"
import navIcon2 from "../assets/img/nav-icon2.svg"
import navIcon3 from "../assets/img/nav-icon3.svg"

 const Footer =()=>{

    //using export of making this user defined function make use anywhere in the project
    return(
       <footer className="footer">
        <Container>
            <Row className="align-item-centre ">
                {/* /*align-item-centre is used to align the content in the centre*/ }
                    <Col sm={6}>
                       <img src ={logo} alt="logo" className="logo"/>
                    </Col>
                    <Col sm ={6} className="text-center text sm-end ">
                        {/* sm for  is a prop used to define coloum width  and we are usinf css classes */}
                      {/* Col is basically for representing coloum in the row block */}
                      <div className="social-icon">
                        <a href="#"><img src={navIcon1} alt="icon" /></a>
                        {/* a href is u"a"is an anchor element used to create hyper link " and href is used to spicify urls*/}

                        <a href="#"><img src={navIcon2} alt="icon" /></a>
                        <a href="#"><img src={navIcon3} alt="icon" /></a>
                        </div>
                        <p> CopyRight  202. Rights Reserved to Siddhartha</p>



                    
                    </Col>
               


            </Row>
        </Container>


       </footer>
          
    )
}
export default Footer;