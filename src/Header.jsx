import React from 'react';
import './Header.css';
import { APP_NAME } from './config';
import botLogo from './assets/bot ai.svg';

const Header = () => (
  <header className="main-header-fixed">
    <div className="h-container">
      <img src={botLogo} alt="Bot Logo" />
      <div className="h-text">
        <h3>{APP_NAME}</h3>
        <div className="status-bar">
          <span className="pulse-dot"></span> Online
        </div>
      </div>
    </div>
  </header>
);

export default Header;
