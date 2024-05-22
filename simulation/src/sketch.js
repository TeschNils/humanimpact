

let organisms = [];
let foods = [];
let numFood = 300;
let numOrganisms = 300;
let newFoodProbability = 0.1;

let populationHistory = [numOrganisms];
let generationDistribution;
let speed = 1;
let iteration = 0;

function setup() {
    canvas = createCanvas(0, 0);
    canvas.parent("simulation-container");
    resizeCanvasToParent();

    for (let i=0; i<numOrganisms; i++) {
        organisms.push(new Organism());
    }

    for (let i=0; i<numFood; i++) {
        foods.push(new Food(FoodType.Plant));
    }
}


function resizeCanvasToParent() {
    let containerWidth = document.getElementById("simulation-container").offsetWidth;
    let containerHeight = document.getElementById("simulation-container").offsetHeight;
    resizeCanvas(containerWidth, containerHeight);
}


function drawGrid(cellSize) {
    stroke(77, 157, 210, 100); // Set the grid line color
    strokeWeight(1); // Set the grid line weight
  
    // Draw vertical lines
    for (let x = 0; x <= width; x += cellSize) {
      line(x, 0, x, height);
    }
  
    // Draw horizontal lines
    for (let y = 0; y <= height; y += cellSize) {
      line(0, y, width, y);
    }
  }


function simulationStep() {
    background(10, 29, 34);

    if (organisms.length == 0) {
        textAlign(CENTER, CENTER);
        textSize(40);
        textStyle(BOLD);
        fill(255, 0, 0);
        noStroke();
        text(`Species #231 has gone extinct. Good job I guess...`, width / 2, height / 2);
        return;
    }

    if (random(0, 1) <= newFoodProbability) {
        foods.push(new Food(FoodType.Plant));
    }

    for (let i=0; i<foods.length; i++) {
        food = foods[i];
        if (food.desintegrated) {
            foods.splice(i, 1);
            continue;
        }
        food.update();
        food.display();
    }

    generationDistribution = [0];

    for (let i=0; i<organisms.length; i++) {
        let organism = organisms[i];
        organism.observe(foods);
        
        organism.mate(organisms);

        organism.move(i);
        organism.update();
        organism.display();

        // Count generation distribution
        if (organism.generation + 1 > generationDistribution.length) {
            generationDistribution.push(0);
        }
        generationDistribution[organism.generation] += 1;
        
        if (organism.energy <= 0) {
            //meat = new Food(FoodType.Meat);
            //meat.position = organism.position.copy();
            //foods.push(meat);
            organisms.splice(i, 1);
        }
    }

    if (iteration % 100 == 0) {
        populationHistory.push(organisms.length);
        plotCharts();
    }

    iteration += 1;
}


function draw() {
    frameRate(45);
    for (let i=0; i<speed; i++) {
        simulationStep();
    }
    drawGrid(100);
}


function keyPressed(event) {
    if (key.toLowerCase() === "s") {
        if (speed === 10) {
            speed = 1;
        }
        else {
            speed = 10;
        }
    }
}


function plotCharts() {
    plotPopulation(populationHistory);
    plotGenerations(generationDistribution);
}


function saveSimulation() {
    // TODO
}


function loadSimulation() {
    // TODO
}


setInterval(() => {
    let timeDisplay = document.getElementsByClassName("time-display")[0];
    let dt = new Date();
    timeDisplay.textContent = new Date().toJSON().split(".")[0];
}, 1000);