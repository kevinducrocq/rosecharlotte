import { Link } from 'react-router-dom';
import data from '../data';

function HomePage() {
  return (
    <div>
      <h1>Produits</h1>
      <div className="products">
        {data.products.map((product) => (
          <div className="product" key={product.slug}>
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
export default HomePage;
