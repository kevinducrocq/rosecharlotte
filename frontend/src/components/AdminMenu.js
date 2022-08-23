import {
  faBagShopping,
  faComments,
  faGauge,
  faPlus,
  faShirt,
  faUsers,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function AdminMenu(props) {
  return (
    <ListGroup>
      <ListGroup.Item
        variant="flush"
        className={props.link1 ? 'activee py-3' : 'py-3'}
      >
        <Link to="/admin/dashboard">
          <FontAwesomeIcon icon={faGauge} />
          <span className="ms-2">Tableau de bord</span>
        </Link>
      </ListGroup.Item>

      <ListGroup.Item
        variant="flush"
        className={props.link2 ? 'activee py-3' : 'py-3'}
      >
        <Link to="/admin/orders">
          <FontAwesomeIcon icon={faBagShopping} />
          <span className="ms-2">Commandes</span>
        </Link>
      </ListGroup.Item>
      <ListGroup.Item
        variant="flush"
        className={props.link3 ? 'activee  py-3' : 'py-3'}
      >
        <Link to="/admin/products">
          <FontAwesomeIcon icon={faShirt} />
          <span className="ms-2">Produits</span>
        </Link>
      </ListGroup.Item>
      <ListGroup.Item
        variant="flush"
        className={props.link4 ? 'activee  py-3' : 'py-3'}
      >
        <Link to="/admin/product/add">
          <FontAwesomeIcon icon={faPlus} />
          <span className="ms-2">Ajouter un produit</span>
        </Link>
      </ListGroup.Item>
      <ListGroup.Item
        variant="flush"
        className={props.link5 ? 'activee  py-3' : 'py-3'}
      >
        <Link to="/admin/users">
          <FontAwesomeIcon icon={faUsers} />
          <span className="ms-2">Utilisateurs</span>
        </Link>
      </ListGroup.Item>
      <ListGroup.Item
        variant="flush"
        className={props.link6 ? 'activee  py-3' : 'py-3'}
      >
        <Link to="/admin/reviews">
          <FontAwesomeIcon icon={faComments} />
          <span className="ms-2">Commentaires</span>
        </Link>
      </ListGroup.Item>
    </ListGroup>
  );
}
