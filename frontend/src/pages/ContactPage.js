import React from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

export default function ContactPage() {
  return (
    <Container className="my-5">
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <h1>Contact</h1>
      <div>
        <iframe
          title="RoseCharlotte"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2534.566493349316!2d2.4454355159352223!3d50.560831287285836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47dd1b661ba15921%3A0xea27f9df1ebdcc6b!2sRose%20Charlotte%20%26%20Compagnie!5e0!3m2!1sfr!2sfr!4v1660560677058!5m2!1sfr!2sfr"
          width="100%"
          height={400}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />
      </div>
    </Container>
  );
}
