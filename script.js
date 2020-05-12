// jshint esversion: 6

// Global variable
var y = document.getElementById("myText");


/**
 * @description This function takes the input coordinates from an oringin and a destination as arrays
 * and calculates the distance from the origin point to that destination point
 * @param {array} origin - the single point that is the origin to other points
 * @param {array} dest - a single point to which the distance has to be calculated to
 * @return {number} d - the distance
  */

var dist = function(origin, dest){

    //get coordinates of point
    var lon1 = origin[0];
    var lat1 = origin[1];
    var lon2 = dest[0];
    var lat2 = dest[1];

    //degrees to radiants
    var R = 6371e3; // metres
    var φ1 = lat1 * (Math.PI/180);
    var φ2 = lat2 * (Math.PI/180);
    var φ3 = lon1 * (Math.PI/180);
    var φ4 = lon2 * (Math.PI/180);
    var Δφ = (lat2-lat1) * (Math.PI/180);
    var Δλ = (lon2-lon1) * (Math.PI/180);

    //calculate distances
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    //distance
    var d = Math.round(R * c);

    return d;
}


/**
 * @description This function takes the input coordinates from an oringin and a destination as arrays
 * and calculates the direction from the origin point to that destination point as string (e.g N/S/SE etc.)
 * @param {array} origin - the single point that is the origin to other points
 * @param {array} dest - a single point to which the direction has to be calculated to
 * @return {string} text - the direction in text format (e.g. "N"/"SE" etc.)
  */

var direc = function(origin, dest){

    //get coordinates of point
    var lon1 = origin[0];
    var lat1 = origin[1];
    var lon2 = dest[0];
    var lat2 = dest[1];

    //degrees to radiants
    var R = 6371e3; // metres
    var φ1 = lat1 * (Math.PI/180);
    var φ2 = lat2 * (Math.PI/180);
    var φ3 = lon1 * (Math.PI/180);
    var φ4 = lon2 * (Math.PI/180);
    var Δφ = (lat2-lat1) * (Math.PI/180);
    var Δλ = (lon2-lon1) * (Math.PI/180);

    //bearing
    var y = Math.sin((φ4-φ3) * Math.cos(φ2));
    var x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ4-φ3);
    var brng = Math.atan2(y,x)*180/Math.PI;

    //avoid negative bearing
    if (brng < 0) {
        brng += 360;
    }
        return brng;
    }






/**
 * @description This function gets the users current Location
  */
function getLocation(){
    if (navigator.geolocation) {
        // get the users current location and use it with the showPosition-function
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        // if the browser can't access location; Error-Message
        y.innerHTML = "Geolocation is not supported by this browser.";
      }
}

var pnt =[];
/**
 * @description This function takes the users current location, converts it to GeoJson and
 * replaces the input field with this point
 * @param {array} position - users current location
  */
 function showPosition(position) {
  pnt.push(position.coords.longitude, position.coords.latitude);
  console.log(pnt);
 
  statechange();
   
}



  
  


/**
 * @description This function is called, when URL can't access data
 * @param {*} e 
 */
  function errorcallback(e) {
    // console.dir(x);
    // console.dir(e);
    document.getElementById("content").innerHTML = "errorcallback: check web-console";
  }

/**
 * @description This function is called when URL can load data
 */
  function loadcallback() {
    //console.dir(x);
    //console.log(x.status);
  }

//initialize output array(global)
var inicall = [];

function statechange(){  
// This is the resource URL from where to access data
var resource = "https://rest.busradar.conterra.de/prod/haltestellen";

// XHR-obejct requests
var x = new XMLHttpRequest();
x.onload = loadcallback;
x.onerror = errorcallback;
x.onreadystatechange = statechangecallback;
x.open("GET", resource, true);
x.send();



/**
 * @description This function is the callback function of the URL that gets the users closest
 * 5 busstops in Muenster, including their distance and their direction and saves all these informations
 * in an array.
 */
function statechangecallback() {
    //if the data is okay
    if (x.status == "200" && x.readyState == 4) {
      // initialize output array  
      var narr =[];
      // convert received data to JS-object
      var t = JSON.parse(x.response);
      // convert received coordinates to JS-object
      

    // for all features in the received data  
    for (i=0; i< t.features.length; i++ ){
        // get name of busstop
        var lagebez = t.features[i].properties.lbez;
        //get coordinates of busstop
        var coords = t.features[i].geometry.coordinates;
        //get distance of busstop
        var distance = dist(pnt, coords);
        
        //save all the data above in a single array
        var inarr = [lagebez, coords, distance];
        //push the array into the output array
        narr.push(inarr);
    }
    // sort the busstops in descending disctance order
    narr.sort(
        function(a,b) {
        return a[2] - b[2];
        }
    );
    // save the closest 5 busstops in the global array   
    inicall = narr.slice(0,5);
    // when data is loaded, activate the "Kalkulieren"-button
    //document.getElementById("calcbutton").disabled = false;
    console.log(inicall);
    main();
    
  }}}


  function loadPlaces() {
       return [
        {
            name: inicall[0][0],
            location: {
                lat: inicall[0][1][1], 
                lng: inicall[0][1][0], 
            }
        },
        {
          name: inicall[1][0],
          location: {
              lat: inicall[1][1][1], 
              lng: inicall[1][1][0], 
            }
            
        },
        {
          name: inicall[2][0],
          location: {
              lat: inicall[2][1][1], 
              lng: inicall[2][1][0], 
          }
      },
      {
          name: inicall[3][0],
          location: {
              lat: inicall[3][1][1], 
              lng: inicall[3][1][0], 
            }
            
        },
        {
          name: inicall[4][0],
          location: {
              lat: inicall[4][1][1], 
              lng: inicall[4][1][0], 
            }
            
        }
    ];
}

function main(){
//window.onload = () => {
  places = loadPlaces();
  console.log(places);
	scene = document.querySelector('a-scene');
	places.forEach((place) => {
	   const latitude = place.location.lat;
	   const longitude = place.location.lng;
     const icon = document.createElement('img');
     icon.src = 'https://a2beckj.github.io/Bushaltestelle_img.jpg';
	   icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
	   icon.setAttribute('name', place.name);
	   icon.setAttribute('src', 'img/Bushaltestelle_img.jpg');
	   icon.setAttribute('look-at', '[gps-camera]');
	   icon.setAttribute('scale', '20, 20'); // if you want for debugging
	   scene.appendChild(icon);
	});
  // };
  }

getLocation();



