import{Container,Row,Col} from 'react-bootstrap';
import { MailchipForm} from "MailchipForm.";
import logo form "../assets/img/logo.svg"
 
export const Footer=()=>{
    return(
        <footer className="footer">
            <Container>
                <Row className= "align-item-center">
                <MailchimpForm/>
                <Col sm={6}>// for small screen 6 column
                <img src={logo} alt="Logo"/>
                </Col>
                <Col sm={6} className="text-centre text-sm-end">
                <div className="socail-icon">
                <a href=""><img</a>
                </div>
                //again because of small screen 6 column 

                </Col>

                </Row>
                </Container>
         
           