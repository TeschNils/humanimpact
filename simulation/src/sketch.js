
let organisms = [];
let foods = [];
let numFood = 100;
let numOrganisms = 100;

let newFoodProbability = 0.05;

let centerX = 250;
let centerY = 250;
let circleRadius = 100;

function setup() {
    createCanvas(1500, 750);
    for (let i=0; i<numOrganisms; i++) {
        organisms.push(new Organism());
    }

    for (let i=0; i<numFood; i++) {
        foods.push(new Food(FoodType.Plant));
    }
}

function draw() {
    background(253, 248, 241);

    if (organisms.length == 0) {
        textAlign(CENTER, CENTER);
        textSize(40);
        textStyle(BOLD);
        fill(255, 0, 0);
        noStroke();
        text("Simulation #29372 has gone extinct. Good job I guess...", width / 2, height / 2);
        return;
    }

    if (random(0, 1) <= newFoodProbability) {
        foods.push(new Food(FoodType.Plant));
    }

    for (let food of foods) {
        food.update();
        food.display();
    }

    for (let i=0; i<organisms.length; i++) {
        let organism = organisms[i];
        organism.observe(foods);
        
        organism.eat(foods);
        organism.mate(organisms);

        organism.move();
        organism.update();
        organism.display();
        
        if (organism.energy <= 0) {
            organisms.pop(i);
        }
    }

    drawShape();
}
