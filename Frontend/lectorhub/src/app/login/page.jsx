"use client";

import Image from "next/image";
import styles from "./page.module.css";

export default function Login() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>

        {/* Lado esquerdo */}

        <div className={styles.leftSide}>
        <Image
            src="/logoLectorHub.png"
            alt="Lector Hub"
            width={350}
            height={350}
        />
        </div>

        {/* Lado direito */}

        <div className={styles.rightSide}>

          <h2>LOGIN</h2>

        <form className={styles.form}>

        <div className="form-floating mb-3">
            <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">
            Username
            </label>
        </div>

        <div className="form-floating mb-3">
            <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            />
            <label htmlFor="floatingPassword">
            Password
            </label>
        </div>

        <div className={`${styles.options} mb-4`}>

 

            <label
                className="form-check-label"
                htmlFor="rememberMe"
            >
            <a href="#">
            Esqueceu a senha?
            </a>
            </label>
       


        </div>

        <button
            type="submit"
            className={`btn w-100 ${styles.loginButton}`}
        >
            Entrar
        </button>

        <p className={styles.registerText}>
        Não tem uma conta? <span>Cadastra-se</span>
        </p>

        </form>


          </div>

        </div>

    </main>
  );
}