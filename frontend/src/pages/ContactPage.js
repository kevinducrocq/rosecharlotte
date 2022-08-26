import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { send } from 'emailjs-com';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function ContactPage() {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const sendEmail = (e) => {
    e.preventDefault();
    send(
      'service_k6w1mkp',
      'template_q4nenia',
      { senderName, senderEmail, message },
      'avpCoPewjR1-y5tpA'
    )
      .then((response) => {
        console.log('Message envoyé', response.status, response.text);
        navigate('/contact');
        toast.success('Merci pour votre message');
      })
      .catch((err) => {
        console.log('Erreur', err);
      });
  };

  return (
    <Container className="my-5">
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <h1 className="text-center">Contactez-nous</h1>

      <Row>
        <Col md={8} className="shadow bg3 p-5 offset-md-2 my-5 rounded-5">
          <Form onSubmit={sendEmail}>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Prénom et nom"
                name="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Votre email"
                name="senderEmail"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Control
                placeholder="Votre message"
                as="textarea"
                rows={6}
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Form.Group>
            <div className="mb-3">
              <Button
                type="submit"
                variant="outline-light"
                className="bg1 w-100"
              >
                Envoyer
              </Button>
            </div>
          </Form>
        </Col>
        <hr />
      </Row>
      <div>
        <iframe
          title="RoseCharlotte"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2534.566493349316!2d2.4454355159352223!3d50.560831287285836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47dd1b661ba15921%3A0xea27f9df1ebdcc6b!2sRose%20Charlotte%20%26%20Compagnie!5e0!3m2!1sfr!2sfr!4v1660560677058!5m2!1sfr!2sfr"
          width="100%"
          height={400}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Container>
  );
}
