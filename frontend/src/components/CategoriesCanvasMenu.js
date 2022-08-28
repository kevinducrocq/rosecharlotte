import { faReel } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Accordion, Button, NavDropdown, Offcanvas } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function CategoriesCanvasMenu() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const renderedCategories2 = [];
  Object.keys(categories).forEach(function (category) {
    renderedCategories2.push(
      <Accordion.Item key={category} eventKey={category}>
        <Accordion.Header>{category}</Accordion.Header>
        <Accordion.Body>
          <div className="d-flex flex-column">
            <Link
              className="nav-link mb-2"
              to={`/boutique/search?category=${category}`}
            >
              Tous les produits {category}
            </Link>
            {categories[category].map((key) => {
              return (
                <Link
                  to={`/boutique/search?subCategory=${key}`}
                  className="nav-link my-2"
                >
                  {key}
                </Link>
              );
            })}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    );
  });

  const renderedCategories = [];
  Object.keys(categories).forEach(function (category) {
    renderedCategories.push(
      <NavDropdown key={category} eventKey={category} title={category}>
        <LinkContainer to={`/boutique/search?category=${category}`}>
          <NavDropdown.Item>Tous les produits {category}</NavDropdown.Item>
        </LinkContainer>

        {categories[category].map((key) => {
          return (
            <LinkContainer
              to={`/boutique/search?subCategory=${key}`}
              className="nav-link text-dark"
              key={key}
            >
              <NavDropdown.Item>{key}</NavDropdown.Item>
            </LinkContainer>
          );
        })}
      </NavDropdown>
    );
  });
  return (
    <div>
      <Button
        variant="outline-light"
        className="bg2 p-1 mt-1 nav-link border-0"
        onClick={handleShow}
      >
        <FontAwesomeIcon icon={faReel} />
        &nbsp; Catégories
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="d-flex align-items-center">
            <FontAwesomeIcon icon={faReel} size="2x" />
            &nbsp;
            <h4>Catégories</h4>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex my-3 align-items-center justify-content-between">
            <Link
              className="badge nav-link bg1 p-2"
              variant="outline-light"
              to={'/boutique/search?category=all'}
            >
              Voir tout
            </Link>
          </div>
          <Accordion>{renderedCategories2}</Accordion>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
