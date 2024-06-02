

class Organism {
    constructor() {

        this.generation = 0;

        this.energy = 1.0;
        this.maxEnergy = 5.0;
        this.baseEnergyLoss = 0.0005;
        this.energyLossFactor = 0.0;
        this.currentEnergyLoss = this.baseEnergyLoss;

        this.timeAlive = 0;

        this.wallDamage = 0.0025;

        this.isAdult = false;
        this.adultAge = 700;
        this.childSize = 5;
        this.energyToBreed = 1.125;
        this.totalChildren = 0;

        this.visualDebug = false;

        this.genes = {
            speed: new Gene("speed", 0.35, 0.9),
            size: new Gene("size", 5, 15),
            sightReach: new Gene("sight reach", 75, 125),
            sightAngle: new Gene("sight angle", 100, 175),
            turnAngleRange: new Gene("turn angle", 10, 90),
            diet: new Gene("diet", 0.9, 1.0)
        }

        // Organism can turn from -turnAngleRange/2 to +turnAngleRange/2
        this.turnAngleRange = this.genes.turnAngleRange.getGene();
        this.turnAngle;

        this.observation = [];
        this.neatBrain = new NEATNetwork(3, 1);

        this.displaySize = this.childSize;
        this.currentSpeed = 0;

        this.speed = this.genes.speed.getGene();
        this.size = this.genes.size.getGene();
        this.sightReach = this.genes.sightReach.getGene();
        this.sightAngle = this.genes.sightAngle.getGene();

        this.sensorLeft = p5.Vector.random2D();
        this.sensorRight = p5.Vector.random2D();

        this.position = createVector(random(simResX), random(simResY));
        this.direction = p5.Vector.random2D();

        this.prevDirection = p5.Vector.random2D();
        this.prevDirection2 = p5.Vector.random2D();

        this.oilCovered = false;
        this.insideOil = false;
        this.oilCoveredSpeed = 0.15;
        this.timeToClean = 500;
        this.cleanCounter = 0;

        this.isRadiated = false;
        this.radiationMutationChance = 0.5;
        this.radiationMutationFactor = 0.5;
        this.physicalMutationRotations = [];
    }
    eat(food) {
        // Diet specifies how much energy an organism gets through plant or meat
        if (food.type === FoodType.Plant) {
            if (this.energy >= this.maxEnergy) {
                return;
            }
            this.energy += this.genes.diet.getGene() * food.energyWorth;
        }
        else if (food.type === FoodType.Meat) {
            this.energy += (1 - this.genes.diet.getGene()) * food.energyWorth;
        }
        // Other food types (rotten, poisonous) are not affected by diet
        else {
            this.energy += food.energyWorth;
        }
    }

    energyConsumption() {
        this.currentEnergyLoss = this.baseEnergyLoss * Math.exp(this.energyLossFactor * this.timeAlive);

        let speedEnergyLoss = this.currentEnergyLoss * this.genes.speed.geneScore;
        let sizeEnergyLoss = this.currentEnergyLoss * this.genes.size.geneScore;
        let turnAngleLoss = (this.currentEnergyLoss * (Math.abs(this.turnAngle) / (this.turnAngleRange / 2)));

        this.energy -= speedEnergyLoss + sizeEnergyLoss + turnAngleLoss;
    }

    observe(foods) {
        // Get sensor positions
        let sightAngleLambda = (this.sightAngle / 2.0) * (Math.atan(1) * 4 / 180);

        this.sensorLeft = this.direction.copy().rotate(sightAngleLambda)
        this.sensorLeft.normalize();
        this.sensorLeft = this.sensorLeft.mult(this.sightReach);
        this.sensorLeft.add(this.position);

        this.sensorRight = this.direction.copy().rotate(-sightAngleLambda)
        this.sensorRight.normalize();
        this.sensorRight = this.sensorRight.mult(this.sightReach);
        this.sensorRight.add(this.position);

        // Observe food
        let foodFound = false;
        let closestFoodIndex = 0;
        let shortestDistanceToFood = this.sightReach;

        for (let i=0; i<foods.length - 1; i++) {
            let food = foods[i];

            let distanceToFood = this.position.dist(food.position);

            if (distanceToFood < (this.displaySize / 2 + food.size / 2)) {
                this.eat(food);
                foods.splice(i, 1);
                break;
            }
            
            if (distanceToFood <= shortestDistanceToFood) {                
                // Check if the current food liesinside the sight angle
                let foodPosition = foods[i].position.copy();
                let vecToFood = foodPosition.sub(this.position);
                if (Math.abs(this.direction.angleBetween(vecToFood)) > sightAngleLambda) {
                    continue;
                }
                foodFound = true;
                closestFoodIndex = i;
                shortestDistanceToFood = distanceToFood;
            }
        }

        let largestSensorDistance = this.sensorLeft.dist(this.sensorRight);
        let foodDistance1 = 0.0;
        let foodDistance2 = 0.0;
        let foodType = 0.0;
        if (foodFound) {
            let food = foods[closestFoodIndex];
            foodDistance1 = this.sensorLeft.dist(food.position) / largestSensorDistance;
            foodDistance2 = this.sensorRight.dist(food.position) / largestSensorDistance;

            if (this.visualDebug) {
                strokeWeight(1);
                stroke(255, 100, 100)
                line(this.sensorLeft.x, this.sensorLeft.y, food.position.x, food.position.y);
                stroke(100, 100, 255);
                line(this.sensorRight.x, this.sensorRight.y, food.position.x, food.position.y);
            }
            
            // Create numeric representation of food types
            if (food.type === FoodType.Plant) {
                foodType = 1.0;
            }
            else if (food.type === FoodType.Meat) {
                foodType = 0.5
            }
            else if (food.foodType === FoodType.Rotten || food.foodType === FoodType.Poisoned) {
                foodType = 0.1;
            }
        }        

        this.observation = [foodDistance1, foodDistance2, foodType];
    }

    inheritGenes(motherOrganism, fatherOrganism) {
        for (let gene in this.genes) {
            this.genes[gene].inherit(motherOrganism.genes[gene], fatherOrganism.genes[gene]);
        }

        let fittestParentNum = (motherOrganism.timeAlive >= fatherOrganism.timeAlive ? 1 : 2);

        this.neatBrain.crossoverAndMutate(motherOrganism.neatBrain, fatherOrganism.neatBrain, fittestParentNum);
    }

    mutateThroughRadiation() {
        for (let gene in this.genes) {
            if (random(0, 1) < this.radiationMutationChance) {
                // Mutate with higher rate
                this.genes[gene].mutationFactor = this.radiationMutationFactor;
                this.genes[gene].mutateGene();
                

                // We will later draw as many green circle shapes (indication mutations) as many radiation induced
                // mutations there were. These green circles will be on the border of the organism body. Therefore we
                // need to now initially set where in the body realtive to the organism the circles are by an angle
                let angleRadians = random(0, 360) * (PI / 180);
                this.physicalMutationRotations.push(angleRadians);
            }
        }

        this.neatBrain.mutationChance = this.radiationMutationChance;
        this.neatBrain.mutationFactor = this.radiationMutationFactor;
        this.neatBrain.mutate();

        this.baseEnergyLoss * 1000;
    }

    mate(organisms) {
        if (this.energy < this.energyToBreed || !this.isAdult || this.oilCovered) {
            return;
        }

        for (let i=0; i<organisms.length; i++) {
            let otherOrganism = organisms[i];
            if (otherOrganism == this) {
                continue;
            }

            let distance = p5.Vector.dist(this.position, otherOrganism.position);
            let collisionDistance = this.displaySize / 2 + otherOrganism.displaySize / 2;
            
            if (distance <= collisionDistance && 
                otherOrganism.energy >= this.energyToBreed &&
                otherOrganism.isAdult &&
                !otherOrganism.oilCovered
            ) {
                let childAmount = random([1, 2, 3, 4]);
                for (let c=0; c<childAmount; c++) {
                    let child = new Organism();
                    child.inheritGenes(this, otherOrganism);
                    child.generation = Math.ceil((this.generation + otherOrganism.generation) / 2) + 1;
                    child.position.x = this.position.x - this.displaySize / 2;
                    child.position.y = this.position.y - this.displaySize / 2;

                    if (this.isRadiated || otherOrganism.isRadiated) {
                        child.isRadiated = true;
                        child.mutateThroughRadiation()
                    }

                    organisms.unshift(child);

                    this.energy = this.energyToBreed * 0.75;
                    otherOrganism.energy = this.energyToBreed * 0.75;
                    this.totalChildren += childAmount;
                    otherOrganism.totalChildren += childAmount;
                }
                break;
            }
        }
    }

    move(i) {
        let actions = this.neatBrain.feedForward(this.observation);

        let turnAngleOutput = actions[0];        
        let turnAngleDeg = turnAngleOutput * (this.turnAngleRange * 2) - this.turnAngleRange;
        this.turnAngle = turnAngleDeg * (Math.atan(1) * 4 / 180);

        // Update body part directions
        this.prevDirection2 = this.prevDirection.copy();
        this.prevDirection = this.direction.copy();
        
        this.currentSpeed = this.speed;
        if (this.oilCovered) {
            this.currentSpeed = this.oilCoveredSpeed;
        }

        // Update direction and position
        this.direction = this.direction.rotate(this.turnAngle).normalize();
        this.position = this.position.add(this.direction.mult(this.currentSpeed));
        
        // Handle wall collisions
        if (this.position.x < this.size / 2 || this.position.x > simResX - this.size / 2) {
            this.direction.x *= -1;
            this.energy -= this.wallDamage;
        }
        if (this.position.y < this.size / 2 || this.position.y > simResY - this.size / 2) {
            this.direction.y *= -1;
            this.energy -= this.wallDamage;
        }
    }

    update() {
        if (this.timeAlive === this.adultAge) {
            this.isAdult = true;
        }
        else if (this.timeAlive < this.adultAge) {
            this.displaySize += (this.size - this.childSize) / this.adultAge;
        }
        
        this.energyConsumption();
        this.timeAlive += 1;

        if (this.insideOil) {
            this.cleanCounter = 0;
        }

        if (this.oilCovered && !this.insideOil) {
            this.cleanCounter += 1;
            if (this.cleanCounter === this.timeToClean) {
                this.oilCovered = false;
                this.cleanCounter = 0;
            }
        }
    }
  
    display(i) {
        let mainColor = color(234, 231, 206);
        if (this.oilCovered) {
            mainColor = color(145, 85, 250)
        }
        // Draw sensors
        let maxReachLine = this.displaySize * 1.3;
        let minReachLine = this.displaySize * 0.7;

        let reachLineFactor = ((this.sightReach - 45) / (100 - 45)) * (maxReachLine - minReachLine) + minReachLine;

        let displaySensorLeft = this.sensorLeft.copy().sub(this.position).normalize();
        let displaySensorRight = this.sensorRight.copy().sub(this.position).normalize();
        
        if (this.visualDebug) {
            fill(255, 255, 255, 0);
            strokeWeight(1)
            stroke(255)
            circle(this.position.x, this.position.y, this.sightReach * 2);
            line(this.position.x, this.position.y, this.position.x + displaySensorLeft.x * this.sightReach, this.position.y + displaySensorLeft.y * this.sightReach);
            line(this.position.x, this.position.y, this.position.x + displaySensorRight.x * this.sightReach, this.position.y + displaySensorRight.y * this.sightReach);
        }
        else {
            strokeWeight(1);
            stroke(mainColor);

            // Give green stoke if the organism is radiation poisoned
            if (this.isRadiated) {
                stroke(0, 255, 0, 100);
            }

            line(this.position.x, this.position.y, this.position.x + displaySensorLeft.x * reachLineFactor, this.position.y + displaySensorLeft.y * reachLineFactor);
            line(this.position.x, this.position.y, this.position.x + displaySensorRight.x * reachLineFactor, this.position.y + displaySensorRight.y * reachLineFactor);
            ellipse(this.position.x + displaySensorLeft.x * reachLineFactor, this.position.y + displaySensorLeft.y * reachLineFactor, int(this.displaySize * 0.2));
            ellipse(this.position.x + displaySensorRight.x * reachLineFactor, this.position.y + displaySensorRight.y * reachLineFactor, int(this.displaySize * 0.2));
        }

        strokeWeight(0);
        fill(mainColor);

        // Give green stoke if the organism is radiation poisoned
        if (this.isRadiated) {
            strokeWeight(1);
            stroke(0, 255, 0, 100);
        }
        ellipse(this.position.x, this.position.y, this.displaySize);

        // Additional styling when oil covered
        if (this.oilCovered) {
            fill(44, 11, 103);
            ellipse(this.position.x, this.position.y, this.displaySize * 0.75);
        }

        // Additional shapes when radiation poisoned
        if (this.isRadiated) {
            let radius = this.displaySize / 2;
            for (let i=0; i<this.physicalMutationRotations.length; i++) {
                let mutationShapeAngle = this.physicalMutationRotations[i];
                let x = this.position.x + radius * cos(mutationShapeAngle);
                let y = this.position.y + radius * sin(mutationShapeAngle);

                fill(0, 255, 0, 100);
                ellipse(x, y, this.displaySize * 0.33, radius);
            }
        }
        
    }
}
