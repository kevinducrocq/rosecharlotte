import { faCartPlus, faFaceAngry } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
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
            <Card.Title>{product.name}</Card.Title>
          </Link>
          <Card.Text>{product.price} &euro;</Card.Text>
        </div>
        <div className="mb-3">
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </div>
        {product.countInStock === 0 ? (
          <Button variant="secondary" disabled>
            Epuisé
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(product)}
            className="w-100"
            variant="primary"
          >
            <FontAwesomeIcon icon={faCartPlus} /> Ajouter au panier
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
