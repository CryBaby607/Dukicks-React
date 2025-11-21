import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faTiktok
} from '@fortawesome/free-brands-svg-icons'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">

            <div className="footer-column">
              <div className="footer-brand">
                <h3 className="footer-logo">
                  <span className="logo-du">DU</span>
                  <span className="logo-kicks">KICKS</span>
                </h3>
                <p className="footer-description">
                  Tu destino para el mejor calzado deportivo y streetwear. 
                  Encuentra las últimas tendencias y los clásicos que nunca pasan de moda.
                </p>
              </div>

              <div className="footer-social">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Síguenos en Facebook"
                  className="social-link"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Síguenos en Instagram"
                  className="social-link"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Síguenos en Twitter"
                  className="social-link"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Síguenos en TikTok"
                  className="social-link"
                >
                  <FontAwesomeIcon icon={faTiktok} />
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Enlaces rápidos</h4>
              <ul className="footer-links">
                <li>
                  <a href="/">Inicio</a>
                </li>
                <li>
                  <a href="#hombre">Hombre</a>
                </li>
                <li>
                  <a href="#mujer">Mujer</a>
                </li>
                <li>
                  <a href="#gorras">Gorras</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Ayuda</h4>
              <ul className="footer-links">
                <li>
                  <a href="#envios">Envíos y entregas</a>
                </li>
                <li>
                  <a href="#devoluciones">Devoluciones</a>
                </li>
                <li>
                  <a href="#faq">Preguntas frecuentes</a>
                </li>
                <li>
                  <a href="#contacto">Contacto</a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              &copy; {currentYear} <strong>DUKICKS</strong>. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer