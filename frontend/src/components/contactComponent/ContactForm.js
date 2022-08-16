import React from 'react';
import { Button, Form } from 'react-bootstrap';

function ContactForm(props) {
  return (
    <div className="small-container">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Prénom et nom</Form.Label>
          <Form.Control />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={6} />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Envoyer</Button>
        </div>
      </Form>
    </div>
  );
}
export default ContactForm;
