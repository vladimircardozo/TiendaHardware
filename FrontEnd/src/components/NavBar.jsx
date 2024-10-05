import { Link } from 'react-router-dom';
import Logo from '../assets/img/logo.png';
import './css/style.css';
import { CartWidget } from './CartWidget';


export const NavBar = () => {
  return (
    <div className="border-bottom shadow-bottom">
      <nav className="navbar navbar-expand-lg container">
        <div className="container-fluid">
          <div className="navbar-header me-auto">
            <img className="logo" src={Logo} alt="" />
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link hvr-underline-reveal">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link hvr-underline-reveal">Productos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link hvr-underline-reveal">Quiénes somos?</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link hvr-underline-reveal">Contactos</Link>
              </li>
            </ul>
            <div>
                <CartWidget />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
