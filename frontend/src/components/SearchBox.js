import { faSearch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/boutique/search/?query=${query}` : '/boutique/search');
  };

  return (
    <Form className="d-flex w-100" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher..."
          aria-label="rechercher"
          aria-describedby="button-search"
        ></FormControl>
        <Button variant="secondary" type="submit" id="button-search">
          <FontAwesomeIcon icon={faSearch} color="#f1f1f1" />
        </Button>
      </InputGroup>
    </Form>
  );
}
