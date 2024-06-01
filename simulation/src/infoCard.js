const PollutionType = {
    CO2: "Alert for CO2 pollution",
    Oil: "Alert for Oil pollution",
    Nuclear: "Alert for Nuclear waste pollution"
};

async function createAlertCard(pollutionType) {
    var title;
    var text;
    try {
        const response = await fetch("http://localhost:1234/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "bartowski/Llama-3-8B-Instruct-Gradient-1048k-GGUF",
                "messages": [
                    { "role": "system", "content": "Your job is to generate alerts about catastrophes that happen in a flat 2D world (which you see as reality). It contains an ecosystem in which organisms are living and evolving. The following human-caused catastrophes can occur: Oil pollution, CO2 pollution, nuclear waste radiation. Your alert will contain a title and a description, separated by a '@'-character. Be creative with the causes of those pollution types, but do not reference real-world events or locations. DO NOT FORGET THE FORMAT TITLE@DESCRIPTION. GENERATE ONLY TITLE AND DESCRIPTION WITH NO SPECIAL CHARACTERS EXCEPT THE @, EXCLAMATION MARK AND FULL STOP!\nExample:\n### Instruction: Alert for oil leakage\n### Response: Oil platform leakage!@Large parts of the ecosystem are polluted after an oil platform leak. There are reports of organisms which are covered in oil resulting in their death." },
                    { "role": "user", "content": pollutionType }
                ], 
                "temperature": 0.5,
                "max_tokens": 150,
                "stream": false,
            })
        });
        const data = await response.json();
        const msg = data.choices[0]?.message?.content;
        if(msg.includes("@")) {
            var splitResponse = msg.split("@");
            title = splitResponse[0];
            text = splitResponse[1];
        } else {
            title = pollutionType.replace("Alert for ", "");
            text = msg;
        }
    } catch (error) {
        console.error("Error:", error);
        title = "Alert for " + pollutionType;
        text = "An alert for " + pollutionType + " has been generated.";
    }

    var infoCard = document.createElement("div");
    infoCard.classList.add("info-card");

    var titleElement = document.createElement("h1");
    titleElement.classList.add("info-card-title");
    titleElement.textContent = title;

    titleElement.classList.add("title-critical");

    var textElement = document.createElement("p");
    textElement.classList.add("info-card-text");
    textElement.textContent = text;

    infoCard.appendChild(titleElement);
    infoCard.appendChild(textElement);

    var parentElement = document.getElementsByClassName("info-card-list")[0];
    parentElement.appendChild(infoCard);
}

createAlertCard(PollutionType.CO2);
createAlertCard(PollutionType.Oil);
createAlertCard(PollutionType.Nuclear);