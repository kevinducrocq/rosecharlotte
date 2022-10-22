import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        categories: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ModalCategoryHome() {
  const [categories, setCategories] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

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
  Object.keys(categories).forEach(function (mappedCategory) {
    renderedCategories.push(
      <option
        selected={selectedCategory === mappedCategory}
        key={mappedCategory}
        value={mappedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {mappedCategory}
      </option>
    );
  });

  return (
    <>
      <div>
        <Button type="button" onClick={() => setModalShow(true)}>
          <FontAwesomeIcon icon={faPen} /> Modifier
        </Button>

        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Catégorie mise en avant sur la page d'accueil
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Séléctionner une catégorie</Form.Label>
                <Form.Select
                  aria-label="category select"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>Choisissez...</option>
                  {renderedCategories}
                </Form.Select>
              </Form.Group>
              <Button
                type="submit"
                className="bg1 w-100"
                variant="outline-light"
                onClick={setSelectedCategory}
              >
                Mettre à jour
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
