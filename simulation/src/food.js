

const FoodType = {
    Plant: 20,
    Rotten: -5,
    Poisoned: -20
};


class Food {
    constructor(type) {
        this.timeAlive = 0;
        this.type = type; 
        this.size = 4;
        this.position = createVector(random(width), random(height));
    }
  
    display() {
        if (this.type === FoodType.Plant) {
            fill(200, 200, 200);
        } else if (this.type === FoodType.Rotten) {
            fill(171, 79, 18);
        } else if (this.type ===  FoodType.Poisoned) {
            fill(95, 191, 69);
        }

        noStroke();
        ellipse(this.position.x, this.position.y, this.size);
    }

    update() {
        this.timeAlive += 1;
        if (this.timeAlive == 1000) {
            this.type = FoodType.Rotten;
        }
    }
}
  