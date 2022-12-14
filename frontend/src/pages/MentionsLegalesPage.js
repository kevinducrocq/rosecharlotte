import React from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const MentionsLegalesPage = () => {
  return (
    <Container className="my-5">
      <Breadcrumb>
        <LinkContainer to={'/'} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Mentions légales</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="my-5">Mentions légales</h1>
      <div>
        <p>
          Marie FARDEL, propriétaire de Rose Charlotte &amp; COMPAGNIE, boutique
          en ligne de vêtements et accessoires pour toute la famille.
          Micro-entreprise dont le siège social se situe 20 rue principale à
          ECQUEDECQUES, enregistré à la CMA d’Arras, TVA non applicable. SIRET :
          Code APE : 7410Z Activités spécialisées de design Hébergement du site
          Service client rosecharlotteetcompagnie@gmail.com Crédit photos :
          Marie FARDEL Rose Charlotte &amp; COMPAGNIE est une marque déposée
          auprès de l’INPI. L'intégralité du site est la propriété exclusive de
          la microentreprise Rose Charlotte &amp; COMPAGNIE. Aucune reproduction
          ou représentation ne peut avoir lieu sans le consentement écrit et
          préalable de Rose Charlotte &amp; COMPAGNIE. Malgré tous les soins
          d'usage apportés à la réalisation de ce site et à son actualisation
          régulière, des erreurs peuvent s'être glissées dans les informations
          et/ou documents présentés. Rose Charlotte &amp; Compagnie ne peut
          néanmoins garantir l'exactitude, la précision ou l'exhaustivité des
          informations mises à la disposition sur ce site et la responsabilité
          de l'éditeur ne peut être engagée en aucune circonstance en cas
          d'éventuelles erreurs. Si vous en constatez, merci de le signaler par
          courrier électronique à : rosecharlotteetcompagnie@gmail.com afin que
          nous procédions aux rectifications correspondantes. La microentreprise
          Rose Charlotte &amp; COMPAGNIE se réserve le droit de corriger, à tout
          moment et sans préavis, le contenu. Ce site a fait l'objet d'une
          déclaration auprès de la Commission Nationale de l'Informatique et des
          Libertés. Les données nominatives enregistrées sur ce site seront
          stockées et utilisées conformément à la loi du 6 janvier 1978 relative
          à l'informatique et aux libertés. Les utilisateurs de ce site
          disposent d'un droit d'accès, de rectification et de suppression des
          données les concernant, qu'ils peuvent exercer auprès de : Rose
          Charlotte &amp; COMPAGNIE 20 rue Principale 62190 ECQUEDECQUES.
        </p>
      </div>
    </Container>
  );
};

export default MentionsLegalesPage;
