import { Bell, User } from "lucide-react";
import styles from './header.module.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.svg" alt="Logo" className="logo" />

        <div className="logo-text">
          <h2>Minha Biblioteca</h2>
          <span>Sistema de Biblioteca</span>
        </div>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
        </button>

        <div className="user-info">
          <div className="avatar">
            <User size={22} />
          </div>

          <div className="user-text">
            <strong>Olá, usuario!</strong>
            <span>Bem-vinda de volta.</span>
          </div>
        </div>
      </div>
    </header>
  );
}