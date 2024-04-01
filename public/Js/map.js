if (typeof L !== 'undefined') {
    var map = L.map('map').setView([51.505, -0.09], 13); // Initialize map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // Add tile layer
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
} else {
    console.error('Leaflet library not loaded.');
}