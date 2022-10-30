import React, { useEffect } from 'react';
import 'owl.carousel/dist/assets/owl.carousel.css';
import { Container, Image } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../components/MessageBox';

function PageNotFound() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>RoseCharlotte & Compagnie</title>
      </Helmet>
      <Container>
        <div className="mt-5 d-flex flex-column justify-content-center align-items-center">
          <Image src="./logo-lapin.png" fluid width={500} />
          <MessageBox variant="danger">
            Désolé, Cette page n'existe pas
          </MessageBox>
        </div>
      </Container>
    </>
  );
}

export default PageNotFound;
