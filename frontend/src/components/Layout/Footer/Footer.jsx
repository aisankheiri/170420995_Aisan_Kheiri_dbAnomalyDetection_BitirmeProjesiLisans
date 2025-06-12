import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
    
      <div className="copyright-row">
        <div className="container">
          <div className="footer-copyright">
            <div className="site-copyright">
              <p>
                Copyright 2022 Theme. All right reserved. 
              </p>
            </div>

            <div className="footer-menu">
              <ul className="footer-menu-list">
                <li className="list-item">
                  <a href="#">Privacy Policy</a>
                </li>
                <li className="list-item">
                  <a href="#">Terms and Conditions</a>
                </li>
                <li className="list-item">
                  <a href="#">Returns Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
