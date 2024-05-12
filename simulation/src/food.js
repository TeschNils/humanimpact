

const FoodType = {
    Plant: 2.0,
    Rotten: -0.5,
    Poisoned: -0.5,
    Meat: 0.0
};


class Food {
    constructor(type) {
        this.timeAlive = 0;
        this.type = type; 
        this.size = 5;
        this.position = createVector(random(width), random(height));

        this.desintegrated = false;
    }
  
    display() {
        if (this.type === FoodType.Plant) {
            fill(200, 200, 200);
        } else if (this.type === FoodType.Rotten) {
            fill(171, 79, 18);
        } else if (this.type === FoodType.Poisoned) {
            fill(95, 191, 69);
        } else if (this.type === FoodType.Meat) {
            this.size = 3;
            fill(240, 105, 105);
        }

        noStroke();
        ellipse(this.position.x, this.position.y, int(this.size));
    }

    update() {
        this.timeAlive += 1;
        if (this.timeAlive === 5000) {
            this.type = FoodType.Rotten;
        }
        else if (this.timeAlive === 7000) {
            this.desintegrated = true;
        }
    }
}
  