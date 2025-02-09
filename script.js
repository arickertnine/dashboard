document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherWarnings();
    fetchRFSUpdates();
    fetchSESWarnings();
});

async function fetchWeatherWarnings() {
    const response = await fetch('http://www.bom.gov.au/fwo/IDZ00061.warnings_land_nsw.xml');
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const items = xmlDoc.getElementsByTagName('item');
    let noticeContent = '';
    let weatherContent = '';

    for (let item of items) {
        const title = item.getElementsByTagName('title')[0].textContent;
        const description = item.getElementsByTagName('description')[0].textContent;
        if (title.includes('detailed')) {
            noticeContent += `<div><strong>${title}</strong><p>${description}</p></div>`;
        } else {
            weatherContent += `<div><strong>${title}</strong><p>${description}</p></div>`;
        }
    }

    document.getElementById('notice-content').innerHTML = noticeContent;
    document.getElementById('weather-content').innerHTML = weatherContent;
}

async function fetchRFSUpdates() {
    const response = await fetch('https://www.rfs.nsw.gov.au/feeds/major-Fire-Updates.xml');
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const items = xmlDoc.getElementsByTagName('item');
    let noticeContent = '';
    let rfsContent = '';

    for (let item of items) {
        const title = item.getElementsByTagName('title')[0].textContent;
        const description = item.getElementsByTagName('description')[0].textContent;
        if (title !== 'No Major Fires') {
            noticeContent += `<div><strong>${title}</strong><p>${description}</p></div>`;
        } else {
            rfsContent += `<div><strong>${title}</strong><p>${description}</p></div>`;
        }
    }

    document.getElementById('notice-content').innerHTML += noticeContent;
    document.getElementById('rfs-content').innerHTML = rfsContent;
}

async function fetchSESWarnings() {
    const metadataUrl = 'https://data.nsw.gov.au/data/api/3/action/package_show?id=6552b1a5-9164-4f3f-a9ed-b06e1e01d984';
    const metadataResponse = await fetch(metadataUrl);
    const metadata = await metadataResponse.json();

    // Extract the resource ID from the metadata
    const resourceId = metadata.result.resources[0].id;

    // Fetch the actual SES warnings data using the resource ID
    const dataUrl = `https://data.nsw.gov.au/data/api/3/action/datastore_search?resource_id=${resourceId}`;
    const dataResponse = await fetch(dataUrl);
    const data = await dataResponse.json();
    const records = data.result.records;

    let noticeContent = '';
    let sesContent = '';

    records.forEach(record => {
        const title = record.title || 'No Title';
        const description = record.description || 'No Description';
        const categoryLevel = record.category_level || '';

        // Check if the category level is "Watch and Act" or "Emergency Warning"
        if (categoryLevel.includes('Watch and Act') || categoryLevel.includes('Emergency Warning')) {
            noticeContent += `<div><strong>${title}</strong><p>${description}</p></div>`;
        } else {
            sesContent += `<div><strong>${title}</strong><p>${description}</p></div>`;
        }
    });

    // Update the notice board and SES content sections
    document.getElementById('notice-content').innerHTML += noticeContent;
    document.getElementById('ses-content').innerHTML = sesContent;
}
