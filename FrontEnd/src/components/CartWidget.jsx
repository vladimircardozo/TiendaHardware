import './css/style.css';
import { Link } from 'react-router-dom';

export const CartWidget = () => {
  return (
    <div className="cart-widget">
      <Link>
        <i className="bi bi-cart3"></i>
      </Link>
    </div>
  );
};
