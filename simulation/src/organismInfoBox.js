function showOrganismInfoBox(organism, i) {
    // Create the container box
    const box = document.createElement("div");
    box.className = "organism-box";

    const organismTitle = document.createElement("h3");
    organismTitle.className = "organism-title";
    organismTitle.innerText = `Organism #${i}`;
    box.appendChild(organismTitle);
    
    // Create the table for stats and genes
    const table = document.createElement("table");
    table.className = "info-table";

    // Create a function to add a row to the table
    const addRow = (label, value) => {
        const row = document.createElement("tr");

        const labelCell = document.createElement("td");
        labelCell.className = "info-label";
        labelCell.textContent = label;
        row.appendChild(labelCell);

        const valueCell = document.createElement("td");
        valueCell.className = "info-value";
        valueCell.textContent = value;
        row.appendChild(valueCell);

        table.appendChild(row);
    };

    // Add stats
    addRow("Age", organism.timeAlive);
    addRow("Energy", organism.energy);
    addRow("Generation", organism.generation);
    addRow("Amount of Children", organism.totalChildren);
    addRow("Energy Loss", organism.currentEnergyLoss);
    addRow("Contaminated", organism.oilCovered);

    // Add genes dynamically
    for (const [_, currentGene] of Object.entries(organism.genes)) {
        const row = document.createElement("tr");

        const labelCell = document.createElement("td");
        labelCell.className = "info-label";
        labelCell.textContent = currentGene.name;
        row.appendChild(labelCell);

        const sliderContainer = document.createElement("td");
        sliderContainer.className = "slider-container";

        const minLabel = document.createElement("span");
        minLabel.className = "gene-min";
        minLabel.textContent = currentGene.minGeneValue.toFixed(2);
        sliderContainer.appendChild(minLabel);

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = currentGene.minGeneValue;
        slider.max = currentGene.maxGeneValue;
        slider.step = "0.01";
        slider.value = currentGene.getGene();
        slider.disabled = true;
        slider.className = "gene-slider";
        sliderContainer.appendChild(slider);

        const maxLabel = document.createElement("span");
        maxLabel.className = "gene-max";
        maxLabel.textContent = currentGene.maxGeneValue.toFixed(2);
        sliderContainer.appendChild(maxLabel);

        const valueLabel = document.createElement("span");
        valueLabel.className = "gene-value";
        valueLabel.textContent = currentGene.getGene().toFixed(2);
        sliderContainer.appendChild(valueLabel);

        row.appendChild(sliderContainer);
        table.appendChild(row);
    }

    box.appendChild(table);

    // Append the box to the body or any specific container
    document.getElementById("simulation-container").appendChild(box);
}
