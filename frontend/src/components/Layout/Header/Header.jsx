import "./Header.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header>
      <div className="header-row">
        <div className="container">
          <div className="header-wrapper">
            <div className="header-mobile">
              <i className="bi bi-list" id="btn-menu"></i>
            </div>
            <div className="header-left">
              <Link to={"/"}>
                <img
                  src="/img/navbar/dp_logo.png"
                  alt="Data Platform Logo"
                  style={{ width: "200px", height: "auto" }}
                />
              </Link>
            </div>
            <div className="header-center" id="sidebar">
              <nav className="navigation">
                <ul className="menu-list">
                  <li className="menu-list-item">
                    <Link to={"/"} className="menu-link active">
                      Ana sayfa
                    </Link>
                  </li>
                  <li className="menu-list-item megamenu-wrapper">
                    <Link to={"/algoritm1"} className="menu-link">
                      SVM ALGORİTMASI
                    </Link>
                  </li>
                  <li className="menu-list-item">
                    <Link to={"/algoritm2"} className="menu-link">
                      KNN ALGORİTMASI
                    </Link>
                  </li>
                  <li className="menu-list-item">
                    <Link to={"/algoritm3"} className="menu-link">
                      GBM ALGORİTMASI
                    </Link>
                  </li>
                  <li className="menu-list-item">
                    <Link to={"/"} className="menu-link">
                      İLETİŞİM
                    </Link>
                  </li>
                </ul>
              </nav>
              <i className="bi-x-circle" id="close-sidebar"></i>
            </div>
            <div className="header-right">
              <div className="header-right-links">
                <Link to={"/auth"} className="header-account">
                  <i className="bi bi-person"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
