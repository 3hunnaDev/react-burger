import React from "react";
import Modal from "../../modal/modal";
import styles from "./error-messege.module.css";

interface ErrorMessegeProps {
  title?: string;
  message: string;
  description?: string;
  onClose: () => void;
}

const modalStyles = {
  main: {
    display: "flex",
    width: 620,
    height: 420,
    borderRadius: 40,
    backgroundColor: "rgba(28, 28, 33, 1)",
  },
  header: {
    display: "flex",
    flex: 0.1,
    marginLeft: 40,
    marginTop: 40,
    marginRight: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    border: "none",
    height: 24,
    width: 24,
    background: "transparent",
    cursor: "pointer",
  },
  content: {
    display: "flex",
    flex: 1,
    padding: "24px",
  },
};

const ErrorMessege: React.FC<ErrorMessegeProps> = ({
  title = "Сообщение об шибке",
  message,
  description,
  onClose,
}) => (
  <Modal
    title={<p className="text text_type_main-large">{title}</p>}
    onClose={onClose}
    styles={modalStyles}
  >
    <div className={styles.container}>
      <p className="text text_type_main-default">{message}</p>
      {description && (
        <p
          className={`text text_type_main-default text_color_inactive ${styles.description}`}
        >
          {description}
        </p>
      )}
    </div>
  </Modal>
);

export default ErrorMessege;
