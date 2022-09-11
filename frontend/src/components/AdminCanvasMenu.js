import {
  faComments,
  faBagShopping,
  faGauge,
  faPlus,
  faReel,
  faShirt,
  faUsers,
  faManhole,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, ListGroup, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function AdminCanvasMenu(props) {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div>
      <Button
        variant="outline-light"
        className="bg2 p-1 mt-1 nav-link border-0"
        onClick={handleShow}
      >
        <FontAwesomeIcon icon={faManhole} />
        &nbsp; Menu Administrateur
      </Button>

      <Offcanvas show={show} onHide={handleClose} className="bg1">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="d-flex align-items-center">
            <FontAwesomeIcon icon={faManhole} size="2x" />
            &nbsp;
            <h4>Menu Admin</h4>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
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
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}