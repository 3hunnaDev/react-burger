import React, { useCallback, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import ModalOverlay from "./modal-overlay";
import { ModalProps } from "./modal.type";
import defaulModalStyles from "./modal.module.css";

const MODAL_ROOT_ID = "modal-root";

const Modal: React.FC<ModalProps> = ({ title, onClose, children, styles }) => {
  const modalRoot = useMemo(() => document.getElementById(MODAL_ROOT_ID), []);

  const handleEscPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscPress);

    return () => {
      document.removeEventListener("keydown", handleEscPress);
    };
  }, [handleEscPress]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const computedPadding = window
        .getComputedStyle(document.body)
        .paddingRight.replace("px", "");
      const currentPadding = Number.parseFloat(computedPadding) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  if (!modalRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div className={defaulModalStyles.main} style={styles.main}>
        <header className={defaulModalStyles.header} style={styles.header}>
          {title}
          <button
            type="button"
            className={defaulModalStyles.button}
            style={styles.button}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
        </header>
        <div className={defaulModalStyles.content} style={styles.content}>
          {children}
        </div>
      </div>
    </>,
    modalRoot
  );
};

export default Modal;
