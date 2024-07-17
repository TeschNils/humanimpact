// components/SimulationElements.tsx
import { useState } from 'react';
import styles from '../styles/simulationElements.module.css';
import Image from 'next/image';
import Oil from '../public/images/Oil.svg';
import CO2 from '../public/images/CO2.svg';
import NuclearWaste from '../public/images/Nuclear.svg';
import Plant from '../public/images/plant.svg';
import Rotten from '../public/images/rotten.svg';
import Polluted from '../public/images/polluted.svg';
import Popup from './Popup';
import OilPreview from '../public/images/oil-preview.png';
import CO2Preview from '../public/images/co2-preview.png';
import NuclearPreview from '../public/images/nuclear-preview.png';
import { StaticImageData } from 'next/image';

const simulationElements = () => {
  const [popupInfo, setPopupInfo] = useState<{ title: string, content: string, imageSrc: StaticImageData } | null>(null);

  const handlePopup = (title: string, content: string, imageSrc: StaticImageData) => {
    setPopupInfo({ title, content, imageSrc });
  };

  const closePopup = () => {
    setPopupInfo(null);
  };

  return (
    <div className={styles.simulationElements}>
      {popupInfo && (
        <Popup 
          title={popupInfo.title} 
          content={popupInfo.content} 
          imageSrc={popupInfo.imageSrc} 
          onClose={closePopup} 
        />
      )}
      <div className={styles.organism}>
        <div className={styles.headline}>
          <h2>Organism</h2>
        </div>
        <div className={styles.brainSection}>
          <div className={styles.text}>
            <p>
              <strong>Brain: NEAT Algorithm</strong>
              <br/>
              <br/>
              The brain of our simulated organisms utilizes the NEAT (NeuroEvolution of Augmenting Topologies) algorithm. NEAT evolves both the structure and weights of neural networks, starting from simple configurations and progressively complexifying through mutations and genetic encoding. This allows the organisms to adapt, learn, and improve their behaviors over time, mimicking the process of natural evolution.
            </p>
          </div>
        </div>
        <div className={styles.geneSection}>
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
          <h2>Pollution</h2>
        </div>
        <div className={styles.section}>
          <div 
            className={styles.imageContainer} 
            onClick={() => handlePopup('Oil Leakage', 'Large parts of the ecosystem are polluted after an oil platform leak. There are reports of organisms which are covered in oil resulting in their death.', OilPreview)}>
            <Image className={styles.image} src={Oil} alt="Oil"/>
            <p>Oil Leakage</p>
          </div>
          <div 
            className={styles.imageContainer} 
            onClick={() => handlePopup('CO2 Pollution', 'The CO2 pollution levels have drastically risen. The lack of fresh air and sunlight is slowly degrading plants in the area.', CO2Preview)}>
            <Image className={styles.image} src={CO2} alt="CO2"/>
            <p>CO2 Pollution</p>
          </div>
          <div 
            className={styles.imageContainer} 
            onClick={() => handlePopup('Nuclear Waste', 'The waste of a near by nuclear plant is contaminating the ecosystem, resulting in radiation poisoning and gene mutation in organisms.', NuclearPreview)}>
            <Image className={styles.image} src={NuclearWaste} alt="Nuclear Waste"/>
            <p>Nuclear Waste</p>
          </div>
        </div>
      </div>
      <div className={styles.food}>
        <div className={styles.headline}>
          <h2>Food</h2>
        </div>
        <div className={styles.section}>
          <div className={styles.foodContainer}
            onClick={() => handlePopup('Plant', 'Plants are the primary producers in the ecosystem, converting sunlight into energy through photosynthesis. They form the base of the food chain, providing nutrients for other organisms.', Plant)}>
            <Image className={styles.image} src={Plant} alt="Foodtype Plant"/>
          </div>
          <div className={styles.foodContainer}
            onClick={() => handlePopup('Polluted', 'The food source has been contaminated by pollution, causing harm to organisms that consume it. This results in a decline in population and health of the affected species.', Polluted)}>
            <Image className={styles.image} src={Polluted} alt="Foodtype Polluted"/>
          </div>
          <div className={styles.foodContainer}
            onClick={() => handlePopup('Rotten', 'The food source has spoiled and is no longer suitable for consumption. Organisms that consume rotten food may suffer from illness or malnutrition.', Rotten)}>
            <Image className={styles.image} src={Rotten} alt="Foodtype Rotten"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default simulationElements;
