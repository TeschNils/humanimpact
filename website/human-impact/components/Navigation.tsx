import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import humanImpact from '../public/images/humanImpact-logo.svg';
import gitlab from '../public/images/gitlab-logo-700.svg';

const Navigation = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.humanImpactContainer}>
                <Image className={styles.humanImpact} src={humanImpact} alt="Human Impact Logo"/>
            </div>
            <div className={styles.gitlabContainer}>
                <a className={styles.gitlabLink} href="https://gitlab.lrz.de/markus.schnugg/ATMMN" target="_blank" rel="noopener noreferrer">
                    <Image className={styles.gitLab} src={gitlab} alt="Gitlab Logo"/>
                </a>
            </div>
        </nav>
    );
};

export default Navigation;
