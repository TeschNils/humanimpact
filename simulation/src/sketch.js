let organisms = [];
let foods = [];
let numFood = 100;
let numOrganisms = 700;
let newFoodProbability = 0.1;

let populationHistory = [numOrganisms];
let generationDistribution;
let speed = 1;
let iteration = 0;

const simResX = 500;
const simResY = 500;
let transformFactorX = 1;
let transformFactorY = 1;
let transformOffsetX = 0;
let transformOffsetY = 0;
let transformFactorXBase; 
let transformFactorYBase;

function setup() {
    canvas = createCanvas(0, 0, P2D);
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
    transformFactorX = width / simResX;
    transformFactorY = height / simResY;
    transformFactorXBase = transformFactorX;
    transformFactorYBase = transformFactorY;
}


function simulationStep() {
    background(255, 253, 235);

    rect(0+transformOffsetX, 0+transformOffsetY, simResX*transformFactorX, simResY*transformFactorY);

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
    //frameRate(60);

    for (let i=0; i<speed; i++) {
        simulationStep();
    }
    //filter(INVERT);
    let fps = frameRate();
    text(fps, 50, 50);
    if (keyIsPressed) {

        if (key.toLowerCase() === "+") {
            transformFactorX += 1/simResX * 10;
            transformFactorY += 1/simResY * 10;
            console.log("TransformOffsetX: "+abs(transformOffsetX));
            console.log("Width: "+width/2);
            console.log("TransformOffsetY: "+abs(transformOffsetY));
            console.log("Height: "+height/2);
            if (abs(transformOffsetX) <= (width/2)) {
                transformOffsetX -= (5)*(-(transformOffsetX-width/2)/(width/2));
            }
            else {
                transformOffsetX -= 10;
            }
            if (abs(transformOffsetY) <= (height/2)) {
                transformOffsetY -= (5)*(-(transformOffsetY-height/2)/(height/2));
            }
            else {
                transformOffsetY -= 10;
            }
        }
        if (key.toLowerCase() === "-") {
            transformFactorX -= 1/simResX * 10;
            transformFactorY -= 1/simResY * 10;
            if (abs(transformOffsetX) <= (width/2)) {
                transformOffsetX += (5) * (-(transformOffsetX-width / 2) / (width / 2));
            }
            else {
                transformOffsetX += 10;
            }
            if (abs(transformOffsetY) <= (height/2)) {
                transformOffsetY += (5) * (-(transformOffsetY - height / 2)/(height / 2));
            }
            else {
                transformOffsetY += 10;
            }

        }
        if (key.toLowerCase() === "w" && transformOffsetY < ((height/2))) {
            transformOffsetY += 5;
            console.log(transformFactorY-transformFactorYBase);
            console.log();
            console.log(transformOffsetY);
        }
        if (key.toLowerCase() === "s" && transformOffsetY > -((height/2)+(simResY*(transformFactorY-transformFactorYBase)))) {
            transformOffsetY -= 5;
            console.log(transformOffsetY);
        }
        if (key.toLowerCase() === "a" && transformOffsetX < (width/2)) {
            transformOffsetX += 5;
            console.log(transformOffsetX);
        }
        if (key.toLowerCase() === "d" && transformOffsetX > -((width/2)+(simResX*(transformFactorX-transformFactorXBase)))) {
            transformOffsetX -= 5;
            console.log(transformOffsetX);
        }
        
    }
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

addEventListener("resize", () => {
    width = 0;
    height = 0;
    console.log(document.getElementById("simulation-container").offsetWidth);
    console.log(document.getElementById("simulation-container").offsetHeight);
    resizeCanvasToParent();
    plotCharts();
});


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


//setInterval(() => {
//    let timeDisplay = document.getElementsByClassName("time-display")[0];
//    let dt = new Date();
//    timeDisplay.textContent = new Date().toJSON().split(".")[0];
//}, 1000);