let organisms = [];
let foods = [];
let numFood = 100;
let numOrganisms = 700;
let newFoodProbability = 0.1;

let populationHistory = [numOrganisms];
let generationDistribution;
let speed = 1;
let iteration = 0;

const simResX = 650;
const simResY = 400;

let transformFactor = 0;


function setup() {
    canvas = createCanvas(0, 0, P2D);
    canvas.parent("simulation-container");
    resizeCanvasToParent();

    canvas.mouseWheel(e =>
        Controls.zoom(controls).worldZoom(e))

    for (let i = 0; i < numOrganisms; i++) {
        organisms.push(new Organism());
    }

    for (let i = 0; i < numFood; i++) {
        foods.push(new Food(FoodType.Plant));
    }
}


function resizeCanvasToParent() {
    let containerWidth = document.getElementById("simulation-container").offsetWidth;
    let containerHeight = document.getElementById("simulation-container").offsetHeight;
    resizeCanvas(containerWidth, containerHeight);

}


function simulationStep() {
    background(255, 253, 235);

    rect(0, 0, simResX, simResY);

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

    for (let i = 0; i < foods.length; i++) {
        food = foods[i];
        if (food.desintegrated) {
            foods.splice(i, 1);
            continue;
        }
        food.update();
        food.display();
    }

    generationDistribution = [0];

    for (let i = 0; i < organisms.length; i++) {
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

function initialScaling() {
    simResRelation = simResX / simResY;
    widthHeightRelation = width / height;
    let transformOffsetXN;
    let transformOffsetYN;

    if (simResRelation > widthHeightRelation) {
        transformFactor = height / simResY;
        transformOffsetXN = 0;
        transformOffsetYN = (height / 2 - (simResY * transformFactor) / 2);
    } else {
        transformFactor = width / simResX;
        transformOffsetYN = 0;
        transformOffsetXN = (width / 2 - (simResX * transformFactor) / 2);
    }

    scale(transformFactor);
    translate(transformOffsetXN, transformOffsetYN);
}


function draw() {
    translate(controls.view.x, controls.view.y);
    scale(controls.view.zoom)

    frameRate(60);

    initialScaling();

    for (let i = 0; i < speed; i++) {
        simulationStep();
    }
    //filter(INVERT);
    let fps = frameRate();
    text(fps, 50, 50);

}


function keyPressed(event) {
    if (key.toLowerCase() === "e") {
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