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
let co2Pollution;
let nuclearWastePollution;

let simResX = 1000;
let simResY = 1000;
const fillCanvas = true;

let transformFactor = 0;
let showOrganismInfo = false;
let organismInfoIndex = 0;


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

    if (fillCanvas) {
        simResX = containerWidth;
        simResY = containerHeight;
    }

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

    if (nuclearWastePollution) {
        nuclearWastePollution.update();
        nuclearWastePollution.display();
        if (nuclearWastePollution.desintegrated) {
            nuclearWastePollution = null;
        }
    }

    for (let i=0; i<foods.length; i++) {
        let food = foods[i];

        if (oilPollution && food.type !== FoodType.Poisoned) {
            if (oilPollution.checkCollision(food.position)) {
                foods.splice(i, 1);
                continue;
            }
        }

        if (nuclearWastePollution && food.type !== FoodType.Poisoned) {
            if (nuclearWastePollution.checkCollision(food.position)) {
                food.poisonFood();
            }
        }

        if (co2Pollution && food.type !== FoodType.Poisoned) {
            if (co2Pollution.checkCollision(food.position) && random(0, 1) < 0.001) {
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

    for (let i = 0; i < organisms.length; i++) {
        let organism = organisms[i];
        organism.observe(foods);

        organism.mate(organisms);

        organism.move(i);
        organism.update();
        organism.display(i);

        // Handle organism in oil polluted area
        if (oilPollution) {
            if (oilPollution.checkCollision(organism.position)) {
                organism.oilCovered = true;
                organism.insideOil = true;
            }
            else {
                organism.insideOil = false;
            }
        }

        if (nuclearWastePollution && !organism.isRadiated) {
            if (nuclearWastePollution.checkCollision(organism.position)) {
                organism.isRadiated = true;
                organism.mutateThroughRadiation();
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

function scaleToScope() {
    simResRelation = simResX / simResY;
    widthHeightRelation = width / height;
    let transformOffsetXN;
    let transformOffsetYN;

    if (simResRelation > widthHeightRelation) {
        transformFactor = height / simResY;
        transformOffsetXN = 0;
        transformOffsetYN = (height / 2 - (simResY * transformFactor) / 2);
    }
    else {
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

    scaleToScope();

    for (let i = 0; i < speed; i++) {
        simulationStep();
    }
    //drawGrid(150);
}


function mouseClicked(mousePosition) {
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
    if (key.toLowerCase() === "e") {
        if (speed === 10) {
            speed = 1;
        }
        else {
            speed = 10;
        }
    }
    else if (key.toLowerCase() === "1") {
        oilPollution = new OilPollution();
    }
    else if (key.toLowerCase() === "2") {
        co2Pollution = new CO2Pollution();
    }
    else if (key.toLowerCase() === "3") {
        nuclearWastePollution = new NuclearWastePollution();
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