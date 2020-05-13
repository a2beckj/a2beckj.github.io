function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        document.getElementbyId("geojson").value = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var coordLat = position.coords.longitude;
    var coordLong = position.coords.latitude;
    console.log(coordLat, coordLong);
}

getLocation();

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

// This is the resource URL from where to access data
var resource = "https://rest.busradar.conterra.de/prod/haltestellen";

// XHR-obejct requests
var x = new XMLHttpRequest();
x.onload = loadcallback;
x.onerror = errorcallback;
x.onreadystatechange = statechangecallback;
x.open("GET", resource, true);
x.send();

//initialize output array(global)
var inicall = [];

/**
 * @description This function is the callback function of the URL that gets the users closest
 * 5 busstops in Muenster, including their distance and their direction and saves all these informations
 * in an array.
 */
function statechangecallback() {
    //if the data is okay
    if (x.status == "200" && x.readyState == 4) {
        // initialize output array  
        var narr = [];
        // convert received data to JS-object
        var t = JSON.parse(x.response);

        // for all features in the received data  
        for (i = 0; i < t.features.length; i++) {
            // get name of busstop
            inicall.push(t.features[i]);
        }

        inicall.forEach((object) => {
            document.createElement();
        });
    }
}

/**
 * @description This function takes the input coordinates from an oringin and a destination as arrays
 * and calculates the distance from the origin point to that destination point
 * @param {array} origin - the single point that is the origin to other points
 * @param {array} dest - a single point to which the distance has to be calculated to
 * @return {number} d - the distance
  */

var dist = function (origin, dest) {

    //get coordinates of point
    var lon1 = origin[0];
    var lat1 = origin[1];
    var lon2 = dest[0];
    var lat2 = dest[1];

    //degrees to radiants
    var R = 6371e3; // metres
    var φ1 = lat1 * (Math.PI / 180);
    var φ2 = lat2 * (Math.PI / 180);
    var φ3 = lon1 * (Math.PI / 180);
    var φ4 = lon2 * (Math.PI / 180);
    var Δφ = (lat2 - lat1) * (Math.PI / 180);
    var Δλ = (lon2 - lon1) * (Math.PI / 180);

    //calculate distances
    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

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

var direc = function (origin, dest) {

    //get coordinates of point
    var lon1 = origin[0];
    var lat1 = origin[1];
    var lon2 = dest[0];
    var lat2 = dest[1];

    //degrees to radiants
    var R = 6371e3; // metres
    var φ1 = lat1 * (Math.PI / 180);
    var φ2 = lat2 * (Math.PI / 180);
    var φ3 = lon1 * (Math.PI / 180);
    var φ4 = lon2 * (Math.PI / 180);
    var Δφ = (lat2 - lat1) * (Math.PI / 180);
    var Δλ = (lon2 - lon1) * (Math.PI / 180);

    //bearing
    var y = Math.sin((φ4 - φ3) * Math.cos(φ2));
    var x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ4 - φ3);
    var brng = Math.atan2(y, x) * 180 / Math.PI;

    //avoid negative bearing
    if (brng < 0) {
        brng += 360;
    }

    return brng;
}

function main(){
  // Access the coordinates of the point (GeoJson)
  //var pnt = JSON.parse(inicall); 

  // initialize output array
  outarr = [];

  // for every point in pointcloud do the following calculations
  for (var i = 0; i < inicall.length; i++) {
      var name = inicall.properties.lbez [i]
      var d = dist(getLocation(), inicall.geometry.coordinates [i]); // Distance (function-call)
      var text = direc(getLocation(), inicall.geometry.coordinates [i]); // Direction (function-call)
     

      //all together in one array
      outarr.push([name, d, text]);

      //sort values in array by ascending distances
      outarr.sort(
          function(a,b) {
          return a[1] - b[1];
          }
      )
      outarr.slice(0,5);
      return outarr;
      } 

      console.log(main());