import { faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

function ProductVariants(props) {
  const [name, setName] = useState(props.variant.name);
  const [weight, setWeight] = useState(props.variant.weight);
  const [price, setPrice] = useState(props.variant.price);
  const [promoPrice, setPromoPrice] = useState(props.variant.promoPrice);
  const [soldePrice, setSoldePrice] = useState(props.variant.soldePrice);
  const [countInStock, setCountInStock] = useState(props.variant.countInStock);
  const [promoIsVisible, setPromoIsVisible] = useState(false);
  const [soldeIsVisible, setSoldeIsVisible] = useState(false);

  const change = () => {
    props.onChange({
      _id: props.variant._id,
      name,
      countInStock,
      weight,
      price,
      promoPrice,
      soldePrice,
    });
  };

  useEffect(() => {
    setName(props.variant.name);
    setCountInStock(props.variant.countInStock);
    setWeight(props.variant.weight);
    setPrice(props.variant.price);
    setPromoPrice(props.variant.promoPrice);
    setSoldePrice(props.variant.soldePrice);
  }, [props.variant]);

  useEffect(() => {
    change();
  }, [name, countInStock, weight, price, promoPrice, soldePrice]);

  const renderVariantPrices = () => {
    return (
      <>
        <Col md={2}>
          <Form.Group controlId="Price" className="my-1">
            <Form.Label>
              <small className="text-muted">Prix</small>
            </Form.Label>
            <Form.Control
              placeholder="€"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className="my-1" controlId={Math.random()}>
            <Form.Label className="switch-price">
              <small className="text-muted">
                <Form.Check
                  type="switch"
                  label="Promo"
                  onChange={() => {
                    setPromoIsVisible(!promoIsVisible);
                    if (promoIsVisible) {
                      setPromoPrice('');
                    } else {
                      setSoldeIsVisible(false);
                      setSoldePrice('');
                    }
                  }}
                  checked={promoIsVisible}
                />
              </small>
            </Form.Label>
            <Form.Control
              value={promoPrice}
              className={promoIsVisible ? '' : 'd-none'}
              onChange={(e) => {
                setPromoPrice(e.target.value);
              }}
              placeholder="€"
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group className="my-1" controlId={Math.random()}>
            <Form.Label className="switch-price">
              <small className="text-muted">
                <Form.Check
                  className="switch-price"
                  type="switch"
                  label="Solde"
                  onChange={() => {
                    setSoldeIsVisible(!soldeIsVisible);
                    if (soldeIsVisible) {
                      setSoldePrice('');
                    } else {
                      setPromoIsVisible(false);
                      setPromoPrice('');
                    }
                  }}
                  checked={soldeIsVisible}
                />
              </small>
            </Form.Label>
            <Form.Control
              placeholder="€"
              value={soldePrice}
              className={soldeIsVisible ? '' : 'd-none'}
              onChange={(e) => {
                setSoldePrice(e.target.value);
              }}
            />
          </Form.Group>
        </Col>
      </>
    );
  };

  return (
    <>
      <Row className="bg-light p-2 rounded-3 mb-2">
        <Col md={2}>
          <Form.Group controlId="name" className="my-1">
            <Form.Label>
              <small className="text-muted">Nom variante</small>
            </Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="weight" className="my-1">
            <Form.Label>
              <small className="text-muted">Poids</small>
            </Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
              }}
            />
          </Form.Group>
        </Col>
        <Col md={1}>
          <Form.Group controlId="countInStock" className="my-1">
            <Form.Label>
              <small className="text-muted">Stock</small>
            </Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={countInStock}
              onChange={(e) => {
                setCountInStock(e.target.value);
              }}
            />
          </Form.Group>
        </Col>

        {props.handlePrices() && renderVariantPrices()}

        <Col md={1} className="d-flex justify-content-end">
          <Button
            className="float-end"
            onClick={() => props.removeVariant(props.index)}
            variant="warning"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default ProductVariants;
