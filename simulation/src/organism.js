

class Organism {
    constructor() {

        this.energy = 100;
        this.energyLoss = 0.025;
        this.timeAlive = 0;

        this.isAdult = false;
        this.color = 255;

        this.adultAge = 750;
        this.childSize = 5;
        this.energyToBreed = 50;
        this.energyBreedConsumption = 25;

        this.isPoisoned = false;
        this.isOilContaminated = false;

        this.genes = {
            speed: new Gene(1, 1.75),
            size: new Gene(5, 15),
            sightReach: new Gene(5, 20),
            sightAngle: new Gene(45, 120)
        }

        this.brain = new Brain();
        this.observation = [];

        this.displaySize = this.childSize;

        this.speed = this.genes.speed.getGene();
        this.size = this.genes.size.getGene();
        this.sightReach = this.genes.sightReach.getGene();
        this.sightAngle = this.genes.sightAngle.getGene();

        this.turnAngle = 40;

        this.sensorLeft = p5.Vector.random2D();
        this.sensorLeft.x = 2;
        this.sensorRight = p5.Vector.random2D();

        this.position = createVector(random(width), random(height));
        this.direction = p5.Vector.random2D();

        this.prevDirection = p5.Vector.random2D();
        this.prevDirection2 = p5.Vector.random2D();
    }

    calculateEnergyLoss() {
        // TODO based on size, speed, age
    }

    observe(foods) {
        let foodFound = false;
        let closestFoodIndex = 0;
        let shortestDistanceToFood = this.genes.sightReach.getGene();

        for (let i=0; i<foods.length - 1; i++) {
            let food = foods[i];
            let distanceToFood = this.position.dist(food.position);

            if (distanceToFood < (this.displaySize / 2 + food.size / 2)) {
                this.energy += food.type;
                foods.splice(i, 1);
            }

            if (distanceToFood <= shortestDistanceToFood) {
                foodFound = true;
                closestFoodIndex = i;
                shortestDistanceToFood = distanceToFood;
            }
        }

        let foodDistance1 = random(0.0, 1.0);
        let foodDistance2 = random(0.0, 1.0);
        let foodType = 1.0;
        if (foodFound) {
            let food = foods[closestFoodIndex]
            foodDistance1 = this.sensorLeft.dist(food.position) / this.genes.sightReach.getGene();
            foodDistance2 = this.sensorRight.dist(food.position) / this.genes.sightReach.getGene();

            // food type encodings: Plant -> 0.0, Meat -> 0.5, Rotten -> 1.0;
            if (food.type == FoodType.Plant) {
                foodType = 1.0;
            }
            else if (food.foodType == FoodType.Rotten || food.foodType == FoodType.Poisoned) {
                foodType = 0.0;
            }
        }

        this.observation = [foodDistance1, foodDistance2, foodType];

    }

    inheritGenes(motherOrganism, fatherOrganism) {
        for (let gene in this.genes) {
            this.genes[gene].inherit(motherOrganism.genes[gene], fatherOrganism.genes[gene]);
        }

        if (random(0, 0.5) < 0.5) {
            this.brain.inheritBrain(motherOrganism.brain);
        }
        else {
            this.brain.inheritBrain(fatherOrganism.brain);
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
                console.log("BORN")
                let child = new Organism();
                child.inheritGenes(this, otherOrganism);
                
                child.position.x = this.position.x - this.size / 2
                child.position.y = this.position.y - this.size / 2

                organisms.unshift(child);

                this.energy = 45;
                otherOrganism.energy = 45;
                break;
            }
        }
    }

    move(i) {
        let turnAngleRange = this.turnAngle;
        let turnAngleOutput = this.brain.forward([random(0.0, 1), random(0.0, 1), random(0.0, 1)])[0];
        
        //let turnAngle = turnAngleOutput * turnAngleRange - turnAngleRange / 2;
        let turnAngle = ((turnAngleOutput - 0.0) / (1.0 - 0.0)) * (turnAngleRange - (-turnAngleRange)) + (-turnAngleRange);
        turnAngle = turnAngle * (Math.atan(1) * 4 / 180);

        if (random(0, 1) < 0.8) {
            this.prevDirection2 = this.prevDirection.copy();
            this.prevDirection = this.direction.copy();
        }
        

        this.direction.x = (this.direction.x * cos(turnAngle)) - (this.direction.y * sin(turnAngle));
        this.direction.y = (this.direction.x * sin(turnAngle)) + (this.direction.y * cos(turnAngle));

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

    update() {
        let sightAngleLambda = (this.sightAngle / 2.0) * (Math.atan(1) * 4 / 180);

        this.sensorLeft.x = (this.direction.x * cos(sightAngleLambda)) - (this.direction.y * sin(sightAngleLambda));
        this.sensorLeft.y = (this.direction.x * sin(sightAngleLambda)) + (this.direction.y * cos(sightAngleLambda));
        this.sensorLeft.normalize();
        this.sensorLeft.x *= this.sightReach;
        this.sensorLeft.y *= this.sightReach;

        this.sensorRight.x = (this.direction.x * cos(-sightAngleLambda)) - (this.direction.y * sin(-sightAngleLambda));
        this.sensorRight.y = (this.direction.x * sin(-sightAngleLambda)) + (this.direction.y * cos(-sightAngleLambda));
        this.sensorRight.normalize();
        this.sensorRight.x *= this.sightReach;
        this.sensorRight.y *= this.sightReach;

        if (this.timeAlive === this.adultAge) {
            this.isAdult = true;
        }
        else if (this.timeAlive < this.adultAge) {
            this.displaySize += (this.size - this.childSize) / this.adultAge;
        }
        
        this.energy -= this.energyLoss;
        this.timeAlive += 1;
    }
  
    display() {
        fill(this.color);
        strokeWeight(1)
        stroke(100);
        ellipse(this.position.x, this.position.y, this.displaySize);

        this.prevDirection.normalize();

        let mid = p5.Vector.random2D();
        mid.x = this.position.x - this.prevDirection.x * ((this.displaySize / 2) + (this.displaySize / 2 / 2));
        mid.y = this.position.y - this.prevDirection.y * ((this.displaySize / 2) + (this.displaySize / 2 / 2));

        ellipse(mid.x, mid.y, this.displaySize / 2);

        let lower = p5.Vector.random2D();
        lower.x = mid.x - this.prevDirection2.x * ((this.displaySize / 3) + (this.displaySize / 3 / 2));
        lower.y = mid.y - this.prevDirection2.y * ((this.displaySize / 3) + (this.displaySize / 3 / 2));

        ellipse(lower.x, lower.y, this.displaySize / 3);

        let maxReachLine = this.displaySize * 1.5;
        let minReachLine = this.displaySize * 0.75;

        let reachLineFactor = ((this.sightReach - 5) / (20 - 5)) * (maxReachLine - minReachLine) + minReachLine;

        this.sensorLeft.normalize();
        this.sensorRight.normalize();

        line(this.position.x, this.position.y, this.position.x + this.sensorLeft.x * reachLineFactor, this.position.y + this.sensorLeft.y * reachLineFactor);
        line(this.position.x, this.position.y, this.position.x + this.sensorRight.x * reachLineFactor, this.position.y + this.sensorRight.y * reachLineFactor);

    }
}
