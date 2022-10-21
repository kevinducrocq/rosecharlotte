import React, { useEffect } from 'react';
import { Breadcrumb, Container, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';

export default function CgvPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Container className="my-5">
      <Breadcrumb className="d-none d-md-flex">
        <LinkContainer to={'/'} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Conditions générales de vente</Breadcrumb.Item>
      </Breadcrumb>
      <Helmet>
        <title>Conditions générales de vente</title>
      </Helmet>
      <h1 className="my-5">Conditions générales de vente</h1>
      <div>
        <p>
          Le site https://rosecharlotte.fr (ci-après dénommé le « Site ») est
          édité par la SARL Rose Charlotte &amp; COMPAGNIE (ci-après dénommée
          Rose Charlotte &amp; COMPAGNIE), représentée par Mme Marie FARDEL. Le
          site internet https://rosecharlotte.fr est hébergé par Ni-Host. Le
          client internaute est dénommé le Client. L’accès et l’utilisation du
          Site sont réservés à des personnes physiques, majeures à l’exclusion
          de toute vente à des professionnels ou aux fins de revente à des
          tiers. Dans tous les cas, l’accès ou l’utilisation du Site, par un
          Client, sont soumis au respect des Conditions générales d’Utilisation
          ainsi que des présentes Conditions générales de Vente du site internet
          Rose Charlotte &amp; COMPAGNIE (ci-après les « Conditions générales de
          Vente »). Le Site propose à la vente des vêtements et accessoires pour
          la famille personnalisables pour certains (ci-après les « Produits »)
          fabriqués en France ou personnalisés en France. Les présentes
          Conditions générales de Vente peuvent être modifiées à tout moment,
          étant entendu que chaque Commande sur le Site est régie par les
          Conditions générales de Vente et les Conditions générales
          d’Utilisation en vigueur à la date de passation de la Commande. La
          vente des Produits sur le Site est soumise aux présentes Conditions
          générales de Vente et d’Utilisation, à l’exclusion de tout autre
          document. Toute Commande vaut acceptation des présentes Conditions
          générales de Vente, du prix et de la description des Produits objets
          de la Commande.
        </p>
      </div>

      <div>
        <h3>1. Acceptation des présentes Conditions générales de Vente</h3>
        <p>
          En se connectant sur le Site, le Client qui souhaite passer commande
          d'un Produit reconnaît avoir pris connaissance des présentes
          Conditions générales de Vente et accepte d'y être lié sans réserves
          (en cochant la case : « J’accepte les Conditions générales de Vente et
          je reconnais que la validation de cette Commande m’engage à en payer
          le prix ») pour les achats de Produits qu'il effectuera dans ce cadre
          par quelque moyen que ce soit. Les Produits proposés sur le Site sont
          décrits dans des fiches Produits comprenant pour certaines une photo
          et indiquant leur dénomination et caractéristiques. Le Client
          reconnaît et accepte que les photographies puissent présenter des
          variations avec le Produit qui lui sera livré. En effet, les Produits
          étant réalisés en fonction des choix de tissus, de couleurs et de
          marquage du Client, les photographies et images illustrant le Site ne
          revêtent qu’un caractère indicatif et ne sont pas contractuelles.
        </p>
      </div>

      <div>
        <h3> 2. Accès au site</h3>
        <p>
          Rose Charlotte &amp; COMPAGNIE s’efforce de proposer un accès
          permanent au Site, soit 24 heures sur 24, 7 jours sur 7. Toutefois,
          l'accès au Site peut être suspendu, à tout moment et sans préavis,
          notamment du fait de pannes, de défaillances ou de paralysie du
          réseau, du système et/ou des moyens de communication, ainsi que du
          fait des interventions de maintenance et de corrections rendues
          nécessaires par la mise à jour et le bon fonctionnement du Site. Rose
          Charlotte &amp; COMPAGNIE se réserve en outre le droit d’effectuer, à
          tout moment, toutes modifications, suppressions et/ou ajouts sur le
          contenu de ce Site, sans préavis et de façon discrétionnaire. Le
          Client s'engage à ne pas entraver l’accès au Site et/ou le bon
          fonctionnement du Site de quelque manière que ce soit, susceptible
          d'endommager, d'intercepter, d'interférer tout ou partie du Site. Il
          est rappelé que le fait d’accéder ou de se maintenir frauduleusement
          dans un système informatique, d’entraver ou de fausser le
          fonctionnement d’un tel système, d’introduire ou de modifier
          frauduleusement des données dans un système informatique constitue des
          délits passibles de sanctions pénales. Rose Charlotte &amp; COMPAGNIE
          ne peut être tenue responsable de tout dommage direct ou indirect dû à
          une interruption, à un dysfonctionnement quel qu'il soit, à une
          suspension ou à l’arrêt du Site et/ou des services, et ce pour quelque
          raison que ce soit ou encore de tout dommage direct ou indirect qui
          résulterait d'une quelconque façon de l’accès au Site et/ou aux
          services. Le Client de ce Site reconnaît disposer de la compétence et
          des moyens nécessaires pour accéder et utiliser ce Site. Les
          protocoles de communication utilisés sont ceux en usage sur Internet.
          Rose Charlotte &amp; COMPAGNIE ne saurait être tenue responsable des
          éléments en dehors de son contrôle et des dommages qui pourraient
          éventuellement être subis par l’environnement technique du Client et
          notamment, ses ordinateurs, logiciels, équipements réseaux et tout
          autre matériel utilisé pour accéder ou utiliser le Site. L’accès au
          Site est gratuit. Les frais d’accès et d’utilisation du réseau de
          télécommunication sont à la charge du Client, selon les modalités
          fixées par ses fournisseurs d’accès et opérateurs de
          télécommunication.
        </p>
      </div>
      <div>
        <h3>
          3. Données personnelles - protection des mineurs - liens hypertextes
        </h3>
        <div>
          <h4> 3.1. Traitement des données personnelles</h4>
          <p>
            Pour pouvoir traiter et acheminer les commandes de Produits
            (fabrication, livraison, facturation, etc.), le Client doit
            s’inscrire sur le Site et doit fournir des informations sincères et
            véritables et autorise le Site à collecter, traiter et utiliser les
            données à caractère personnel ainsi communiquées. Rose Charlotte
            &amp; COMPAGNIE, en tant que Responsable de traitement, s’engage à
            respecter les dispositions du règlement (UE) n°2016/679 du 27 avril
            2016 relatif à la protection des données à caractère personnel
            (RGPD) et de la loi n°78-17 du 6 janvier 1978 modifiée.
          </p>
        </div>
        <div>
          <h4>3.4. Liens hypertextes</h4>
          <p>
            Le Site contient des liens hypertextes permettant l’accès à des
            sites qui ne sont pas édités par Rose Charlotte &amp; COMPAGNIE. En
            conséquence, cette dernière ne saurait être tenue pour responsable
            du contenu des sites auxquels l’Utilisateur aurait ainsi accès.{' '}
          </p>
        </div>
      </div>
      <div>
        <h3>4. Enregistrement et validation de commande</h3>
        <p>
          Une fois le panier validé, l’acheteur devra indiquer ses coordonnées
          et l’adresse de livraison souhaitée. À partir du moment où le client a
          enregistré sa commande en cliquant sur l’icône "je valide ma
          commande", il est considéré comme ayant accepté en connaissance de
          cause et sans restriction ni réserve les présentes conditions
          générales de vente, cette étape formalisant le contrat de vente entre
          Rose Charlotte &amp; COMPAGNIE et le consommateur. Toute commande vaut
          acceptation des prix et descriptions des produits disponibles à la
          vente. Rose Charlotte &amp; COMPAGNIE se réserve le droit de clore ou
          suspendre le compte d’un Client, de suspendre et/ou de refuser toute
          commande d'un Client pour tout motif légitime (notamment informations
          fausses ou erronées, commande frauduleuse, incident de paiement, usage
          sans autorisation de moyens de paiement d’un tiers, etc.). Rose
          Charlotte &amp; COMPAGNIE se réserve également le droit de suspendre
          et/ou de refuser toute Commande d'un Client avec lequel il existerait
          un litige relatif au paiement d'une Commande antérieure, et ce quel
          que soit le mode de Commande et/ou de paiement.
        </p>
      </div>

      <div>
        <h3>6. Confirmation de commande</h3>
        <p>
          Rose Charlotte &amp; COMPAGNIE accusera réception de la commande dès
          sa validation par l'envoi d'un courrier électronique. En cas
          d'indisponibilité d'un Produit commandé l’acheteur en sera informé par
          courrier électronique. L'annulation de la commande de ce Produit et
          son éventuel remboursement seront alors effectués, le reste de la
          commande demeurant ferme et définitif. Toute commande payée par chèque
          ne sera traitée qu’à réception du moyen de paiement. Les délais de
          disponibilité comme d’expédition sont à recalculer à partir de la date
          de réception du moyen de paiement. Rose Charlotte &amp; compagnie
          recommande au client de conserver une trace papier ou sur support
          informatique fiable, les données relatives à sa commande. L’acheteur
          se doit de vérifier l’exhaustivité et la conformité des renseignements
          qu’il fournit à Rose Charlotte &amp; COMPAGNIE. Cette dernière ne
          saurait être tenu responsable d’éventuelles erreurs de saisie (adresse
          erronée…) et des conséquences en termes de retard ou d’erreur de
          livraison. Dans ce contexte, tous les frais engagés pour la
          réexpédition seront à la charge du client.
        </p>
      </div>

      <div>
        <h3>7. Preuve de la transaction</h3>
        <p>
          Les registres informatisés, conservés dans les systèmes informatiques
          de Rose Charlotte &amp; COMPAGNIE et de ses partenaires dans des
          conditions raisonnables de sécurité, seront considérés comme les
          preuves des communications, des commandes et des paiements intervenus
          entre les parties. L’archivage des bons de commande et des factures
          est effectué sur un support fiable et durable pouvant être produit à
          titre de preuve.
        </p>
      </div>

      <div>
        <h3>8. Informations sur les produits</h3>
        <p>
          Rose Charlotte &amp; COMPAGNIE présente sur son site web des produits
          valables uniquement dans la limite des stocks disponibles. La commande
          d’un produit qui ne serait pas en stock est parfois impossible. Si ce
          cas venait à se produire, Rose Charlotte &amp; COMPAGNIE en
          informerait dans les plus brefs délais le client par courrier
          électronique ou téléphone et lui donnerait la possibilité de choisir
          un autre produit ou d’annuler son achat. Les Produits sont décrits et
          présentés avec la plus grande exactitude possible. Toutefois si des
          erreurs ou omissions ont pu se produire quant à cette présentation, la
          responsabilité de Rose Charlotte &amp; COMPAGNIE ne pourrait être
          engagée. Compte tenu de la définition des écrans informatiques, les
          couleurs reproduites sur le site peuvent différer des couleurs réelles
          des tissus. Rose Charlotte &amp; COMPAGNIE garantit l’acheteur, au
          titre des vices cachés pouvant affecter les produits livrés, dans le
          cadre d’un remplacement des produits défectueux, ou des pièces les
          rendant impropres à leur usage, ou leur remboursement sans pouvoir
          être considéré par l’Acheteur comme responsable des éventuelles
          conséquences dommageables que ces vices cachés auraient pu entraîner.
        </p>
      </div>

      <div>
        <h3>9. Prix</h3>
        <p>
          Les prix des Produits sont indiqués en Euros TTC. Les prix des
          Produits s'entendent hors frais de livraison (port, emballage et
          confection du colis selon montants en vigueur). Le montant des frais
          de livraison sera précisé dans le panier du Client, avant validation
          définitive de la commande. L’intégralité du paiement doit être réalisé
          lors de la commande. À aucun moment, les sommes versées ne pourront
          être considérées comme des arrhes ou des acomptes. Pour une livraison
          hors de l’Union Européenne, le client devra acquitter les droits de
          douane, TVA ou autres taxes dues à l’occasion de l’importation des
          produits dans le pays du lieu de livraison. Les formalités qui s’y
          rapportent sont également à la charge exclusive du client, sauf
          indication contraire. L’acheteur est seul responsable de la
          vérification des possibilités d’importation des produits commandés au
          regard du droit du territoire du pays de livraison. Toutefois un prix
          ne pourra pas être modifié une fois la commande de l'Utilisateur
          validée.
        </p>
      </div>

      <div>
        <h3>10. Frais d’envoi</h3>
        <p>
          Pour une livraison hors de l'Union Européenne y compris pour la Suisse
          et la Grande Bretagne, des frais de douane supplémentaires peuvent
          être appliqués et sont à la charge du client.
        </p>
        <Table responsive>
          <thead>
            <tr>
              <th colSpan={2}>LIVRAISON</th>
              <th>FRAIS DE LIVRAISON</th>
              <th>DELAI HABITUEL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>POINT RELAIS</td>
              <td>FRANCE METROPOLITAINE</td>
              <td>5.5 &euro;</td>
              <td>5 – 7 jours</td>
            </tr>
            <tr>
              <td>
                LIVRAISON FRANCE METROPOLITAINE <br />
                <small>Livraison offerte à partir de 99 Euros</small>
              </td>
              <td>DOMICILE</td>
              <td>
                Jusque 100 gr 4.4 &euro; <br /> Jusque 250 gr 5.4 &euro; <br />{' '}
                Au-delà de 250 gr 6.9 &euro;;
              </td>
              <td>4 – 6 jours</td>
            </tr>
            <tr>
              <td>
                LIVRAISON EUROPE <br />
                <small>Livraison offerte à partir de 189 Euros</small>
              </td>
              <td>
                POINT RELAIS UNIQUEMENT POUR <br />
                <small>Espagne, Belgique, Luxembourg, Pays-Bas</small>
              </td>
              <td>5,5 Euros</td>
              <td>8 – 10 jours</td>
            </tr>
          </tbody>
        </Table>
        <p>
          Les frais d’envois sont offerts pour toute commande égale ou
          supérieure à 99 euros livrée en France métropolitaine. Par ailleurs,
          il est possible de venir retirer gratuitement votre commande dans
          notre atelier au 20 rue Principale à Ecquedecques sur rendez-vous.
        </p>
      </div>

      <div>
        <h3>11. Mode de paiement</h3>
        <p>
          Dès que le client valide son paiement, la commande est enregistrée et
          devient irrévocable. L'utilisateur devient acheteur. Le montant dû par
          l'acheteur est le montant indiqué sur la confirmation de commande
          transmise par Rose Charlotte &amp; COMPAGNIE. L'acheteur aura le choix
          lors de la validation de sa commande entre différents modes de
          paiement. À ce titre, le paiement pourra, sauf indisponibilité du
          serveur, s'effectuer : • immédiatement sur Internet : par Carte
          Bancaire (Bleue, Visa, Eurocard/Mastercard, American Express et la
          Carte Française). Il est précisé que seules les Cartes Bancaires
          délivrées par un établissement financier français seront admises. Un
          délai de 3/4 jours peut être observé avant le crédit du compte
          bancaire par rapport à la date de virement effectué par le client. La
          date de réception du virement donne lieu au traitement de la commande
          et de son expédition. <br />
          <br />
          En outre, l'Acheteur pourra également valider sa commande : • par
          Paypal, ainsi que par courrier avec chèque : en imprimant son bon de
          commande sur papier et en le transmettant par courrier postal à Rose
          Charlotte &amp; COMPAGNIE 20 rue principale 62190 ECQUEDECQUES,
          accompagné du règlement par chèque libellé à l'ordre de "Rose
          Charlotte &amp; COMPAGNIE". Toute commande payée par chèque ne sera
          traitée qu’à réception du moyen de paiement. Les délais de
          disponibilité comme d’expédition sont à recalculer à partir de la date
          de réception du moyen de paiement avec un délai de 10 jours destiné à
          garantir le bon encaissement du chèque. Les chèques sont encaissés dès
          validation de la commande. En cas d’impayé, le client sera redevable
          de frais de gestion et de frais bancaires pour un montant de 20 euros.{' '}
          <br />
          <br />
          En cas de virement étranger, le virement doit être stipulé « frais à
          la charge du donneur d¹ordre », le montant net encaissé par Rose
          Charlotte &amp; COMPAGNIE devant être égal au montant total des
          achats. La responsabilité de Rose Charlotte &amp; COMPAGNIE ne pourra
          alors en aucun cas être engagée.
        </p>
      </div>

      <div>
        <h3>12. Droit de rétractation</h3>
        <p>
          Tous les Produits peuvent faire l'objet d'un remboursement excepté
          ceux exclus par la loi et portant une mention dans ce sens, par
          exemple les produits ayant fait l'objet d'une personnalisation (
          exemple : broderie prénom) ou ceux ne pouvant pas être repris pour des
          raisons sanitaires (masques barrières en tissu). Si le produit ne
          convient pas au client, celui-ci devra tout d'abord nous contacter par
          mail (rosecharlotteetcompagnie@gmail.com) avant de nous le retourner
          en vue d'un remboursement avant de repasser si besoin une nouvelle
          commande sur la référence de son choix. Nous ne faisons pas d'échange.{' '}
          <br />
          <br />
          L'acheteur dispose d'un délai de quatorze (14) jours ouvrables pour
          retourner, à ses frais, le(s) produit(s) qu'il a commandé(s) si
          celui(ceux)-ci ne lui donne(nt) pas satisfaction. Ce délai court à
          compter du jour de réception de la commande. <br />
          <br />
          Les frais de retour sont à la charge du client qui est libre de
          choisir son mode d'expédition. <br /> <br />
          Rose Charlotte et COMPAGNIE recommande au client d’effectuer le retour
          de ses produits en colissimo suivi, muni d’une recommandation ou d’une
          assurance complémentaire lui garantissant, le cas échéant,
          l’indemnisation des produits à hauteur de leur valeur marchande réelle
          en cas de spoliation ou de perte de cette marchandise. <br /> <br />
          Les Produits doivent être retournés neufs, intacts et dans leur
          emballage d'origine à l’adresse suivante : Rose Charlotte et COMPAGNIE
          20 rue Principale 62190 ECQUEDECQUES ; <br /> <br />
          Ce droit de rétractation s'exerce sans pénalité, à l'exception des
          frais de transport qui restent à la charge du client si celui-ci fait
          un retour partiel de sa commande. Dans l'hypothèse de l'exercice du
          droit de rétractation, le client peut demander le remboursement des
          sommes versées. Le remboursement n'inclut pas les frais de retour. De
          même, Rose Charlotte et COMPAGNIE ne sera pas tenue de rembourser des
          frais supplémentaires si vous choisissiez un mode de livraison plus
          coûteux que le mode de livraison standard proposé. <br /> <br />
          Si les conditions susmentionnées sont remplies, Rose Charlotte et
          COMPAGNIE vous remboursera les sommes dûes en utilisant le même moyen
          de paiement que celui utilisé par vos soins pour la transaction
          initiale, sauf accord exprès de votre part, et dans la mesure ou cela
          n'occasionne pas des frais pour l'une ou l'autre des parties. Ce
          remboursement interviendra dans les meilleurs délais, et au plus tard
          dans un délai de quatorze (14) jours à compter de la date de réception
          du produit retourné à Rose Charlotte et COMPAGNIE.
        </p>
      </div>

      <div>
        <h3>13. Livraison</h3>
        <p>
          Rose Charlotte et COMPAGNIE s’engage à expédier la commande dans un
          délai maximum de dix (10) jours ouvrables à compter du jour suivant
          celui de la validation par l'acheteur de sa commande pour les articles
          en stock et de 21 jours pour les articles personnalisables. Ces délais
          ne sont pas valables durant les périodes de fermeture pour conges de
          l’atelier (fermetures indiquées sur le site internet). <br /> <br />
          Rose Charlotte et COMPAGNIE rappelle qu'il est de la responsabilité du
          Client de fournir une adresse d'expédition précise et valide. Dans le
          cas de l'indication d'une adresse non conforme fournie par le client
          et ne permettant pas aux services de livraison de délivrer le colis,
          le client ne pourra exiger un renvoi de sa commande. Il devra repasser
          une nouvelle commande sur le site, et sera remboursé du montant des
          produits (hors frais d'envoi) si le colis venait à postériori à être
          retourné par les services de la Poste à l'expéditeur. <br /> <br />
          Il est également de la responsabilité du client d'inspecter son colis
          à réception en présence du livreur et de notifier immédiatement au
          transporteur et au service client toute anomalie constatée (choc,
          colis endommagé,... ). Dans le cas où de telles mentions n'auraient
          pas été portées sur le bordereau de livraison présenté au Client par
          le transporteur ou le point relais, aucune réclamation afférente à
          l'état du ou des colis ne pourrait être acceptée a posteriori par Rose
          Charlotte et COMPAGNIE. <br /> <br />
          En tout état de cause, les produits seront acheminés par les services
          postaux habituels ou MONDIAL RELAY. Rose Charlotte et COMPAGNIE
          décline donc toute responsabilité en cas de délai de livraison trop
          important du fait des services postaux. Les risques du transport sont
          supportés par l'acheteur, qui devra formuler une protestation motivée
          auprès des services postaux, dans un délai de trois jours ouvrés à
          compter de la livraison. Par ailleurs, il est précisé que la propriété
          des produits commandés ne sera transférée à l'acheteur qu'au paiement
          total du prix facturé, et ce inclus les frais de livraison. <br />{' '}
          <br />
          Malgré tout le soin apporté par Rose Charlotte et COMPAGNIE dans la
          préparation des colis, il se peut qu'un produit soit endommagé ou
          qu’une erreur se soit glissée. C'est pourquoi, à la réception de sa
          commande, l'acheteur veillera à vérifier la conformité des produits
          reçus. Toute anomalie concernant la livraison (produit manquant ou
          cassé, colis endommagé, erreur de commande) devra être notifiée dans
          un délai de quatre jours maximum suivant la réception du colis, au
          service clients de Rose Charlotte &amp; COMPAGNIE 20 Rue Principale
          62190 ECQUEDECQUES, ou par e-mail adressé à
          rosecharlotteetcompagnie@gmail.com. <br /> <br />
          Toute réclamation formulée après ce délai sera rejetée et Rose
          Charlotte &amp; COMPAGNIE sera dégagé de toute responsabilité. Rose
          Charlotte &amp; COMPAGNIE se réserve la possibilité de demander à
          l'acheteur de lui retourner le produit défectueux. <br /> <br />
          Si les conditions susmentionnées sont remplies, Rose Charlotte &amp;
          COMPAGNIE procédera alors soit à l'échange ou au remboursement du
          (des) produit(s) défectueux, soit à la ré-expédition du produit
          manquant (sous réserve du bien-fondé de la demande de l'acheteur).{' '}
          <br /> <br />
          En cas d'erreur dans la préparation de commande, le client retournera
          le produit dans son emballage postal d'origine (enveloppe bulle ou
          carton) et Rose Charlotte &amp; COMPAGNIE remboursera le client des
          frais postaux engagés en envoi simple (pas de boite postale pré-payée
          colissimo). <br /> <br />
        </p>
      </div>

      <div>
        <h3>14. Informatique et liberté</h3>
        <p>
          Toutes les informations nominatives demandées dans le formulaire de
          commande sont obligatoires, le défaut de renseignement impliquant le
          rejet automatique de la commande. La collecte de ces informations n’a
          pour but que le bon traitement de la commande, sa livraison,
          l’établissement de la facture et le suivi de la relation commerciale
          avec le client. <br /> <br />
          La collecte de ces données a fait l'objet d'une déclaration auprès de
          la Commission National de l'informatique et des libertés (CNIL) sous
          le numéro ………………………………………. Les informations sont strictement
          confidentielles et sont mentionnées par un astérisque (*) lorsqu'elles
          sont nécessaires Rose Charlotte &amp; COMPAGNIE, et/ou ses
          prestataires dans le cadre de la gestion de la commande du client.{' '}
          <br /> <br />
          Rose Charlotte &amp; COMPAGNIE s'engage à prendre toutes les
          précautions utiles pour assurer la sécurité de ses fichiers et la
          protection de son système informatique, et empêcher notamment que les
          informations personnelles du Client soient déformées, endommagées, ou
          que des tiers non autorisés y aient accès. Les informations bancaires
          communiquées par le client lors de la finalisation de sa commande ne
          sont en aucun cas collectées par le site Rose Charlotte &amp;
          COMPAGNIE. Seule la banque Crédit Agricole auprès de laquelle sont
          réalisés les paiements en ligne en possède une trace cryptée. Rose
          Charlotte &amp; COMPAGNIE s’engage à ne pas communiquer ces
          informations nominatives à d’éventuels partenaires commerciaux. Seule
          la société Rose Charlotte &amp; COMPAGNIE sera susceptible de vous
          adresser des offres par email ou courrier pour vous informer de
          l'existence de nos produits et services. <br /> <br />
          En qualité de client(e), vous souhaitez recevoir nos e-mailings et
          offres promotionnelles. Si vous ne le souhaitez plus, vous pouvez
          écrire aux coordonnées ci-dessous afin que nous vous désabonnions de
          nos newsletters. Vous disposez d'un droit d'accès, de modification, de
          rectification et de suppression des données qui vous concernent (art.
          34 de la loi "Informatique et Libertés" n° 78-17 du 6 janvier 1978 ).
          Pour l'exercer, écrivez à : Rose Charlotte &amp; COMPAGNIE 20 rue
          Principale 62190 ECQUEDECQUES. <br /> <br />
        </p>
      </div>

      <div>
        <h3>15. Responsabilité</h3>
        <p>
          Rose Charlotte &amp; COMPAGNIE à pour toutes les étapes de prise de
          commande ainsi que pour les étapes postérieures à la conclusion du
          contrat une obligation de résultat. <br /> <br />
          Ainsi Rose Charlotte &amp; COMPAGNIE s'engage à décrire avec la plus
          grande exactitude les produits vendus sur le Site Internet. En
          revanche, la responsabilité de Rose Charlotte &amp; COMPAGNIE ne
          pourra être engagée dans le cas où l'inexécution de ses obligations
          serait imputable soit au fait imprévisible et insurmontable d'un tiers
          au contrat soit à un cas de force majeure telle que définie par la
          jurisprudence française. De même, la responsabilité de Rose Charlotte
          &amp; COMPAGNIE ne saurait être engagée pour tous les inconvénients ou
          dommages inhérents à l'utilisation du réseau Internet, notamment une
          rupture de service, une intrusion extérieure ou la présence de virus
          informatiques. <br /> <br />
          En présence d'un événement constitutif de force majeure, Rose
          Charlotte &amp; COMPAGNIE en avisera l'utilisateur/acheteur dans les
          cinq (5) jours ouvrables suivant la survenance ou la menace de cet
          événement. <br />
          Les parties conviennent qu'elles devront se concerter dans les
          meilleurs délais afin de déterminer ensemble les modalités d'exécution
          de la commande pendant la durée du cas de force majeure. Au-delà d'un
          délai de 1 mois d'interruption pour cause de force majeure, Rose
          Charlotte &amp; COMPAGNIE pourra ne pas honorer la commande, à charge
          pour elle de rembourser l'acheteur le cas échéant. <br /> <br />
        </p>
      </div>
      <div>
        <h3>16. Loi applicable et compétence juridictionnelle</h3>
        <p>
          Les Conditions Générales sont soumises à la loi française en ce qui
          concerne les règles de fond comme les règles de forme. Tout litige
          devra faire l'objet d'une tentative préalable de règlement à
          l'amiable. En l'absence de règlement amiable, compétence est attribuée
          aux tribunaux français, nonobstant pluralité de défenseurs ou appel de
          garantie. <br /> <br />
          Le Site Internet est conforme à la législation française, et en aucun
          cas, Rose Charlotte &amp; COMPAGNIE ne donne de garantie de conformité
          à la législation locale qui vous serait applicable, dès lors que vous
          accédez au Site Internet à partir d'autres pays. <br /> <br />
          Les présentes conditions générales de vente peuvent être modifiées à
          tout moment et sans préavis par Rose Charlotte &amp; COMPAGNIE, les
          conditions applicables étant celles en vigueur à la date de la
          commande faite par le client. <br /> <br />
        </p>
      </div>
    </Container>
  );
}
