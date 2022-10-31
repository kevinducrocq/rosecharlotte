import axios from 'axios';
import React, { useEffect, useReducer } from 'react';

import Carousel from 'react-bootstrap/Carousel';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        carouselHome: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function CarouselHome() {
  const [{ loading, error, carouselHome }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/settings/`, {});
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {(carouselHome && typeof carouselHome.map === 'function'
        ? carouselHome
        : []
      ).map((carousel) => {
        return (
          <Carousel key={carouselHome} fade wrap="true" className="carousel">
            <Carousel.Item className="carousel-item">
              <img
                className="d-block w-100"
                src={carousel.firstImage}
                alt={carousel.firstText}
              />
              <Carousel.Caption>
                <div className="title mb-3">
                  <h2 className="text-center">{carousel.firstText}</h2>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item className="carousel-item">
              <img
                className="d-block w-100"
                src={carousel.secondImage}
                alt={carousel.secondText}
              />
              <Carousel.Caption>
                <div className="title mb-3">
                  <h2 className="text-center">{carousel.secondText}</h2>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item className="carousel-item">
              <img
                className="d-block w-100"
                src={carousel.thirdImage}
                alt={carousel.thirdText}
              />
              <Carousel.Caption>
                <div className="title mb-3">
                  <h2 className="text-center">{carousel.thirdText}</h2>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        );
      })}
    </>
  );
}

export default CarouselHome;
