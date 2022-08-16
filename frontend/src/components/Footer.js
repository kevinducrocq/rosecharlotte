import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg1 p-3 text-white">
      <div className="d-flex justify-content-around p-5">
        <div className="text-center">Logo du site</div>
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
        <div className="text-center">All rights reserved</div>
      </div>
    </footer>
  );
}
