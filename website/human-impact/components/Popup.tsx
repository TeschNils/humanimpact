// components/Popup.tsx
import styles from '../styles/Popup.module.css';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface PopupProps {
  title: string;
  content: string;
  imageSrc: StaticImageData;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ title, content, imageSrc, onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <div className={styles.closeButtonContainer}>
            <button className={styles.closeButton} onClick={onClose}>X</button>
        </div>
        <h2>{title}</h2>
        <Image src={imageSrc} alt={title} className={styles.popupImage} />
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Popup;
