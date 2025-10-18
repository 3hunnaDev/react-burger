import React from "react";
import Modal from "../modal/modal";
import styles from "./error-messege.module.css";

interface ErrorMessegeProps {
  title?: string;
  message: string;
  description?: string;
  onClose: () => void;
}

const modalStyles = {
  main: {
    width: 620,
    minHeight: 420,
    borderRadius: 40,
    backgroundColor: "rgba(28, 28, 33, 1)",
  },
  header: {
    display: "flex",
    margin: "24px 24px 0 24px",
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
    padding: "0 24px 24px 24px",
  },
};

const ErrorMessege: React.FC<ErrorMessegeProps> = ({
  title = "Уведомление",
  message,
  description,
  onClose,
}) => (
  <Modal
    title={<h2 className="text text_type_main-large">{title}</h2>}
    onClose={onClose}
    styles={modalStyles}
  >
    <div className={styles.container}>
      <p className="text text_type_main-medium">{message}</p>
      {description && (
        <p className={`text text_type_main-default ${styles.description}`}>
          {description}
        </p>
      )}
    </div>
  </Modal>
);

export default ErrorMessege;
