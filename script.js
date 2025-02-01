async function fetchWeatherWarnings() {
  const rssUrl = "http://www.bom.gov.au/fwo/IDZ00054.warnings_nsw.xml";
  const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(rssUrl);

  try {
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");

    const items = xmlDoc.querySelectorAll("item");
    const warnings = [];
    const noticeboardList = document.getElementById("noticeboardList");

    items.forEach((item) => {
      const title = item.querySelector("title")?.textContent;
      const link = item.querySelector("link")?.textContent;
      const date = item.querySelector("pubDate")?.textContent;

      if (title && link && date) {
        warnings.push({ title, link, date });

        // Add to noticeboard if it's a detailed severe weather alert
        if (title.includes("Detailed")) {
          const noticeItem = document.createElement("li");
          noticeItem.innerHTML = `⚠️ ${title} (${new Date(date).toLocaleDateString()})`;
          noticeboardList.appendChild(noticeItem);
        }
      }
    });

    // Display warnings in the Weather Warnings widget
    const weatherList = document.getElementById("weatherList");
    weatherList.innerHTML = "";

    warnings.forEach((warning) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = warning.link;
      a.textContent = `${warning.title} (${new Date(warning.date).toLocaleDateString()})`;
      a.target = "_blank";
      li.appendChild(a);
      weatherList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching weather warnings:", error);
  }
}

async function fetchEmergencyWarnings() {
  const rssUrl = "https://www.rfs.nsw.gov.au/feeds/majorIncidents.xml";
  const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(rssUrl);

  try {
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");

    const items = xmlDoc.querySelectorAll("item");
    const warnings = [];
    const noticeboardList = document.getElementById("noticeboardList");

    items.forEach((item) => {
      const title = item.querySelector("title")?.textContent;
      const link = item.querySelector("link")?.textContent;
      const date = item.querySelector("pubDate")?.textContent;
      const category = item.querySelector("category")?.textContent;

      if (title && link && date && category) {
        warnings.push({ title, link, date, category });

        // Determine the warning level and icon
        let icon = "";
        if (category.includes("Emergency")) {
          icon = "icons/fire-emergency.png";
        } else if (category.includes("Watch and Act")) {
          icon = "icons/fire-watch-act.png";
        } else if (category.includes("Advice")) {
          icon = "icons/fire-advice.png";
        }

        // Add to noticeboard if it's an emergency or watch and act
        if (category.includes("Emergency") || category.includes("Watch and Act")) {
          const noticeItem = document.createElement("li");
          noticeItem.innerHTML = `<img src="${icon}" class="icon"> ${title} (${new Date(date).toLocaleDateString()})`;
          noticeboardList.appendChild(noticeItem);
        }
      }
    });

    // Display warnings in the Emergency Warnings widget
    const emergencyList = document.getElementById("emergencyList");
    emergencyList.innerHTML = "";

    warnings.forEach((warning) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = warning.link;
      a.target = "_blank";

      // Determine the warning level and icon
      let icon = "";
      if (warning.category.includes("Emergency")) {
        icon = "icons/fire-emergency.png";
      } else if (warning.category.includes("Watch and Act")) {
        icon = "icons/fire-watch-act.png";
      } else if (warning.category.includes("Advice")) {
        icon = "icons/fire-advice.png";
      }

      a.innerHTML = `<img src="${icon}" class="icon"> ${warning.title} (${new Date(warning.date).toLocaleDateString()})`;
      li.appendChild(a);
      emergencyList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching emergency warnings:", error);
  }
}

async function fetchTrainStatus() {
  const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJzYkNPZjBKUW9pT1BEVzBBbm1hSUxrMXh0N3NEaU8xNkcxS1JoY2FUeENvIiwiaWF0IjoxNzM4Mzg4NDU2fQ.XXx_b43r15u-mjOfRbB_B9SWm06psfvkF9qR1bREVUA"; // Replace with your API key
  const apiUrl = "https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/trains"; // Update if needed

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `apikey ${apiKey}`,
      },
    });
    const data = await response.json();

    // Process train statuses
    const trainList = document.getElementById("trainList");
    const noticeboardList = document.getElementById("noticeboardList");
    trainList.innerHTML = "";
    noticeboardList.innerHTML = "";

    data.lines.forEach((line) => {
      const li = document.createElement("li");
      const icon = `icons/train-${line.name.toLowerCase()}.png`; // Use train line logos
      li.innerHTML = `<img src="${icon}" class="icon"> ${line.name} - ${line.status}`;

      // Add to noticeboard if delay > 30 minutes or contains "police" or "fire"
      if (line.delay > 30 || line.status.toLowerCase().includes("police") || line.status.toLowerCase().includes("fire")) {
        const noticeItem = document.createElement("li");
        noticeItem.innerHTML = `<img src="${icon}" class="icon"> ${line.name} - ${line.status}`;
        noticeboardList.appendChild(noticeItem);
      }

      trainList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching train statuses:", error);
  }
}

fetchWeatherWarnings();
fetchEmergencyWarnings();
fetchTrainStatus();
