

class Organism {
    constructor() {

        this.energy = 100;
        this.energyLoss = 0.01;
        this.timeAlive = 0;

        this.isAdult = false;
        this.color = 255;

        this.adultAge = 750;
        this.childSize = 7;
        this.energyToBreed = 125;
        this.energyBreedConsumption = 20;

        this.isPoisoned = false;
        this.isOilContaminated = false;

        this.genes = {
            speed: new Gene(1, 2),
            size: new Gene(10, 20),
            sightReach: new Gene(5, 20),
            sightAngle: new Gene(45, 120)
        }

        this.displaySize = this.childSize;

        this.speed = this.genes.speed.getGene();
        this.size = this.genes.size.getGene();
        this.sightReach = this.genes.sightReach.getGene();
        this.sightAngle = this.genes.sightAngle.getGene();

        this.position = createVector(random(width), random(height));
        this.direction = p5.Vector.random2D();
    }

    observe(foods) {
        ;
    }

    inheritGenes(motherOrganism, fatherOrganism) {
        for (let gene in this.genes) {
            this.genes[gene].inherit(motherOrganism.genes[gene], fatherOrganism.genes[gene]);
        }
    }

    mate(organisms) {
        if (this.energy < this.energyToBreed || !this.isAdult
        ) {
            return;
        }
        
        for (let i=0; i<organisms.length; i++) {
            let otherOrganism = organisms[i];
            if (otherOrganism == this) {
                continue;
            }
            
            let distance = p5.Vector.dist(this.position, otherOrganism.position);
            let collisionDistance = this.size / 2 + otherOrganism.size / 2;
            
            if (distance <= collisionDistance && 
                otherOrganism.energy >= this.energyToBreed &&
                otherOrganism.isAdult
            ) {
                let child = new Organism();
                child.inheritGenes(this, otherOrganism);
                
                child.position.x = this.position.x - this.size / 2
                child.position.y = this.position.y - this.size / 2

                organisms.unshift(child)

                this.energy = 75;
                otherOrganism.energy = 75;
                break;
            }
        }
    }

    move() {
        this.direction.normalize();
        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;

        if (this.position.x < this.size / 2 || this.position.x > width - this.size / 2) {
            this.direction.x *= -1;
        }
        if (this.position.y < this.size / 2 || this.position.y > height - this.size / 2) {
            this.direction.y *= -1;
        }
    }

    eat(foods) {
        for (let i=0; i<foods.length; i++) {
            let food = foods[i];
            let distance = p5.Vector.dist(this.position, food.position);
            let collisionDistance = this.size / 2 + food.size / 2;
            
            if (distance <= collisionDistance) {
                this.energy += food.type;
                foods.splice(i, 1);
            }
        }

    }

    update() {
        if (this.timeAlive === this.adultAge) {
            this.isAdult = true;
        }
        else if (this.timeAlive < this.adultAge) {
            this.displaySize += (this.size - this.childSize) / this.adultAge;
        }
        
        if (this.timeAlive >= this.adultAge) {
            this.energy -= this.energyLoss;
        }
        this.timeAlive += 1;
    }
  
    display() {
        fill(this.color);
        strokeWeight(2)
        stroke(175);
        ellipse(this.position.x, this.position.y, this.displaySize);
    }
}
