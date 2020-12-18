import React from "react";
import "./register.css";
import { Form, Col, Button } from "react-bootstrap";
import  LogoRegister from "../images/logo/logo_register.jpg"

function register(){
    return(
        <div className="container" style={{width: "450px"}}>
            <img src={LogoRegister}/>
            <p>Registration From</p>
            <Form>
                <Form.Row>
                    <Form.Group as={Col} controlId="from_Firstname">
                        <Form.Label>First Name </Form.Label>
                        <Form.Control type="text" placeholder="Enter Firstname..." />
                    </Form.Group>
                    <Form.Group as={Col} controlId="form_Lastname">
                        <Form.Label>Last Name </Form.Label>
                        <Form.Control type="text" placeholder="Enter Lastname..." />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="form_Birthday">
                        <Form.Label>Birthday </Form.Label>
                        <Form.Control  type="date" placeholder="Enter Birthday..." />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Gender </Form.Label>
                        <Form.Row>
                            <Form.Check custom type="radio" id="Male" label="Male" name="gender" />
                            <Form.Check custom type="radio" id="Famale" label="Famale" name="gender" />
                        </Form.Row>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="form_Email">
                        <Form.Label>Email </Form.Label>
                        <Form.Control  type="email" placeholder="Enter Email..." />
                    </Form.Group>
                    <Form.Group as={Col} controlId="form_Phone">
                        <Form.Label>Phone Number </Form.Label>
                        <Form.Control  type="tel" placeholder="Enter Number..."/>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Supject</Form.Label>
                        <Form.Control as="select" value="Choose...">
                            <option>Choose option</option>
                            <option>...</option>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>

                <Form.Row >
                    <Form.Group as={Col}>
                        <Button as={Col} variant="primary">Submit</Button>
                    </Form.Group>
                </Form.Row>
                
                <Form.Row >
                    <Form.Group as={Col}>
                        <Form.Row as={Col} style={{ justifyContent: "space-between" ,padding: "0",margin:"0"}} >
                            <p><a style={{ color: "red" }}>*</a> im sick</p>
                            <Button style={{ height: "40px" }} variant="success">Bro</Button>
                        </Form.Row>
                    </Form.Group>
                </Form.Row>

            </Form>
        </div>
    );
};
export default register;