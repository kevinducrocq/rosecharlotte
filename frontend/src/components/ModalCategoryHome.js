import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Modal, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError, logOutAndRedirect } from '../utils';

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
  const [chosenCategory, setChosenCategory] = useState('');

  const { state } = useContext(Store);
  const { userInfo } = state;

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
        selected={chosenCategory === mappedCategory}
        key={mappedCategory}
        value={mappedCategory}
        onChange={(e) => setChosenCategory(e.target.value)}
      >
        {mappedCategory}
      </option>
    );
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          `/api/settings/chosen-category`,
          {
            chosenCategory,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        )
        .catch(function (error) {
          if (error.response && error.response.status === 401) {
            logOutAndRedirect();
          }
        });
      toast.success(
        `Catégorie ${chosenCategory} a été ajoutée à l'ecran d'accueil`
      );
    } catch (err) {
      toast.error(getError(err));
    }
  };

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
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Séléctionner une catégorie</Form.Label>
                <Form.Select
                  aria-label="category select"
                  onChange={(e) => setChosenCategory(e.target.value)}
                >
                  <option>Choisissez...</option>
                  {renderedCategories}
                </Form.Select>
              </Form.Group>
              <Button
                type="submit"
                className="bg1 w-100"
                variant="outline-light"
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
