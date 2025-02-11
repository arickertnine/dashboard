document.addEventListener("DOMContentLoaded", function() {
    fetchSESWarnings();
    fetchBOMWarnings();
    fetchRFSUpdates();
});

function fetchSESWarnings() {
    fetch("https://www.hazardwatch.gov.au/app-api/alerts")
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById("ses-list");
            list.innerHTML = data.map(alert => `<li>${alert.title}</li>`).join("");
        })
        .catch(error => console.error("Error fetching SES Warnings:", error));
}

function fetchBOMWarnings() {
    fetch("http://www.bom.gov.au/fwo/IDZ00061.warnings_land_nsw.xml")
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const items = data.getElementsByTagName("warning");
            const list = document.getElementById("bom-list");
            list.innerHTML = Array.from(items).map(item => `<li>${item.textContent}</li>`).join("");
        })
        .catch(error => console.error("Error fetching BOM Warnings:", error));
}

function fetchRFSUpdates() {
    fetch("https://www.rfs.nsw.gov.au/feeds/major-Fire-Updates.xml")
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const items = data.getElementsByTagName("item");
            const list = document.getElementById("rfs-list");
            list.innerHTML = Array.from(items).map(item => `<li>${item.getElementsByTagName("title")[0].textContent}</li>`).join("");
        })
        .catch(error => console.error("Error fetching RFS Updates:", error));
}
