

let organisms = [];
let foods = [];
let numFood = 300;
let numOrganisms = 500;
let newFoodProbability = 0.05;

let populationHistory = [numOrganisms];
let generationDistribution;
let speed = 1;
let iteration = 0;

let oilPollution;
let oilRadius = 450;
let oilPosition;

let co2Pollution;
let co2Radius = 750;
let co2Position;

let showOrganismInfo = false;
let organismInfoIndex = 0;


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
    stroke(77, 157, 210, 50);
    strokeWeight(1);
  
    for (let x = 0; x <= width; x += cellSize) {
      line(x, 0, x, height);
    }
  
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

    if (oilPollution) {
        oilPollution.update();
        oilPollution.display();
        if (oilPollution.desintegrated) {
            oilPollution = null;
        }
    }

    if (co2Pollution) {
        co2Pollution.update();
        co2Pollution.display();
        if (co2Pollution.desintegrated) {
            co2Pollution = null;
        }
    }

    for (let i=0; i<foods.length; i++) {
        let food = foods[i];

        if (oilPollution && food.type !== FoodType.Poisoned) {
            if (food.position.dist(oilPollution.position) < oilPollution.size / 2) {
                foods.splice(i, 1);
                continue;
            }
        }

        if (co2Pollution && food.type !== FoodType.Poisoned) {
            if (food.position.dist(co2Pollution.position) < co2Pollution.size / 2 && random(0, 1) < 0.001) {
                food.poisonFood();
            }
        }

        if (food.desintegrated) {
            foods.splice(i, 1);
            continue;
        }
        food.update();
        food.display();
    }

    generationDistribution = [];

    for (let i=0; i<organisms.length; i++) {
        let organism = organisms[i];
        organism.observe(foods);
        
        organism.mate(organisms);

        organism.move(i);
        organism.update();
        organism.display(i);

        // Handle organism in oil polluted area
        if (oilPollution) {
            if (organism.position.dist(oilPollution.position) < oilPollution.size / 2) {
                organism.oilCovered = true;
                organism.insideOil = true;
            }
            else {
                organism.insideOil = false;
            }
        }

        while (organism.generation >= generationDistribution.length) {
            generationDistribution.push(0);
        }

        // Increment generation count
        generationDistribution[organism.generation] += 1;
        
        if (organism.energy <= 0) {
            let meat = new Food(FoodType.Meat);
            meat.position = organism.position.copy();
            foods.push(meat);
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
    //frameRate(45);
    for (let i=0; i<speed; i++) {
        simulationStep();
    }
    drawGrid(150);
}


function mouseClicked() {
    let mousePosition = createVector(mouseX, mouseY);

    for (let i=0; i<organisms.length; i++) {
        if (mousePosition.dist(organisms[i].position) <= organisms[i].displaySize / 2) {
            showOrganismInfo = true;
            organismInfoIndex = i;
            
            showOrganismInfoBox(organisms[i], i);
            return;
        }
    }
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
    else if (key.toLowerCase() === "1") {
        oilPollution = new OilPollution(
            random(width - oilRadius / 2),
            random(height - oilRadius / 2),
            oilRadius
        );
    }
    else if (key.toLowerCase() === "2") {
        co2Pollution = new CO2Pollution(
            random(width - co2Radius / 2),
            random(height - co2Radius / 2),
            co2Radius
        );
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
    timeDisplay.textContent = new Date().toJSON().split(".")[0];
}, 1000);