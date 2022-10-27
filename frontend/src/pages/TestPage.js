import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function TestPage() {
  const [street, setStreet] = useState('');
  const [postCode, setPostCode] = useState('');
  const [city, setCity] = useState('');
  const [billingStreet, setBillingStreet] = useState('');
  const [billingPostCode, setBillingPostCode] = useState('');
  const [billingCity, setBillingCity] = useState('');

  const [displayBillingAddressForm, setDisplayBillingAddressForm] =
    useState(false);
  const [displayShippingAddressForm, setDisplayShippingAddressForm] =
    useState(false);

  useEffect(() => {
    setStreet('55 Rue du Mas');
    setPostCode('07440');
    setCity('Alboussière');
  }, []);

  const renderShippingAddressForm = () => {
    return (
      <Form>
        <h1>Formulaire Shippping</h1>
        <Form.Group>
          <Form.Control
            type={'text'}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder={'street'}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type={'text'}
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            placeholder={'post code'}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type={'text'}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={'city'}
          />
        </Form.Group>
        <Button onClick={() => setDisplayShippingAddressForm(false)}>
          Valider
        </Button>
      </Form>
    );
  };

  const renderShippingAddress = () => {
    return (
      <>
        <h1>Mon adresse de livraison :</h1>
        <div>
          {street}
          <br />
          {postCode} {city}
        </div>
        <Button onClick={() => setDisplayShippingAddressForm(true)}>
          Modifier mon adresse
        </Button>
      </>
    );
  };

  const renderBillingAddressButton = () => {
    return (
      <Button onClick={() => setDisplayBillingAddressForm(true)}>
        Modifier mon adresse de facturation
      </Button>
    );
  };

  const renderBillingAddress = () => {
    if (
      (billingStreet && billingStreet !== street) ||
      (!billingPostCode && billingPostCode !== postCode) ||
      (!city && billingCity !== city)
    ) {
      return (
        <>
          <h1>Mon adresse de facturation :</h1>
          <div>
            {street}
            <br />
            {postCode} {city}
          </div>
          {renderBillingAddressButton()}
        </>
      );
    }

    return renderBillingAddressButton();
  };

  const renderBillingAddressForm = () => {
    return (
      <Form>
        <h1>Formulaire Billing</h1>
        <Form.Group>
          <Form.Control
            type={'text'}
            value={billingStreet}
            onChange={(e) => setBillingStreet(e.target.value)}
            placeholder={'street'}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type={'text'}
            value={billingPostCode}
            onChange={(e) => setBillingPostCode(e.target.value)}
            placeholder={'post code'}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type={'text'}
            value={billingCity}
            onChange={(e) => setBillingCity(e.target.value)}
            placeholder={'city'}
          />
        </Form.Group>
        <Button onClick={() => setDisplayBillingAddressForm(false)}>
          Valider
        </Button>
      </Form>
    );
  };

  return (
    <>
      <div className={'mb-5'}>
        {!displayShippingAddressForm && renderShippingAddress()}
        {displayShippingAddressForm && renderShippingAddressForm()}
      </div>

      <div>
        {!displayBillingAddressForm && renderBillingAddress()}
        {displayBillingAddressForm && renderBillingAddressForm()}
      </div>
    </>
  );
}
export default TestPage;
