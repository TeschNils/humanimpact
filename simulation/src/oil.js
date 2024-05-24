

class OilPollution {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.oilImage = loadImage("./assets/oil.svg");
    }

    display() {
        image(this.oilImage, this.x, this.y, this.radius, this.radius);
    }
}