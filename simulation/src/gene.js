

class Gene {
    constructor(name, minGeneValue, maxGeneValue) {
        this.name = name;
        this.minGeneValue = minGeneValue;
        this.maxGeneValue = maxGeneValue;

        this.geneScore = random(0, 1);

        this.mutationChance = 0.1;
        this.mutationFactor = 0.05;
    }

    getGene() {
        return mapToRange(this.geneScore, [0, 1], [this.minGeneValue, this.maxGeneValue]);
    }

    mutateGene() {
        let mutationValue = random(-this.mutationFactor, this.mutationFactor)
        this.geneScore = Math.max(0.0, Math.min(this.geneScore + mutationValue, 1.0));
    }

    inherit(motherGene, fatherGene, fittestParent) {
        // Have a 90% chance of taking the gene of the fitter/longer-living parent
        if (random(0, 1) < 0.9) {
            this.geneScore = fittestParent === 1 ? motherGene.geneScore : fatherGene.geneScore;
        }
        else {
            this.geneScore = fittestParent === 1 ? fatherGene.geneScore : motherGene.geneScore;
        }

        if (random(0, 1) < this.mutationChance) {
            this.mutateGene();
        }
    }
}