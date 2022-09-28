import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

export default function FilAdd() {
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/fils/add`,
        {
          name,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success('Fil ajouté');
      navigate('/admin/fils');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  // useEffect(() => {
  //   effect;
  //   return () => {
  //     cleanup;
  //   };
  // }, [input]);

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        <Col md={8}>
          <Form.Group controlId="name">
            <Form.Control
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Button type="submit">Ajouter</Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
