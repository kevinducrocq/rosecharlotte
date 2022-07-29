import React from 'react';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Rating(props) {
  const { rating, numReviews, caption } = props;

  return (
    <div className="rating">
      <span>
        <FontAwesomeIcon
          icon={
            rating >= 1 ? faStar : rating >= 0.5 ? faStarHalfAlt : faStarReg
          }
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={
            rating >= 2 ? faStar : rating >= 1.5 ? faStarHalfAlt : faStarReg
          }
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={
            rating >= 3 ? faStar : rating >= 2.5 ? faStarHalfAlt : faStarReg
          }
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={
            rating >= 4 ? faStar : rating >= 3.5 ? faStarHalfAlt : faStarReg
          }
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={
            rating >= 5 ? faStar : rating >= 4.5 ? faStarHalfAlt : faStarReg
          }
        />
      </span>
      <span className="star-caption">
        {caption ? (
          <span>{caption}</span>
        ) : (
          <span>{' ' + numReviews + ' avis'}</span>
        )}
      </span>
    </div>
  );
}
export default Rating;
