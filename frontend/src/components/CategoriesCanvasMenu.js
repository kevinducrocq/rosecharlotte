import { faReel } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Accordion, Button, Offcanvas } from 'react-bootstrap';
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

  const renderedCategories = [];
  Object.keys(categories).map((category) => {
    return renderedCategories.push(
      <Accordion.Item key={category} eventKey={category}>
        <Accordion.Header>{category}</Accordion.Header>
        <Accordion.Body>
          <div className="d-flex flex-column">
            <Link
              onClick={handleClose}
              className="nav-link mb-2"
              to={`/boutique/search?category=${category}`}
            >
              Tous les produits {category}
            </Link>
          </div>
          {(categories[category] &&
          typeof categories[category].map === 'function'
            ? categories[category]
            : []
          ).map((subCategory) => {
            return (
              <Link
                key={subCategory}
                to={`/boutique/search?category=${category}&subCategory=${subCategory}`}
                className="nav-link my-2"
                onClick={handleClose}
              >
                {subCategory}
              </Link>
            );
          })}
        </Accordion.Body>
      </Accordion.Item>
    );
  });

  return (
    <div>
      <button className="category-button" onClick={handleShow}>
        <FontAwesomeIcon icon={faReel} size="2x" color={'#f47c7c'} />
      </button>

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
            <Button className="homepage-button" variant="outline-light">
              <Link to={'/boutique/search?category=all'}>Voir tout</Link>
            </Button>
          </div>
          <Accordion>{renderedCategories}</Accordion>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
