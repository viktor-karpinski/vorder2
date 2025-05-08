"use client"

import Image from "next/image";
import styles from "./auth.module.css";
import Link from "next/link";

import { useApi } from "@/api";


const Auth = () => {

    const { post } = useApi();

    const handleLogin = (ev) => {
        ev.preventDefault()

        const email = ev.target.email.value;
        const password = ev.target.password.value;

        post('login', { email: email, password: password })
        .then(data => {
            console.log(data)
        })
    }

    return (
        <main className={styles.main}>
            <section className={styles.welcome}>
                <h1>
                    Welcome to Vorder
                </h1>

                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae nulla rerum, maxime eaque odio dolores voluptates eligendi eos similique, ea quisquam cum est! Et, ipsam quis amet at suscipit quisquam.
                </p>
            </section>
            <aside className={styles.aside}>
                <Image
                    className={styles.logo}
                    src="/logo.svg"
                    alt="Vorder logo"
                    width={150}
                    height={150}
                    priority
                />
                <article>
                    <form className={styles.form} onSubmit={handleLogin}>
                        <h2>
                            Log in to your account
                        </h2>
                        <div  className={styles.input}>
                            <label>
                                your email
                            </label>
                            <input type="email" name="email" placeholder="developer@viktorkarpinski.com" autoComplete="off" />
                        </div>

                        <div  className={styles.input}>
                            <label>
                                your password
                            </label>
                            <input type="password" name="password" placeholder="#VorderIsTheBest" />
                            <Link href="/" className={styles.forgot}>
                                I forgot my password
                            </Link>
                        </div>
                        <button className={styles.button} type="submit">
                            LOG IN
                        </button>
                        <button className={styles.switch} type="button">
                            If you don't have an account <span>click here</span>
                        </button>
                    </form>
                </article>
            </aside>
        </main>
    )
}

export default Auth;