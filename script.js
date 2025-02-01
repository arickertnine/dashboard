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
