// Put your zillow.com API key here
var zwsid = "X1-ZWz18ymk6qtlor_5qhl2";

var request = new XMLHttpRequest();

var map, infoWindow, marker, address, output, output1;

function initMap() {
        var loc = {lat: 32.75, lng: -97.13};
        map = new google.maps.Map(document.getElementById('map'), {
          center: loc,
          zoom: 17
        });

        var marker = new google.maps.Marker({
          position: loc,
          map: map
        });
       
        infowindow = new google.maps.InfoWindow;
        google.maps.event.addListener(map, 'click', function(event) {

            if(marker!=null){
                marker.setMap(null);
            }

            var geocoder = new google.maps.Geocoder;
            
            var Lat = event.latLng.lat();
            var Lng = event.latLng.lng();
            var input = Lat+","+Lng;
             
            geocodeLatLng(geocoder, map, infowindow,input);
            sendRequest(Lat,Lng);
  
    });
        document.getElementById("clear").addEventListener("click", function(){
             document.getElementById("output").value = "";
  });
}

function geocodeLatLng(geocoder, map, infowindow,input) {
    if(marker!=null)
            {
                marker.setMap(null);

            }
  var latlngStr = input.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[1]) {
        map.setZoom(17);

        marker = new google.maps.Marker({
          position: latlng,
          draggable: true,
          animation: google.maps.Animation.DROP,
          map: map
        });
        address = results[0].formatted_address;
       
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);


    }
  });
}


function sendRequest () {
    var address = document.getElementById("address").value;
    request.onreadystatechange = displayResult;
    var city = "";
    var state = "";
    var zipcode = "";
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode);
    request.withCredentials = "true";
    request.send(null);
}

function displayResult () {
    if(request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
    
        var add = address;
        output = "Address:"+add+" | Value: "+value+"\n\n";
        output1 = "Address:"+add+" <br/> Value: "+value;
        document.getElementById("output").innerHTML = document.getElementById("output").innerHTML+output;

        infowindow.setContent(output1);
        infowindow.open(map, marker);
    }
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}






  

