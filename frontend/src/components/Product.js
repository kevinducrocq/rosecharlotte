import {
  faCartCircleXmark,
  faCartPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import Rating from './Rating';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert(
        "Désolé, il n'y a plus de quantité disponible pour ce produit"
      );
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card key={product.slug} className="shadow">
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          className="card-img-top img-fluid"
          alt={product.name}
        />
      </Link>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <Link to={`/product/${product.slug}`}>
            <Card.Title className="text-nowrap">{product.name}</Card.Title>
          </Link>
          <Card.Text className="text-nowrap">{product.price} &euro;</Card.Text>
        </div>
        <div>
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </div>

        <div className="mt-2 mb-3">
          {product.countInStock > 0 ? (
            <Badge bg="success">{product.countInStock} En stock</Badge>
          ) : (
            <Badge bg="danger">Epuisé</Badge>
          )}
        </div>

        {product.countInStock > 0 ? (
          <Button
            onClick={() => addToCartHandler(product)}
            className="w-100"
            bsClass="custom-btn"
          >
            <FontAwesomeIcon icon={faCartPlus} /> Ajouter au panier
          </Button>
        ) : (
          <Button variant="secondary" disabled className="w-100">
            <FontAwesomeIcon icon={faCartCircleXmark} />
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
