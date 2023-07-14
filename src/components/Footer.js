import {Container,Row,Col }  from "react-bootstrap"
//importing Container from react-bootstrap library used to create  fixed width container
import {MailchimpForm} from "./MailchimpForm"
//is a component which is used to create a form for mailchimp custom , since we have created a sepreate container for mailchimp form 
import logo from "../assets/img/logo.svg"

 const Footer =()=>{

    //using export of making this user defined function make use anywhere in the project
    return(
       <footer className="footer">
        <Container>
            <Row className="align-item-centre ">
                {/* /*align-item-centre is used to align the content in the centre*/ }
                <MailchimpForm/>
                    <Col sm={6}>
                       <img src ={logo} alt="logo" className="logo"/>
                    </Col>
                    <Col sm ={6} className="text-center text sm-end ">
                        {/* sm for  is a prop used to define coloum width  and we are usinf css classes */}
                      {/* Col is basically for representing coloum in the row block */}
                      <div className="social-icon">
                        <a href=""><img src={navIcon1} /></a>
                        {/* a href is u"a"is an anchor element used to create hyper link " and href is used to spicify urls*/}

                        <a href=""><img src={navIcon2} /></a>
                        <a href=""><img src={navIcon3} /></a>
                        </div>
                        <p> CopyRight  202. Rights Reserved to Siddhartha</p>



                    
                    </Col>
               


            </Row>
        </Container>


       </footer>
          
    )
}
export default Footer;