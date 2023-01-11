import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { LazyLoadImage } from "react-lazy-load-image-component";

function Product(props) {
  const { product } = props;

  const renderedPrices = () => {
    const variantPrices = [];
    const variantPromoPrices = [];
    const variantSoldePrices = [];

    product.variants.filter((variant) => {
      if (variant.price > 0) {
        return variantPrices.push(variant.price);
      }
    });

    product.variants.filter((variant) => {
      if (variant.promoPrice > 0) {
        return variantPromoPrices.push(variant.promoPrice);
      }
    });

    product.variants.filter((variant) => {
      if (variant.soldePrice > 0) {
        return variantSoldePrices.push(variant.soldePrice);
      }
    });

    const variantAllPrices = variantPrices.concat(
      variantPromoPrices,
      variantSoldePrices
    );

    if (variantAllPrices.length > 0) {
      if (
        variantPromoPrices.length > 0 &&
        variantPromoPrices.length === variantPrices.length
      ) {
        const min = () => variantPromoPrices.reduce((x, y) => Math.min(x, y));
        const max = () => variantPromoPrices.reduce((x, y) => Math.max(x, y));
        return (
          <Card.Text className="card-price text-nowrap fw-bold bg3 p-2 rounded-5">
            {"de " + min() + " à " + max() + " €"}
          </Card.Text>
        );
      } else if (
        variantSoldePrices.length > 0 &&
        variantSoldePrices.length === variantPrices.length
      ) {
        const min = () => variantSoldePrices.reduce((x, y) => Math.min(x, y));
        const max = () => variantSoldePrices.reduce((x, y) => Math.max(x, y));
        return (
          <Card.Text className="card-price text-nowrap fw-bold bg3 p-2 rounded-5">
            {"de " + min() + " à " + max() + " €"}
          </Card.Text>
        );
      } else {
        const min = () => variantAllPrices.reduce((x, y) => Math.min(x, y));
        const max = () => variantAllPrices.reduce((x, y) => Math.max(x, y));
        return (
          <Card.Text className="card-price text-nowrap fw-bold bg3 p-2 rounded-5">
            {"de " + min() + " à " + max() + " €"}
          </Card.Text>
        );
      }
    } else {
      if (product.price && (!product.promoPrice || !product.soldePrice)) {
        return (
          <Card.Text className="card-price text-nowrap fw-bold bg3 p-2 rounded-5">
            {product.price} &euro;
          </Card.Text>
        );
      } else if (product.price && product.promoPrice) {
        return <div>{product.soldePrice}</div>;
      }
    }
  };

  const isPromoOrSolde = () => {
    const variantPromoOrSoldePrices = [];
    const isVariantPromoOrSolde = product.variants.filter((variant) => {
      if (variant.promoPrice || variant.soldePrice) {
        return variantPromoOrSoldePrices.push(
          variant.promoPrice || variant.soldePrice
        );
      }
    });

    if (
      product.promoPrice ||
      product.soldePrice ||
      variantPromoOrSoldePrices.length > 0
    ) {
      return true;
    }
  };

  return (
    <Link
      key={product.slug}
      className="card-link flex-fill d-flex"
      to={`/product/${product.slug}`}
    >
      <Card className="hover-shadow flex-fill">
        <LazyLoadImage
          src={product.image}
          className="card-img-top img-fluid"
          alt={product.name}
          placeholderSrc="../Spinner.svg"
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
              {isPromoOrSolde() ? (
                <Card.Title className="card-titre h6">
                  {product.name.substring(0, 30)}...
                </Card.Title>
              ) : (
                <Card.Title className="card-titre h6">
                  {product.name}
                </Card.Title>
              )}
            </div>
            <div className="card-rating d-flex justify-content-between align-items-center ">
              <Rating rating={product.rating} numReviews={product.numReviews} />
              {!product.promoPrice && !product.soldePrice && renderedPrices()}
              {product.promoPrice && (
                <Card.Text className="d-flex align-items-center">
                  <div className="text-nowrap fw-bold p-2 rounded-5 card-price">
                    <s>{product.price} &euro;</s>
                  </div>
                  <div className="text-nowrap fw-bold bg3 p-2 rounded-5 card-price">
                    {product.promoPrice} &euro;
                  </div>
                </Card.Text>
              )}
              {product.soldePrice && (
                <Card.Text className="d-flex align-items-center">
                  <div className="text-nowrap fw-bold p-2 rounded-5 card-price">
                    <s>{product.price} &euro;</s>
                  </div>
                  <div className="text-nowrap fw-bold bg3 p-2 rounded-5 card-price">
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
