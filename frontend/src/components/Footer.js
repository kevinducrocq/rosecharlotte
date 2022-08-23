import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg1 text-white">
      <div className="d-flex justify-content-around align-items-center p-5">
        <div className="text-center logo-footer">
          <Image src="../logo-site.png" width={150} />
        </div>
        <div className="text-center">
          <Link className="nav-link" to="/cgv">
            Condition générales de vente
          </Link>
          <Link className="nav-link" to="/mentions">
            Mentions Légales
          </Link>
          <Link className="nav-link" to="/serviceclient">
            Service Client
          </Link>
        </div>
        <div className="text-center">
          <Link className="nav-link" to="/">
            Accueil
          </Link>
          <Link className="nav-link" to="/boutique/search">
            Boutique
          </Link>
          <Link className="nav-link" to="/about">
            A propos
          </Link>
          <Link className="nav-link" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
