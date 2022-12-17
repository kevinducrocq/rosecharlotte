import React, { useEffect } from "react";
import { Container, Image } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

function PageNotFound() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>RoseCharlotte & Compagnie - 404 </title>
      </Helmet>
      <Container>
        <div className="mt-5 d-flex flex-column justify-content-center align-items-center">
          <Image src="./logo-lapin.png" fluid width={500} />
          <div className="bg2 p-4 rounded-5 text-white fs-4">
            <span hidden>404</span>
            Désolé, Cette page n'existe pas
          </div>
        </div>
      </Container>
    </>
  );
}

export default PageNotFound;
