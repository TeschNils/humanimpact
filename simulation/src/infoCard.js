
function createInfoCard(title, text) {
    var infoCard = document.createElement("div");
    infoCard.classList.add("info-card");

    var titleElement = document.createElement("h1");
    titleElement.classList.add("info-card-title");
    titleElement.textContent = title;

    var textElement = document.createElement("p");
    textElement.classList.add("info-card-text");
    textElement.textContent = text;

    infoCard.appendChild(titleElement);
    infoCard.appendChild(textElement);

    var parentElement = document.getElementsByClassName("info-card-list")[0];
    parentElement.appendChild(infoCard);
}

createInfoCard("Oil leakage pollutes ecosystem!", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.");
createInfoCard("Critical CO2 emissions detected.", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.");