// Fetch Weather Warnings
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

    items.forEach((item) => {
      const title = item.querySelector("title")?.textContent;
      const link = item.querySelector("link")?.textContent;
      const date = item.querySelector("pubDate")?.textContent;

      if (title && link && date) {
        warnings.push({ title, link, date });
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

// Fetch Fire Warnings

async function fetchFireWarnings() {
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
      const category = item.querySelector("category")?.textContent; // Get the category

      if (title && link && date && category) {
        warnings.push({ title, link, date, category });

        // Determine the warning level and icon based on the category
        let icon = "";
        if (category.includes("Emergency")) {
          icon = "icons/fire-emergency.png";
        } else if (category.includes("Watch and Act")) {
          icon = "icons/fire-watch-act.png";
        } else if (category.includes("Advice")) {
          icon = "icons/fire-advice.png";
        }

        console.log(`Fire Warning: ${title}, Category: ${category}, Icon: ${icon}`); // Debugging

        // Add to noticeboard if it's an emergency
        if (category.includes("Emergency")) {
          const noticeItem = document.createElement("li");
          noticeItem.innerHTML = `<img src="${icon}" class="icon"> ${title} (${new Date(date).toLocaleDateString()})`;
          noticeboardList.appendChild(noticeItem);
        }
      }
    });

    // Display warnings in the Fire Warnings widget
    const fireList = document.getElementById("fireList");
    fireList.innerHTML = "";

    warnings.forEach((warning) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = warning.link;
      a.target = "_blank";

      // Determine the warning level and icon based on the category
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
      fireList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching fire warnings:", error);
  }
}

// Fetch Flood Warnings
async function fetchFloodWarnings() {
  const url = "http://hazardwatch.gov.au/";
  const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(url);

  try {
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(data.contents, "text/html");

    // Extract flood warnings (update selector based on the page structure)
    const warnings = [];
    const noticeboardList = document.getElementById("noticeboardList");
    const warningElements = htmlDoc.querySelectorAll(".warning-item"); // Update this selector

    warningElements.forEach((element) => {
      const title = element.querySelector("h3")?.textContent.trim();
      const link = element.querySelector("a")?.href;
      const date = element.querySelector(".date")?.textContent.trim();

      if (title && link && date) {
        warnings.push({ title, link, date });

        // Determine the warning level and icon
        let icon = "";
        if (title.includes("Emergency")) {
          icon = "icons/flood-emergency.png";
        } else if (title.includes("Watch and Act")) {
          icon = "icons/flood-watch-act.png";
        } else if (title.includes("Advice")) {
          icon = "icons/flood-advice.png";
        }

        // Add to noticeboard if it's an emergency
        if (title.includes("Emergency")) {
          const noticeItem = document.createElement("li");
          noticeItem.innerHTML = `<img src="${icon}" class="icon"> ${title} (${date})`;
          noticeboardList.appendChild(noticeItem);
        }
      }
    });

    // Display warnings in the Flood Warnings widget
    const floodList = document.getElementById("floodList");
    floodList.innerHTML = "";

    warnings.forEach((warning) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = warning.link;
      a.target = "_blank";

      // Determine the warning level and icon
      let icon = "";
      if (warning.title.includes("Emergency")) {
        icon = "icons/flood-emergency.png";
      } else if (warning.title.includes("Watch and Act")) {
        icon = "icons/flood-watch-act.png";
      } else if (warning.title.includes("Advice")) {
        icon = "icons/flood-advice.png";
      }

      a.innerHTML = `<img src="${icon}" class="icon"> ${warning.title} (${warning.date})`;
      li.appendChild(a);
      floodList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching flood warnings:", error);
  }
}

// Fetch Train Line Statuses
async function fetchTrainStatus() {
  const apiKey = "YOUR_API_KEY"; // Replace with your API key
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

    // Sort lines by delay (worst delays first)
    data.lines.sort((a, b) => b.delay - a.delay);

    data.lines.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = `${line.name} - ${line.status} (${line.delay} min delay)`;

      // Highlight delays over 15 minutes
      if (line.delay > 15) {
        li.classList.add("highlight");
      }

      // Move delays over 30 minutes to the noticeboard
      if (line.delay > 30) {
        const noticeItem = document.createElement("li");
        noticeItem.textContent = `${line.name} - ${line.status} (${line.delay} min delay)`;
        noticeboardList.appendChild(noticeItem);
      }

      trainList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching train statuses:", error);
  }
}

// Fetch all data
fetchWeatherWarnings();
fetchFireWarnings();
fetchFloodWarnings();
fetchTrainStatus();
