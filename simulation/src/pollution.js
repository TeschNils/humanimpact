



class Pollution {
    constructor(x, y, size, type) {
        this.x = x;
        this.y = y;
        this.position = new p5.Vector(x, y);
        this.size = size;

        this.image = loadImage("./assets/co2.svg");

        this.reductionRate = 0.25;
        this.desintegrated = false;
    }

    update() {
        this.size -= this.reductionRate;
        if (this.size === 10) {
            this.desintegrated = true;
        }
    }

    display() {
        imageMode(CENTER)
        fill(255, 0, 0);
        image(this.image, this.x, this.y, this.size, this.size);
    }
}


class OilPollution extends Pollution {
    constructor(x, y, size) {
        super(x, y, size);
        this.image = loadImage("./assets/oil.svg");
    }
}

class CO2Pollution extends Pollution {
    constructor(x, y, size) {
        super(x, y, size);
        this.image = loadImage("./assets/co2.svg");
    }
}