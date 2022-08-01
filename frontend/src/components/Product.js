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
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
        <Card.Text>{product.price} &euro;</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Epuisé
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>
            Ajouter au panier
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
