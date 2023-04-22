// Initialize the leaflet map to `<div id="map"></div>`
var map = L.map('map').setView([1.3615208221204578, 103.8160867611435], 12);

// Add Openstreet option
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//create marker cluster group
let markerClusterLayer = L.markerClusterGroup();


async function getTaxiData(){
    try {
        const response = await fetch("https://api.data.gov.sg/v1/transport/taxi-availability");
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// Get user's current location and update map
function onGetLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    
    // Show map with markers for taxi location
    L.marker([latitude, longitude]).addTo(map)
      .bindPopup('My Location')
      .openPopup();

  }
  
  // Handle "Get my location" button click
  function handleGetLocation() {
    if (navigator.geolocation) {
      
        navigator.geolocation.getCurrentPosition(onGetLocation, error => {
            console.error(`Error getting user location: ${error.message}`);
        });
    } else {
        console.error('Geolocation is not supported by this browser');
    }
  }

window.document.addEventListener('DOMContentLoaded', async function(){

    //get taxi infomation
    const data = await getTaxiData();

    const taxiAvailabilities = data.features[0].geometry.coordinates;
    //console.log("🚀 ~ file: index.js:26 ~ window.document.addEventListener ~ taxiAvailabilities:", taxiAvailabilities)
    for( let c of taxiAvailabilities){
        let lat = c[1];
        let lng = c[0];
        L.marker([lat, lng]).addTo(markerClusterLayer)
    }
    markerClusterLayer.addTo(map)

    let buttonClick = document.getElementById('trigger');
    buttonClick.addEventListener('click', handleGetLocation)
})