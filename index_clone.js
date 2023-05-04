// Initialize the leaflet map to `<div id="map"></div>`
var map = L.map("map").setView([1.3615208221204578, 103.8160867611435], 12);

// Add Openstreet option
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

//create marker cluster group
let markerClusterLayer = L.markerClusterGroup();

async function getTaxiData() {
  try {
    const response = await axios.get(
      "https://api.data.gov.sg/v1/transport/taxi-availability"
    );
    // const response = await fetch("https://api.data.gov.sg/v1/transport/taxi-availability");

    if (!response.data) {
      throw new Error("Failed to fetch data");
    }
    // const data = await response.json();
    // return data;
    return response.data;
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
    [
      latitude - radius / 110.574,
      longitude - radius / (111.32 * Math.cos((latitude * Math.PI) / 180)),
    ],
    [
      latitude + radius / 110.574,
      longitude + radius / (111.32 * Math.cos((latitude * Math.PI) / 180)),
    ],
  ]);

  // Set the view to the bounding box with the desired zoom level
  map.fitBounds(bounds);

  // Show map with markers for taxi location
  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("My Location")
    .openPopup();
}

// Handle "Get my location" button click
function handleGetLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onGetLocation, (error) => {
      console.error(`Error getting user location: ${error.message}`);
    });
  } else {
    console.error("Geolocation is not supported by this browser");
  }
}
//   setInterval(getTaxiData, 2000);
//while(actively listen to changes)

async function getRefresh() {
  const data = await getTaxiData();

  const taxiAvailabilities = data.features[0].geometry.coordinates;
  //console.log("🚀 ~ file: index.js:26 ~ window.document.addEventListener ~ taxiAvailabilities:", taxiAvailabilities)
  for (let c of taxiAvailabilities) {
    let lat = c[1];
    let lng = c[0];
    L.marker([lat, lng]).addTo(markerClusterLayer);
  }
  markerClusterLayer.addTo(map);
}

setInterval(getRefresh, 10000);

window.document.addEventListener("DOMContentLoaded", async function () {
  //get taxi infomation
  // do a setInterval, setTimeout
  //store in callstack or some computer memory
  let btnGo = document.getElementById("submit-button");
  btnGo.addEventListener("click", function () {
    //retrieve the postal code from the textbox
    // get the value of the texbox
    const input = document.getElementById("text-input").value;
    console.log("Input value:", input);
    getPostalCode(input);
  });

  let buttonClick = document.getElementById("btn1");
  buttonClick.addEventListener("click", handleGetLocation);

  //for the form input and control
  let submitbtn = document.querySelector("#submit-form");
  submitbtn.addEventListener("click", function () {
    const email = document.querySelector("#exampleFormControlInput1").value;
    if (!validateEmail(email)) {
      alert("Email is not valid");
    } 
  });
});

//validation
function validateEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

function valiateComment(comment){
  if(comment.length < 0){
    return false;
  }else{
    //meaning that there are comments in the textbox
    return true;
  }
}

async function getPostalCode(input) {
  const postalCode = input; // Replace with the actual postal code you want to convert
  const url = `https://nominatim.openstreetmap.org/search.php?q=${postalCode},Singapore&format=json`;
  // const response = await axios.get(url);
  // console.log("🚀 ~ file: index_clone.js:110 ~ temp ~ response:", response.data);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const lat = data[2].lat;
      const lon = data[2].lon;
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);

     L.marker([lat, lon])
        .addTo(map)
        .bindPopup("Postal Code")
        .openPopup();
    })
    .catch((error) => console.error(error));

}

// Create a new zoom control with a custom position
var zoomControl = L.control.zoom({ position: 'bottomright' });
// Add the new zoom control to the map
zoomControl.addTo(map);

// Create a new zoom control with a custom position
var zoomControl = L.control.zoom({ position: 'bottomleft' });
// Add the new zoom control to the map
zoomControl.addTo(map);

// Get a reference to the default zoom control
var defaultZoomControl = map.zoomControl;
// Remove the default zoom control from the map
map.removeControl(defaultZoomControl);


//1. create a text box on front end and a enter input btn, remeber to set id for the textbox and btn
//2. pass the input value into the textbox and get the value
// within the addEventListener using javascript
//3. use console.log to verify whether the value is passed into javascript
//4. once the value is extract, look for the openstreetmap api and how to use it
//5. do a axios post request call and get a lat and long value back in return.
//6. ask chatgtp about eventlistener, how to use addEventlistener
