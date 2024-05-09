

class Gene {
    constructor(minGeneValue, maxGeneValue) {
        this.minGeneValue = minGeneValue;
        this.maxGeneValue = maxGeneValue;

        this.geneScore = random(0, 1);

        this.mutationChance = 0.1;
        this.mutationFactor = 0.1;
    }

    getGeneValue(value, min, max) {
        return Math.round(value * (max - min) + min)
    }

    getGene() {
        return this.getGeneValue(this.geneScore, this.minGeneValue, this.maxGeneValue);
    }

    mutateGene() {
        let mutationValue = random(-this.mutationFactor, this.mutationFactor)
        this.geneScore = Math.max(0.0, Math.min(this.geneScore + mutationValue, 1.0));
    }

    inherit(motherGene, fatherGene) {
        if (Math.round(random()) == 0) {
            this.geneScore = motherGene.geneScore
        }
        else {
            this.geneScore = fatherGene.geneScore
        }

        if (random(0, 1) < this.mutationFactor) {
            this.mutateGene();
        }
    }
}