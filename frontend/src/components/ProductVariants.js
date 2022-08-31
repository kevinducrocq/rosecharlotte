import { faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

function ProductVariants(props) {
  const [variants, setVariants] = useState('');
  const [name, setName] = useState(props.variant.name);
  const [weight, setWeight] = useState(props.variant.weight);
  const [countInStock, setCountInStock] = useState(props.variant.countInStock);

  const change = () => {
    props.onChange({
      name,
      countInStock,
      weight,
    });
  };

  const deleteVariantHandler = async (variant, v) => {
    setVariants(variants.filter((x) => x !== variant));
    toast.success('Variante supprimée');
  };

  return (
    <div>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              placeholder="Nom de la variante"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                change();
              }}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="weight">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="poids"
                type="number"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  change();
                }}
              />
              <InputGroup.Text>grammes</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Control
              type="number"
              placeholder="Stock"
              value={countInStock}
              onChange={(e) => {
                setCountInStock(e.target.value);
                change();
              }}
            />
          </Form.Group>
        </Col>
        <Col>
          <Button variant="warning" onClick={(v) => deleteVariantHandler(v)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ProductVariants;
