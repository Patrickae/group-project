

  

    




      $.ajax({
        type:"GET",
         url:"https://api.seatgeek.com/2/events?client_id=NzIyODkxOHwxNDkxMjY2NjExLjMy",
         async:true,
         dataType: "json",
         success: function(json) {
             console.log(json);
             // Parse the response.
             // Do other things.

             //goes here or out of function? is var correct?
             //var uluru = event.venue.location
             var latLng = {lat: json.events[0].venue.location.lat, lng: json.events[0].venue.location.lon};
            initMap2(latLng);

            }
        });
     


      function initMap2(centerPoint) {
        //change these
       console.log("inside our map callback")
        //console.log(centerPoint);
       var uluru = {lat: 35.307093, lng: -80.735164};
        //map creation line
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: centerPoint //uluru
        });
        var marker = new google.maps.Marker({
          position: centerPoint,
          map: map
          
        });
       
      }



      function initMap() {
        //change these
       
        //console.log(centerPoint);
       var uluru = {lat: 35.307093, lng: -80.735164};
        //map creation line
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
          
        });
       
      }

     

      

