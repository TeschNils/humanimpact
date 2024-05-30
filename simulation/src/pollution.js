class Pollution {
    constructor() {
        this.minSize = 200;
        this.maxSize = 400;
        this.minAmount = 1;
        this.maxAmount = 3;
        this.timeToLive = 1000;

        this.amount;
        this.positions = [];
        this.sizes = [];
        this.reductionRates = [];

        this.imagePath;

        this.reduceOverTime = true;
    }

    initialize() {
        this.amount = int(random(this.minAmount, this.maxAmount + 1));

        for (let i = 0; i < this.amount; i++) {
            let x = random(
                -(controls.view.x) / controls.view.zoom / transformFactor,
                -(controls.view.x - width) / controls.view.zoom / transformFactor,
            );
            let y = random(
                -(controls.view.y) / controls.view.zoom / transformFactor,
                -(controls.view.y - height) / controls.view.zoom / transformFactor,
            );

            this.positions.push(new p5.Vector(x, y));
            this.sizes.push(random(this.minSize, this.maxSize));
            this.reductionRates.push(this.sizes[i] / this.timeToLive);
        }

        this.image = loadImage(this.imagePath);
        this.desintegrated = false;
    }

    checkCollision(position) {
        for (let i = 0; i < this.amount; i++) {
            if (position.dist(this.positions[i]) < this.sizes[i] / 2) {
                return true;
            }
        }
        return false;
    }

    update() {
        if (this.reduceOverTime) {
            for (let i = 0; i < this.amount; i++) {
                this.sizes[i] -= this.reductionRates[i];
            }
        }

        this.timeToLive -= 1;
        if (this.timeToLive === 0) {
            this.desintegrated = true;
        }
    }

    display() {
        imageMode(CENTER);
        fill(255, 0, 0);
        for (let i = 0; i < this.amount; i++) {
            image(this.image, this.positions[i].x, this.positions[i].y, this.sizes[i], this.sizes[i]);
        }
    }
}

class OilPollution extends Pollution {
    constructor() {
        super();
        this.minSize = 200;
        this.maxSize = 400;
        this.maxAmount = 3;
        this.imagePath = "./assets/oil.svg";

        this.initialize();
    }
}

class CO2Pollution extends Pollution {
    constructor() {
        super();
        this.minSize = 500;
        this.maxSize = 800;
        this.maxAmount = 3;
        this.imagePath = "./assets/co2.svg";

        this.initialize();
    }
}

class NuclearWastePollution extends Pollution {
    constructor() {
        super();
        this.minSize = 100;
        this.maxSize = 200;
        this.minAmount = 3;
        this.maxAmount = 3;
        this.reduceOverTime = false;
        this.imagePath = "./assets/nuclear-waste.svg";

        this.initialize();
    }
}
