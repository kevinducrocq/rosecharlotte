import React from 'react';

import Carousel from 'react-bootstrap/Carousel';

function CarouselFade() {
  return (

    <Carousel fade wrap="true" className="carousel">
      <Carousel.Item className="carousel-item">
        <img
          className="d-block w-100"
          src="../images/car1.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <div className="title mb-3">
            <h2 className="text-center">
              Bienvenue sur Rose Charlotte & Compagnie
            </h2>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className="carousel-item">
        <img
          className="d-block w-100"
          src="../images/car2.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <div className="title mb-3">
            <h2 className="text-center">
              Bienvenue sur Rose Charlotte & Compagnie
            </h2>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className="carousel-item">
        <img
          className="d-block w-100"
          src="../images/car3.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
          <div className="title mb-3">
            <h2 className="text-center">
              Bienvenue sur Rose Charlotte & Compagnie
            </h2>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselFade;
