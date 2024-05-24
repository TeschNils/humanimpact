

class OilPollution {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.position = new p5.Vector(x + size / 2, y + size / 2);
        this.size = size;
        this.oilImage = loadImage("./assets/oil.svg");
    }

    display() {
        fill(255, 0, 0);
        image(this.oilImage, this.x, this.y, this.size, this.size);
    }
}