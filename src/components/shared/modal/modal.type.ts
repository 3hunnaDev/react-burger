type ModalStyles = {
    main?: React.CSSProperties;
    header?: React.CSSProperties;
    button?: React.CSSProperties;
    content?: React.CSSProperties;
};

export interface ModalProps {
    title?: React.ReactNode;
    onClose: () => void;
    children: React.ReactNode;
    styles: ModalStyles
}

export interface ModalOverlayProps {
    onClose: () => void;
}