


  

    




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

     

      

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(showPosition);
	} else {
		$("#demo").text("Geolocation is not supported by this browser.");
	};
};


function showPosition(position) {
	$("#demo").html("Latitude: " + position.coords.latitude + 
		"<br>Longitude: " + position.coords.longitude); 
}






$("#runSearch").on("click", function(){
	event.preventDefault();
	$(".list").empty();
	$(".related-artists").empty();

	getLocation();

	event.preventDefault();

	var artistInput = $("#inputName").val().trim();


	$.ajax({
		url: "https://api.spotify.com/v1/search?query="+artistInput+"&type=artist&market=US&offset=0&limit=1",
		method:"GET"
	}).done(function(response){
		console.log(response);


		var artistInfo = response.artists.items[0];

		var artistId = artistInfo.id;

		var artistName = artistInfo.name;
		console.log(artistName);

		console.log(artistId);

		console.log(artistInfo.images[1].url);
		$("#pic").html("<img src = "+artistInfo.images[1].url+">")

// $("body").css("background-repeat", "no-repeat");
	// $("#pic").css("background-image", "url(" + artistInfo.images[0].url+ ")" );
	// $("#pic").css("background-repeat", "no-repeat");

	var relatedArtists = "https://api.spotify.com/v1/artists/"+artistId+"/related-artists";	

	$.ajax({
		url: relatedArtists,
		method:"GET"
	}).done(function(data){

		console.log(data);

		for (i=0; i < data.artists.length; i++){

			
			var image = $("<img src="+data.artists[i].images[1].url+" class='related'></img>");
			$(".related-artists").append(image);

		};


	});




	$.ajax({
		type:"GET",
		url:"https://api.seatgeek.com/2/events?client_id=NzIyODkxOHwxNDkxMjY2NjExLjMy&q= "+artistName + "&venue.state=nc",
		async:true,
		dataType: "json",
		success: function(json) {
			console.log(json);
              // Parse the response.
              // Do other things.
          },

      });



});
});


