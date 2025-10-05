import React from "react";
import overlayStyles from "./modal.module.css";
import { ModalOverlayProps } from "./modal.type";

const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClose }) => (
  <div className={overlayStyles.overlay} onClick={onClose} />
);

export default ModalOverlay;
