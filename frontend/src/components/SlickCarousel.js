import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SlickCarousel(props) {
  function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
      <button className="btn-default" onClick={onClick}>
        <FontAwesomeIcon icon={faCircleChevronLeft} />
      </button>
    );
  }
  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <button className="btn-default" onClick={onClick}>
        <FontAwesomeIcon icon={faCircleChevronRight} />
      </button>
    );
  }
  const carouselSettings = {
    dots: props.dots,
    speed: props.speed,
    inifinite: props.inifinite,
    slidesToShow: props.slidesToShow,
    slidesToScroll: props.slidesToScroll,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    responsive: props.responsive,
  };

  return (
    <Slider {...carouselSettings} className={props.className || "d-flex"}>
      {props.children}
    </Slider>
  );
}
