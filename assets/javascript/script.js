

//       function initMap2(centerPoint) {
//         //change these
//        console.log("inside our map callback")
//         //console.log(centerPoint);
//        var uluru = {lat: 35.307093, lng: -80.735164};
//         //map creation line
//         var map = new google.maps.Map(document.getElementById('map'), {
//           zoom: 16,
//           center: centerPoint //uluru
//         });
//         var marker = new google.maps.Marker({
//           position: centerPoint,
//           map: map
          
//         });
       
//       }



//       function initMap() {
//         //change these
       
//         //console.log(centerPoint);
//        var uluru = {lat: 35.307093, lng: -80.735164};
//         //map creation line
//         var map = new google.maps.Map(document.getElementById('map'), {
//           zoom: 16,
//           center: uluru
//         });
//         var marker = new google.maps.Marker({
//           position: uluru,
//           map: map
          
//         });
       
//       }

     

var relatedArtistsList = [];    
var relatedArtistsLength = 5;



function getAllArtistInfo(x){

	$(".list").empty();
	$(".related-artists").empty();


	var artistInput = x;

	// search for the artist in Spotify and pull out info
	$.ajax({
		url: "https://api.spotify.com/v1/search?query="+artistInput+"&type=artist&market=US&offset=0&limit=1",
		method:"GET"
	}).done(function(response){
		console.log(response);


		var artistInfo = response.artists.items[0];
		//artist ID pulled out. this used to search for related artists
		var artistId = artistInfo.id;
		//artist name - to be displayed and to be used to search seatgeek
		var artistName = artistInfo.name;

		$("#results-title").text("Events for "+artistName+ " in your area")
		console.log(artistName);

		console.log(artistId);

		console.log(artistInfo.images[1].url);
		//artist image displayed
		$(".artist-pic").html("<img src = "+artistInfo.images[2].url+" id='current-artist-pic'>")



	//artist ID searched in order to find related artists
		var relatedArtists = "https://api.spotify.com/v1/artists/"+artistId+"/related-artists";	


		$.ajax({
			url: relatedArtists,
			method:"GET"
		}).done(function(data){

			console.log(data);
	//loop through array of related artist objects. pull out whatever info we need on each
			for (i=0; i < relatedArtistsLength; i++){

				relatedArtistsList = data.artists;
			
				var image = $("<img src="+data.artists[i].images[1].url+" class='related' value="+i+">"+data.artists[i].name+"</img><br/>");
				$("#related-artists").append(image);

			};


	});



	//search seat geek for events related to our artist
	$.ajax({
		type:"GET",
		url:"https://api.seatgeek.com/2/events?client_id=NzIyODkxOHwxNDkxMjY2NjExLjMy&q= "+ artistName + "&geoip=true&range=200mi",
		async:true,
		dataType: "json",
		success: function(results) {

			console.log(results);

			if(results.events.length > 0){

			for (i=0; i< results.events.length; i++){

			

			var eventInfo = results.events[i];

			var venueName = eventInfo.venue.name;

			console.log(venueName);
			// $("#event-title").text(artistName +" live at "+ venueName);
            
            var eventTime = eventInfo.datetime_local;
            var prettyTime = moment(eventTime).format("MMM Do, hh:mm");
            console.log(prettyTime);

            var performerName =  eventInfo.performers[0].name;
            var performerImg=  eventInfo.performers[0].image;


        	var newMediaNode = $("<div class='media'>");

			var mediaPic = $("<div class='media-left artist-pic'>");

			var artistPic = $("<img src='"+performerImg+"' alt='"+performerName+"'>");

			mediaPic.append(artistPic);

			var newMediaBody = $("<div class='media-body'>");

			var eventTitleDiv = $("<h4 class='media-heading'>"+ performerName +" live at "+ venueName +"</h4>");

			var eventInfoDiv = $("<div>"+prettyTime + " <a href="+ eventInfo.url +" target='_blank'><button class='btn btn-warning'>Get your tickets Here!</button></a></div>");

			newMediaBody.append(eventTitleDiv);
			newMediaBody.append(eventInfoDiv);


			newMediaNode.append(mediaPic);
			newMediaNode.append(newMediaBody);

			$("#event-list").append(newMediaNode);

            var eventLocation = eventInfo.venue.location;
        };
    }else{
    	$("#event-list").html("<h1> Sorry, there are no upcoming events for this artist in your area</h1>");
    };
   

          },

      });
	});
};






$("#results").hide();
		// on click run function
$("#runSearch").on("click", function(){
		//prevent default in order for the page not to reload
		event.preventDefault();
		artistSelected = $("#inputName").val().trim();
		getAllArtistInfo(artistSelected);
		//hide the front page and display the results page
		$("#page").hide();
		$("#results").show();

});




$(document).on("click", ".related", function(){

		$("#related-artists").empty();
		$("#event-list").empty();
		artistNumb = $(this).attr("value")
		console.log(artistNumb);
		relatedArtist = relatedArtistsList[artistNumb].name;
		console.log(relatedArtist);
		getAllArtistInfo(relatedArtist);

});





