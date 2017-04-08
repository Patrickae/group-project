
$(document).ready(function(){




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
};




$("#runSearch").on("click", function(){


	

	$(".list").empty();
	$(".related-artists").empty();

	getLocation();

	

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





});