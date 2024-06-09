const PollutionType = {
  CO2: {
    type: "co2",
    prompt: "Alert for CO2 pollution",
    defaultTitle: "CO2 pollution alert",
    defaultText:
      "The CO2 pollution levels have drastically risen. The lack of fresh air and sunlight is slowly degrading plants in the area.",
  },
  Oil: {
    type: "oil",
    prompt: "Alert for Oil pollution",
    defaultTitle: "Oil pollution alert",
    defaultText:
      "Large parts of the ecosystem are polluted after an oil platform leak. There are reports of organisms which are covered in oil resulting in their death.",
  },
  Nuclear: {
    type: "nuclear",
    prompt: "Alert for Nuclear waste pollution",
    defaultTitle: "Nuclear waste pollution alert",
    defaultText:
      "The waste of a near by nuclear plant is contaminating the ecosystem, resulting in radiation poisoning and gene mutations in organisms.",
  },
};

async function createAlertCard(pollutionTypeObject) {
  var title;
  var text;
  try {
    const response = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF",
        messages: [
          {
            role: "system",
            content:
              "Your job is to generate alerts about catastrophes that happen in a flat 2D world (which you see as reality). It contains an ecosystem in which organisms are living and evolving. The following human-caused catastrophes can occur: Oil pollution, CO2 pollution, nuclear waste radiation. Your alert will contain only of a simple description of the disaster. Be creative with the causes of those pollution types, but do not reference real-world events or locations.\nExample:\nInstruction: 'Alert for oil leakage'\nResponse: 'Large parts of the ecosystem are polluted after an oil platform leak. There are reports of organisms which are covered in oil resulting in their death.'",
          },
          { role: "user", content: pollutionTypeObject.prompt },
        ],
        temperature: 0.4,
        max_tokens: 150,
        stream: false,
      }),
    });
    const data = await response.json();
    title = pollutionTypeObject.defaultTitle;
    text = data.choices[0]?.message?.content;
  } catch (error) {
    console.error("Error:", error);
    title = pollutionTypeObject.defaultTitle;
    text = pollutionTypeObject.defaultText;
  }

  var infoCard = document.createElement("div");
  infoCard.classList.add("info-card");
  var infoCardInner = document.createElement("div");
  infoCardInner.classList.add("info-card-inner");

  var bannerImage = document.createElement("img");
  bannerImage.classList.add("info-card-banner");
  bannerImage.src = "./assets/alert-header.svg";

  var titleElement = document.createElement("h1");
  titleElement.classList.add("info-card-title");
  titleElement.textContent = title;

  var textElement = document.createElement("p");
  textElement.classList.add("info-card-text");
  textElement.textContent = text;

  var previewElement = document.createElement("img");
  previewElement.classList.add("info-card-preview");
  previewElement.src = "./assets/" + pollutionTypeObject.type + "-preview.png";

  infoCard.appendChild(infoCardInner);
  infoCardInner.appendChild(bannerImage);
  infoCardInner.appendChild(titleElement);
  infoCardInner.appendChild(textElement);
  infoCardInner.appendChild(previewElement);

  var parentElement = document.getElementsByClassName("info-card-list")[0];
  if (parentElement.firstChild) {
    parentElement.insertBefore(infoCard, parentElement.firstChild);
  } else {
    parentElement.appendChild(infoCard);
  }
}

createAlertCard(PollutionType.Oil);
