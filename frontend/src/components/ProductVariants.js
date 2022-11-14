import { faEuroSign, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';

function ProductVariants(props) {
  const [name, setName] = useState(props.variant.name);
  const [weight, setWeight] = useState(props.variant.weight);
  const [price, setPrice] = useState(props.variant.price);
  const [countInStock, setCountInStock] = useState(props.variant.countInStock);

  const change = () => {
    props.onChange({
      _id: props.variant._id,
      name,
      countInStock,
      weight,
      price,
    });
  };

  useEffect(() => {
    setName(props.variant.name);
    setCountInStock(props.variant.countInStock);
    setWeight(props.variant.weight);
    setPrice(props.variant.price);
  }, [props.variant]);

  useEffect(() => {
    change();
  }, [name, countInStock, weight, price]);

  return (
    <>
      <div className="my-3">
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="name">
              <Form.Control
                placeholder="Nom variante"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="weight">
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="poids"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                  }}
                />
                <InputGroup.Text>g</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="variantPrice">
              <InputGroup className="mb-3">
                <Form.Control
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faEuroSign} />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="countInStock">
              <Form.Control
                placeholder="Stock"
                value={countInStock}
                onChange={(e) => {
                  setCountInStock(e.target.value);
                }}
              />
            </Form.Group>
          </Col>

          <Col>
            <Button
              variant="warning"
              onClick={() => props.removeVariant(props.index)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProductVariants;
