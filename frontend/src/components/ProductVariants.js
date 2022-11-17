import { faEuroSign, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';

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
        <Col>
          <Form.Group controlId="Price" className="my-2">
            <Form.Label>
              <small className="text-muted">Prix</small>
            </Form.Label>
            <InputGroup>
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
          <Form.Group className="my-2" controlId={''}>
            <Form.Label>
              <small>
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
            <InputGroup>
              <Form.Control
                value={promoPrice}
                className={promoIsVisible ? '' : 'd-none'}
                onChange={(e) => {
                  setPromoPrice(e.target.value);
                }}
                placeholder="Prix promo"
              />
              <InputGroup.Text className={promoIsVisible ? '' : 'd-none'}>
                <FontAwesomeIcon icon={faEuroSign} />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="my-2" controlId={''}>
            <Form.Label>
              <small>
                <Form.Check
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
            <InputGroup>
              <Form.Control
                value={soldePrice}
                className={soldeIsVisible ? '' : 'd-none'}
                onChange={(e) => {
                  setSoldePrice(e.target.value);
                }}
                placeholder="prix soldé"
              />
              <InputGroup.Text className={soldeIsVisible ? '' : 'd-none'}>
                <FontAwesomeIcon icon={faEuroSign} />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
      </>
    );
  };

  return (
    <>
      <Row>
        <Col>
          <Form.Group controlId="name" className="my-2">
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
        <Col>
          <Form.Group controlId="weight" className="my-2">
            <Form.Label>
              <small className="text-muted">Poids</small>
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                min="0"
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
          <Form.Group controlId="countInStock" className="my-2">
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

        <Col>
          <div className="d-flex" style={{ height: 100 }}>
            <div className="align-self-center mt-3">
              <Button
                variant="warning"
                onClick={() => props.removeVariant(props.index)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default ProductVariants;
