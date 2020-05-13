
window.onload = () => {
  navigator.geolocation.getCurrentPosition(loadPlaces);}
   //get current user location

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



AFRAME.registerComponent("clickhandler", {
  init: function() {
    this.el.addEventListener("click", () => {
      alert(this.el.getAttribute('name'));
    });
  }
});

function loadPlaces(position){
  $.ajax({  url: "https://rest.busradar.conterra.de/prod/haltestellen", 
            type: "GET",
            async: false,
            success: busstops_callback  
          });
  
  
  var inicall = [];
  
    
  /**
  * @description This function is the callback function of the URL that gets the users closest
  * 5 busstops in Muenster, including their distance and their direction and saves all these informations
  * in an array.
  */
  function busstops_callback(x) {
  
      //var position = navigator.geolocation.getCurrentPosition();
      var narr =[];
      
    for (i=0; i< x.features.length; i++ ){
        // get name of busstop
        var lagebez = x.features[i].properties.lbez;
        //get coordinates of busstop
        var coords = x.features[i].geometry.coordinates;
        //get distance of busstop
        var distance = dist([position.coords.longitude, position.coords.latitude], coords);
                //save all the data above in a single array
        var inarr = [lagebez, coords, distance];
        //push the array into the output array
        narr.push(inarr);
    }

   // sort the busstops in descending disctance order
    narr.sort(
    function(a,b) {
    return a[2] - b[2];
    });

    // save the closest 5 busstops in the global array   
    inicall = narr.slice(0,5);
    // when data is loaded, activate the "Kalkulieren"-button

console.log(inicall);

var places = [
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
      
  }];
  console.log(places);
  main(places);
}

}



  function main(places){
    //places = loadPlaces();
    //var places = loadPlaces();
      //.then((places) => {
        // get scene
        var scene = document.querySelector('a-scene');
      

  //return navigator.geolocation.getCurrentPosition(function (position) { //get current user location
  
      // add every Busstop to the scene
      places.forEach((place) => {
          const latitude = place.location.lat;
          const longitude = place.location.lng;
          console.log(latitude, longitude);

          // add place icon
          const icon = document.createElement('a-image');
          icon.setAttribute('gps-entity-place', "latitude:"+ latitude , "longitude:" + longitude);
          icon.setAttribute('name', place.name);
          icon.setAttribute('src', ' ./Bushaltestelle_img.jpg ');
          icon.setAttribute('look-at', '[gps-camera]');
          icon.setAttribute('clickhandler', true);

          // for debug purposes, just show in a bigger scale
          icon.setAttribute('scale', '20, 20');
          console.log(icon);

          scene.appendChild(icon);
        }); 
      
  (err) => console.error('Error in retrieving position', err),
  {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 27000,
  }
    
    }