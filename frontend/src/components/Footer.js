import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg1 p-3 text-white">
      <div className="d-flex justify-content-around p-5">
        <div className="text-center">
          <Link to="/cgv">Condition générales de vente</Link>
        </div>
        <div className="text-center">All rights reserved</div>
        <div className="text-center">All rights reserved</div>
      </div>
    </footer>
  );
}
