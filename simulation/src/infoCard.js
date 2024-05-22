
function createInfoCard(title, text, severity) {
    var infoCard = document.createElement("div");
    infoCard.classList.add("info-card");

    var titleElement = document.createElement("h1");
    titleElement.classList.add("info-card-title");
    titleElement.textContent = title;

    if (severity === "warning") {
        titleElement.classList.add("title-warning");
    }
    else if (severity === "critical") {
        titleElement.classList.add("title-critical");
    }

    var textElement = document.createElement("p");
    textElement.classList.add("info-card-text");
    textElement.textContent = text;

    

    infoCard.appendChild(titleElement);
    infoCard.appendChild(textElement);

    var parentElement = document.getElementsByClassName("info-card-list")[0];
    parentElement.appendChild(infoCard);
}

createInfoCard("OIL LEAKAGE", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.", "critical");
createInfoCard("CRITICAL CO2 EMISSIONS", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.", "warning");