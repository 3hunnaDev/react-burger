import React from "react";
import { Link } from "react-router-dom";
import styles from "./not-found.module.css";

const NotFoundPage: React.FC = () => {
  return (
    <section className={styles.page}>
      <h1 className="text text_type_main-large">Страница не найдена</h1>
      <p className="text text_type_main-default text_color_inactive">
        Кажется, вы попали по неверному адресу.
      </p>
      <Link to="/" className={`text text_type_main-default ${styles.link}`}>
        Вернуться на главную
      </Link>
    </section>
  );
};

export default NotFoundPage;
