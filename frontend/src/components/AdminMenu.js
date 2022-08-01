import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function AdminMenu(props) {
  return (
    <ListGroup>
      <ListGroup.Item variant="flush" className={props.link1 ? 'active' : ''}>
        <Link to="/admin/dashboard">Tableau de bord</Link>{' '}
      </ListGroup.Item>
      <ListGroup.Item variant="flush" className={props.link2 ? 'active' : ''}>
        <Link to="/admin/orders">Commandes</Link>{' '}
      </ListGroup.Item>
      <ListGroup.Item variant="flush" className={props.link3 ? 'active' : ''}>
        <Link to="/admin/products">Produits</Link>{' '}
      </ListGroup.Item>
      <ListGroup.Item variant="flush" className={props.link4 ? 'active' : ''}>
        <Link to="/admin/product/add">Ajouter un produit</Link>{' '}
      </ListGroup.Item>
      <ListGroup.Item variant="flush" className={props.link5 ? 'active' : ''}>
        <Link to="/admin/users">Utilisateurs</Link>{' '}
      </ListGroup.Item>
    </ListGroup>
  );
}
