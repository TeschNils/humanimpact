

const FoodType = {
    Plant: {
        minEnergy: 1.0,
        maxEnergy: 1.75,
        color: [157, 206, 54]
    },
    Rotten: {
        minEnergy: -0.75,
        maxEnergy: -0.25,
        color: [185, 102, 19]
    },
    Poisoned: {
        minEnergy: -1.75,
        maxEnergy: -1.0,
        color: [0, 255, 194]
    },
    Meat: {
        minEnergy: 0.5,
        maxEnergy: 0.5,
        color: [240, 105, 105]
    }
};


class Food {
    constructor(type) {
        this.timeAlive = 0;
        this.type = type; 
        this.position = new p5.Vector(random(width), random(height));

        this.desintegrated = false;

        this.foodSizeRange = [5, 13];
        this.foodColor = color(this.type.color);
        this.size;

        this.lifeTime = 7000;
        this.plantDuration = 5000;

        this.energyWorth;
        
        if (this.type === FoodType.Plant) {
            this.size = random(this.foodSizeRange[0], this.foodSizeRange[1]);
            this.energyWorth = this.mapIntoRange(this.foodSizeRange, [FoodType.Plant.minEnergy, FoodType.Plant.maxEnergy], this.size);
        }
        else if (this.type === FoodType.Meat) {
            this.size = 5;
            this.energyWorth = 0.5
        }
    }

    mapIntoRange(originalRange, newRange, value) {
        return ((value - originalRange[0])/(originalRange[1] - originalRange[0])) * (newRange[1] - newRange[0]) + newRange[0]
    }
  
    display() {
        noStroke();
        fill(this.setAlpha(this.foodColor, 100));
        ellipse(this.position.x, this.position.y, this.size);
        fill(this.foodColor);
        ellipse(this.position.x, this.position.y, int(this.size * 0.4));
    }

    rotFood() {
        this.type = FoodType.Rotten;
        this.energyWorth = this.mapIntoRange(this.foodSizeRange, [FoodType.Rotten.minEnergy, FoodType.Rotten.maxEnergy], this.size);
        this.foodColor = color(FoodType.Rotten.color);
    }

    poisonFood() {
        this.type = FoodType.Rotten;
        this.energyWorth = this.mapIntoRange(this.foodSizeRange, [FoodType.Poisoned.minEnergy, FoodType.Poisoned.maxEnergy], this.size);
        this.foodColor = color(FoodType.Poisoned.color);
    }

    update() {
        this.timeAlive += 1;
        if (this.type === FoodType.Plant && this.timeAlive === this.plantDuration) {
            this.rotFood();
        }
        
        if (this.timeAlive === this.lifeTime) {
            this.desintegrated = true;
        }
    }

    setAlpha(c, alpha) {
        return color(c.levels[0], c.levels[1], c.levels[2], alpha);
    }
}
  