import styles from '../styles/simulationElements.module.css';
import Image from 'next/image';
import Brain from '../public/images/brain.jpg';
import DNA from '../public/images/genes2.jpg';
import Oil from '../public/images/Oil.svg';
import CO2 from '../public/images/CO2.svg';
import NuclearWaste from '../public/images/nuclearWaste.svg';
import Plant from '../public/images/plant.svg';
import Rotten from '../public/images/rotten.svg';

const simulationElements = () => {
    return (
        <div className={styles.simulationElements}>
            <div className={styles.organism}>
                <div className={styles.headline}>
                    <h3>Organism</h3>
                </div>
                <div className={styles.section}>
                    <div className={styles.text}>
                        <p>
                            <strong>Brain: NEAT Algorithm</strong>
                            <br/>
                            <br/>
                            The brain of our simulated organisms utilizes the NEAT (NeuroEvolution of Augmenting Topologies) algorithm. NEAT evolves both the structure and weights of neural networks, starting from simple configurations and progressively complexifying through mutations and genetic encoding. This allows the organisms to adapt, learn, and improve their behaviors over time, mimicking the process of natural evolution.
                        </p>
                    </div>
                    <div className={styles.organismContainer}>
                        <Image className={styles.image} src={Brain} alt="Brain"/>
                    </div> 
                </div>
                <div className={styles.section}>
                    <div className={styles.organismContainer}>
                        <Image className={styles.image} src={DNA} alt="Genes"/>
                    </div>
                    <div className={styles.text}>
                        <p>
                            <strong>Genes: Crossover Mechanism</strong>
                            <br/>
                            <br/>                            
                            The genetic makeup of our simulated organisms is determined through a crossover process involving two gene lists. This method combines genetic material from two parent organisms, creating offspring with a mix of traits from both. This crossover technique promotes genetic diversity and enables the evolution of more adaptable and robust organisms.
                        </p>
                    </div>
                </div>
            </div>
            <div className={styles.pollution}>
                <div className={styles.headline}>
                    <h3>Pollution</h3>
                </div>
                <div className={styles.section}>
                    <div className={styles.imageContainer}>
                        <Image className={styles.image} src={Oil} alt="Oil"/>
                        <p>Oil Leakage</p>
                    </div>
                    <div className={styles.imageContainer}>
                        <Image className={styles.image} src={CO2} alt="CO2"/>
                        <p>CO2 Pollution</p>
                    </div>
                    <div className={styles.imageContainer}>
                        <Image className={styles.image} src={NuclearWaste} alt="Nuclear Waste"/>
                        <p>Nuclear Waste</p>
                    </div>
                </div>
            </div>
            <div className={styles.food}>
                <div className={styles.headline}>
                    <h3>Food</h3>
                </div>
                <div className={styles.section}>
                    <div className={styles.foodContainer}>
                        <Image className={styles.image} src={Plant} alt="Foodtype Plant"/>
                    </div>
                    <div className={styles.foodContainer}>
                        <Image className={styles.image} src={Rotten} alt="Foodtype Rotten"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default simulationElements;
