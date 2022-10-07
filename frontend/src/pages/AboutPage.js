import React from 'react';
import { Breadcrumb, Col, Container, Image, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';

export default function AboutPage() {
  return (
    <Container className="my-5">
      <Breadcrumb className="d-none d-md-flex">
        <LinkContainer to={'/'} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>À propos</Breadcrumb.Item>
      </Breadcrumb>
      <Helmet>
        <title>À propos</title>
      </Helmet>
      <h1 className="text-center">À propos de Rose Charlotte</h1>
      <div className="mt-5">
        <hr />
        <Row className="my-5">
          <div className="row align-items-center">
            <Col md={4}>
              <Image
                src="../images/about1.jpg"
                className="img-fluid rounded-4 shadow"
              />
            </Col>
            <Col md={8}>
              <h3>Histoire</h3>
              <p className="gap">
                Touche à tout, passionnée (par beaucoup trop de choses selon son
                mari !) de couture, de tissus… c’est un accident de la vie qui a
                poussé Marie, maman de trois petits cœurs, créative dans l’âme,
                à entreprendre cette belle aventure. <br />
                C’est en 2018 que « Rose Charlotte &amp; compagnie » voit le
                jour. <br />
                Le nom de la marque est né en 2012 lorsque cette future maman
                arpentait les magasins de tissus afin de préparer l’arrivée de
                ses jumelles. Comme une boutade, le nom était lancé, l’idée
                était là mais il fallait sauter le pas ! Difficile de laisser
                son cartable et ses copies, pour se lancer dans la grande
                aventure de l'entrepreneuriat ! <br />
                2018 marque l’arrivée de Léopold. Un bébé si paisible et calme
                qu’il en oublie même de respirer durant son sommeil… Encore une
                fois… une bonne étoile veille et l’histoire se finit bien, comme
                dans les contes de fées. <br /> Alors la magie se poursuit et
                c’est portée par son mari et ses enfants qu’elle franchit le cap
                et donne réellement vie à « Rose Charlotte &amp; compagnie ».
                <br />
                C’est dans cet univers fait de douceur et de poésie qu’elle
                trouve son équilibre et s’accomplit enfin. Apporter de la joie,
                des sourires, de la gaieté, offrir à chacun la possibilité de
                créer son modèle, choisir parmi sa sélection de tissus,
                personnaliser, broder… c’est ce qui la fait vibrer !
              </p>
            </Col>
          </div>
        </Row>
        <hr />

        <Row className="my-5">
          <div className="row align-items-center">
            <Col md={8}>
              <h3>Fabrication française et de qualité</h3>
              <p className="gap">
                Marie est soucieuse de vous proposer des produits de qualité et
                sélectionne avec rigueur tous les matériaux nécessaires à la
                réalisation de ses créations. <br /> Travailler le Liberty, ce
                tissu anglais si célèbre, est un véritable choix. Ce tissus de
                grande qualité, incontournable de la mode, aux motifs colorés et
                variés (il n'y a pas que des fleuris!) fait l'objet de longues
                recherches pour certains! <br />
                Marie vous propose en effet de très nombreux Liberty pour
                certains classiques et d'autres très rares. La qualité utilisée
                est la plus célèbre : le tana lawn, une batiste de coton au
                tissage très serré qui lui confère ce toucher si soyeux. <br />
                La grande qualité de ce tissu fait que les confections
                conservent tout leur éclat et leurs formes même après de
                nombreux lavages. <br /> Le Liberty et les confections en
                Liberty se transmettent entre générations… Marie choisit aussi
                de travailler du lin des Hauts de France, sa région, et des
                cotons et velours souvent labelisés Oeko-Tex voire Bio. Les
                belles matières sont toujours privilégiées. <br />
                Ses créations sont made in Hauts-de-France !
              </p>
            </Col>
            <Col md={4}>
              <Image
                src="../images/about2.jpg"
                className="img-fluid rounded-4"
              />
            </Col>
          </div>
        </Row>
        <hr />
        <Row className="my-5">
          <Col>
            <h3>Un engagement pour le développement durable</h3>
            <p className="gap">
              Marie a grandi au milieu de la nature, proche des animaux et des
              plantes qu’elle aimait faire pousser dans son petit carré de
              jardin. <br />
              Professeur en lycée agricole durant près de quinze années, elle a
              largement été sensibilisée à la question du développement durable…
              <br />
              C’est naturellement qu’elle s’engage au travers de sa marque à
              concourir au respect de l’environnement en privilégiant les
              circuits courts, l’approvisionnement de proximité et en
              travaillant toutes les chutes de tissus que son activité génère
              pour approcher le 0 déchet. <br />
              Elle a par exemple développé la broderie avec des appliqués en
              liberty pour utiliser ses plus petites chutes. Rien ne se perd,
              tout s’utilise ! Les chutes en surnombre sont triées. Une partie
              est revendue sur la boutique pour les liberty addicts et une autre
              est offerte à des associations pour les valoriser au profit de
              grandes causes.
            </p>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
