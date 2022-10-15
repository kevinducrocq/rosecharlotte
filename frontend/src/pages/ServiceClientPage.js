import React, { useEffect } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const ServiceClientPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Container className="my-5">
      <Breadcrumb className="d-none d-md-flex">
        <LinkContainer to={'/'} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Service client</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="my-5">Service client</h1>
      <div>
        <h3>Livraison</h3>
        <p>
          Livraison offerte à partir de 99 Euros en France métropolitaine <br />
          Livraisons via MONDIAL RELAY ou LA POSTE <br />
          Engagement : dans la mesure du possible nous expédions les commandes
          sous 48 à 72 h jours ouvrés pour les articles en stock, 14 à 21 jours
          pour les articles personnalisables Nous livrons en France, en Europe
          et dans le monde entier. <br />
          Les frais d’expédition comprennent l’emballage, la manutention et les
          frais de port. N’hésitez pas à accompagner votre commande d’un mail
          pour glisser un message dans vos commandes à offrir. Marie retrouvera
          sa belle écriture de professeur pour se faire le messager.
        </p>
      </div>
      <div>
        <h3>Retourner un produit</h3>
        <p>
          On a le droit de changer d’avis ! <br />
          Vous disposez d’un délai de quatorze jours ouvrables pour nous
          retourner à vos frais, le ou les produits commandés si ceux-ci ne vous
          conviennent pas. Ce délai démarre à compter du jour de réception de la
          commande. Conformément à la loi, les produits personnalisés (réalisés
          sur demande avec choix des tissus et/ou inscription) ne peuvent être
          retournés. <br />
          <br />
          Les frais de retour sont à la charge du client. Le client est libre de
          choisir son mode d’expédition. Les produits doivent être retournés
          neufs, complets, et dans leur emballage d’origine à l’adresse suivante
          : Rose Charlotte & COMPAGNIE 22 rue PRINCIPALE 62190 ECQUEDECQUES.
        </p>
      </div>
    </Container>
  );
};

export default ServiceClientPage;
