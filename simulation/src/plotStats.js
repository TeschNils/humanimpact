

var populationChartInstance;
var generationsChartInstance;


function plotPopulation(populationOverTime) {
    let y = populationOverTime;
    let x = [...Array(populationOverTime.length).keys()]

    if (populationChartInstance) {
        populationChartInstance.data.labels = x;
        populationChartInstance.data.datasets[0].data = y;
        populationChartInstance.update();
        return;
    }


    let chartData = {
        labels: x,
        datasets: [{
            label: "population",
            data: y,
            fill: true,
            backgroundColor: "rgb(199, 57, 69, 0.25)",
            borderColor: "rgb(199, 57, 69)"
        }]
    };
    
    let populationChart = document.getElementById("population-chart");
    let parentDiv = document.querySelector(".simulation-stats");
    populationChart.height = parentDiv.clientHeight;


    let chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: false
            },
            y: {
                display: true
            }
        },
        elements: {
            point:{
                radius: 0
            }
        },
        borderWidth: 2
    };
    
    let ctx = populationChart.getContext("2d");
    populationChartInstance = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions
    });
}

function plotGenerations(generationDistribution) {
    let y = generationDistribution;
    let x = [...Array(generationDistribution.length).keys()]

    if (generationsChartInstance) {
        generationsChartInstance.data.labels = x;
        generationsChartInstance.data.datasets[0].data = y;
        generationsChartInstance.update();
        return;
    }

    let chartData = {
        labels: x,
        datasets: [{
            label: "generations",
            data: y,
            backgroundColor: "rgb(80, 166, 246, 0.2)",
            borderColor: "rgb(80, 166, 246)"
        }],
        borderWidth: 1
    };
    
    let generationsChart = document.getElementById("generations-chart");
    let parentDiv = document.querySelector(".simulation-stats");
    generationsChart.height = parentDiv.clientHeight;

    let chartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        elements: {
            point:{
                radius: 0
            }
        },
        borderWidth: 2
    }
    
    let ctx = generationsChart.getContext("2d");
    generationsChartInstance = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: chartOptions
    });
}