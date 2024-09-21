import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <div className="shadow-top">
            <footer className="container pt-3 my-3">
                <ul className="nav justify-content-center pb-3 mb-3">
                    <li className="nav-item"><Link to={"https://www.instagram.com/vlad.cardozo/"} target="_black" rel="noopener noreferrer" className="nav-link px-2 text-body-secondary">Instagram</Link></li>
                    <li className="nav-item"><Link to={"https://x.com/vladifachita"} target="_black" rel="noopener noreferrer" className="nav-link px-2 text-body-secondary">Twitter</Link></li>
                    <li className="nav-item"><Link to={"https://github.com/vladimircardozo"} target="_black" rel="noopener noreferrer" className="nav-link px-2 text-body-secondary">GitHub</Link></li>
                    <li className="nav-item"><Link to={"https://www.linkedin.com/in/vladimir-cardozo-2b3b6222b/"}  target="_black" rel="noopener noreferrer" className="nav-link px-2 text-body-secondary">Linkedin</Link></li>
                </ul>
                <p className="text-center text-body-secondary">&copy; 2024 TiendaDeHardware</p>
            </footer>
        </div>
    )
}