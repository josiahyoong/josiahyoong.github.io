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
// Define a bounding box with a 0.3km radius around user's location
const radius = 0.3; // in kilometers
const bounds = L.latLngBounds([
    [latitude - (radius / 110.574), longitude - (radius / (111.320 * Math.cos(latitude * Math.PI / 180)))],
    [latitude + (radius / 110.574), longitude + (radius / (111.320 * Math.cos(latitude * Math.PI / 180)))]
]);

// Set the view to the bounding box with the desired zoom level
map.fitBounds(bounds);

// Show map with markers for taxi location
L.marker([latitude, longitude]).addTo(map)
  .bindPopup('My Location')
  .openPopup();
}
    
//     // Show map with markers for taxi location
//     L.marker([latitude, longitude]).addTo(map)
//       .bindPopup('My Location')
//       .openPopup();

//   }
  
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
//   setInterval(getTaxiData, 2000); 
  //while(actively listen to changes)

async function getRefresh(){
    const data = await getTaxiData();

    const taxiAvailabilities = data.features[0].geometry.coordinates;
    //console.log("🚀 ~ file: index.js:26 ~ window.document.addEventListener ~ taxiAvailabilities:", taxiAvailabilities)
    for( let c of taxiAvailabilities){
        let lat = c[1];
        let lng = c[0];
        L.marker([lat, lng]).addTo(markerClusterLayer)
    }
    markerClusterLayer.addTo(map)
}

setInterval(getRefresh, 10000);

window.document.addEventListener('DOMContentLoaded', async function(){

    //get taxi infomation
    // do a setInterval, setTimeout
      //store in callstack or some computer memory
    

    let buttonClick = document.getElementById('trigger');
    buttonClick.addEventListener('click', handleGetLocation)
})


//1. create a text box on front end and a enter input btn, remeber to set id for the textbox and btn
//2. pass the input value into the textbox and get the value 
// within the addEventListener using javascript
//3. use console.log to verify whether the value is passed into javascript
//4. once the value is extract, look for the openstreetmap api and how to use it
//5. do a axios post request call and get a lat and long value back in return.
//6. ask chatgtp about eventlistener, how to use addEventlistener