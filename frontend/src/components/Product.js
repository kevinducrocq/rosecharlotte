import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Product(props) {
  const { product } = props;

  return (
    <Link
      key={product.slug}
      className="card-link flex-fill d-flex"
      to={`/product/${product.slug}`}
    >
      <Card className="hover-shadow flex-fill">
        <img
          src={product.image}
          className="card-img-top img-fluid"
          alt={product.name}
        />

        <div className="product-badge">
          {product.variants.reduce(
            (countInStock, variant) => countInStock + variant.countInStock,
            product.countInStock
          ) > 0 ? (
            <span className="badge-stock">En stock</span>
          ) : (
            <span className="badge-epuise">Épuisé</span>
          )}
        </div>
        <Card.Body className="d-flex flex-column">
          <div className="d-flex flex-column flex-fill justify-content-space-between">
            <div className="card-title-container flex-fill">
              <Card.Title className="card-titre h6">{product.name}</Card.Title>
            </div>
            <div className="card-rating d-flex justify-content-between align-items-center ">
              <Rating rating={product.rating} numReviews={product.numReviews} />
              {!product.promoPrice && !product.soldePrice && (
                <Card.Text className="card-price text-nowrap fw-bold bg3 p-2 rounded-5">
                  {product.price} &euro;
                </Card.Text>
              )}
              {product.promoPrice && (
                <Card.Text className="d-flex align-items-center">
                  <div className="text-nowrap fw-bold p-2 rounded-5">
                    <s>{product.price} &euro;</s>
                  </div>
                  <div className="text-nowrap fw-bold bg3 p-2 rounded-5">
                    {product.promoPrice} &euro;
                  </div>
                </Card.Text>
              )}
              {product.soldePrice && (
                <Card.Text className="d-flex align-items-center">
                  <div className="text-nowrap fw-bold p-2 rounded-5">
                    <s>{product.price} &euro;</s>
                  </div>
                  <div className="text-nowrap fw-bold bg3 p-2 rounded-5">
                    {product.soldePrice} &euro;
                  </div>
                </Card.Text>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}
export default Product;
