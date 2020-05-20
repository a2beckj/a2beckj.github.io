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
      //alert(this.el.getAttribute('name', 'distance'));
      //), (this.el.getAttribute('distance')));
      
      var msg = (
                ("name: " + (this.el.getAttribute('name'))) + 
                \n("distance: " + (this.el.getAttribute('distance')))
                //("buslines: " + (this.el.getAttribute('buslines'))) 
                );
            console.log(msg);
      alert(msg);
      //alert(this.el.getAttribute("name: "+'name'))//&vbcrlf&"distance:"+'distance'&vbcrlf&"next buslines:"+'buslines'));
      //alert(this.el.getAttribute('name'));
    });
  }
});
/*
/*
var promise = new Promise (function (resolve, reject){
  var arr = [];
  var id = busstops_callback().lageid;
  var sekunden = 300;
  $.ajax( { url: "https://rest.busradar.conterra.de/prod/haltestellen"+"/"+id+"/abfahrten?sekunden="+sekunden,
            success: getStops
            })
          
          } 
          ) 
*/

function busstops(id, sekunden){
  $.ajax( { url: "https://rest.busradar.conterra.de/prod/haltestellen"+"/"+id+"/abfahrten?sekunden="+sekunden,
  success: getStops
  })
}

function getStops(x){
  var arr = [];
  for (i=0; i < x.length; i++){
      arr.push(x[i].linienid);
      console.log(arr);
     return arr;
  }
}

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
  console.log(x);
  //var position = navigator.geolocation.getCurrentPosition();
  var narr =[];
  //console.log(User_loc);
for (i=0; i< x.features.length; i++ ){
    // get name of busstop
    var lagebez = x.features[i].properties.lbez;
    //get id of busstop
    var lageid = x.features[i].properties.nr;
    //get coordinates of busstop
    var coords = x.features[i].geometry.coordinates;
    //get distance of busstop
    var distance = dist([position.coords.longitude, position.coords.latitude], coords);
    //get buslines within next 5 minutes on that busstop
    //var buslines = busstops(lageid, 300);
    //save all the data above in a single array
    var inarr = [lagebez, coords, distance, lageid];
    //push the array into the output array
    narr.push(inarr);
    //console.log(narr);

}

   // sort the busstops in descending disctance order
    narr.sort(
    function(a,b) {
    return a[2] - b[2];
    });

    // save the closest 5 busstops in the global array   
    inicall = narr.slice(0,5);
   
    lines(inicall);
    //busstops(inicall)
  }}




  function lines(buslines){
    //let o = inicall;
    var w = [];
    //console.log(busstations)
    for (i=0; i<buslines.length; i++){
      var busid = buslines[i][3];
      let busline = buslines[i];
      
      //console.log(busid);
      var url = "https://rest.busradar.conterra.de/prod/haltestellen"+"/"+busid+"/abfahrten?sekunden="+1500;
      fetch(url)
      .then(function(response){
        //console.log(response.text);
        return response.json();
      })
      .then(function(json){
        console.log(json.length);
        let arr = [];
        for (j=0; j < json.length; j++){
            arr.push(json[j].linienid);
           
        }
       
        busline.push(arr);
        console.log(busline);
        
      })
      .catch(function(error){
        console.log("Fehler");
      })
      w.push(busline);
      
    }
    console.log(w);
       
var places = [
  {
      name: w[0][0],
      distance: w [0][2],
      buslines: w [0][4],
      location: {
          lat: w[0][1][1], 
          lng: w[0][1][0], 
      }
  },
  {
    name: w[1][0],
    distance: w [1][2],
    buslines: w [1][4],
    location: {
        lat: w[1][1][1], 
        lng: w[1][1][0], 
    }
      
  },
  {
    name: w[2][0],
      distance: w [2][2],
      buslines: w [2][4],
      location: {
          lat: w[2][1][1], 
          lng: w[2][1][0], 
      }
},
{
  name: w[3][0],
  distance: w [3][2],
  buslines: w [3][4],
  location: {
      lat: w[3][1][1], 
      lng: w[3][1][0], 
  }
      
  },
  {
    name: w[4][0],
    distance: w [4][2],
    buslines: w [4][4],
    location: {
        lat: w[4][1][1], 
        lng: w[4][1][0], 
    }
      
  }];
  console.log(places);
  main(places);
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
          icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
          icon.setAttribute('name', place.name);
          icon.setAttribute('distance', place.distance);
          icon.setAttribute('buslines', place.buslines);
          icon.setAttribute('src', ' ./Bushaltestelle_img.png ');
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
/*
document.querySelector('a-image').addEventListener('click', function (evt) {
  alert('This 2D element was clicked!');
});*/