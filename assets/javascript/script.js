  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD7LKEZDUSZYb2Di8ln7Qi7c646C-sp1PY",
    authDomain: "pdhtestit-d8e0d.firebaseapp.com",
    databaseURL: "https://pdhtestit-d8e0d.firebaseio.com",
    projectId: "pdhtestit-d8e0d",
    storageBucket: "pdhtestit-d8e0d.appspot.com",
    messagingSenderId: "1084562958218"
  };
firebase.initializeApp(config);

var database = firebase.database();

var searchedArray = [];

     
var isPlaying = false;
var relatedArtistsList = [];    
var relatedArtistsLength = 5;

var artistId;
var artistInfo;






       function makeDaMap(centerPoint) {
        //change these
       console.log("inside our map callback")
        //console.log(centerPoint);
       //var uluru = {lat: 35.307093, lng: -80.735164};
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



function stopAudio(){
	$('audio').each(function(){
	    this.pause(); // Stop playing
	    this.currentTime = 0; // Reset time
	    var isPlaying = false;
	});
};



//this function creates an audio file for the artistID and makes it play and pause.
function GetAudio(placeholder, number){
		$.ajax({
			url: "https://api.spotify.com/v1/artists/"+ placeholder +"/top-tracks?country=US",
			method:"GET"
		}).done(function(music){

			var track = music.tracks[0].preview_url;

			var obj = document.createElement("audio");
			obj.src = track;
			obj.autoPlay = false;
			obj.preLoad = true;	
			obj.id = placeholder;	
			var isPlaying = false;	

			$("#artist-image").append(obj);


			$("#play-btn"+ number).on("click", function(){
					stopAudio();
					obj.play();	
					if(isPlaying === false){
					event.preventDefault();
					obj.play();	
					isPlaying = true;	
				} else if(isPlaying === true){
					obj.pause();
					isPlaying = false;
				};

			});			
		});
};







function addToFirebase(artist){

		if(searchedArray.length < 6){
			searchedArray.splice(0,0,artist);
		} else {
			searchedArray.splice(searchedArray.length-1,1);
			searchedArray.splice(0,0,artist);
	};

		database.ref().set({

		recentSearches: searchedArray
	});

};








function getAllArtistInfo(x){

	$(".list").empty();
	$(".related-artists").empty();


	var artistInput = x;

	// search for the artist in Spotify and pull out info
	$.ajax({
		url: "https://api.spotify.com/v1/search?query="+artistInput+"&type=artist&market=US&offset=0&limit=3",
		method:"GET"
	}).done(function(response){
		
		console.log(response);

		var artistInfoArray = response.artists.items;


		var artistInfo = artistInfoArray[0];
		//artist ID pulled out. this used to search for related artists
		var artistId = artistInfo.id;
		//artist name - to be displayed and to be used to search seatgeek
		var artistName = artistInfo.name;

		addToFirebase(artistName);


		var artistImgUrl = artistInfo.images[1].url;
		var artistImg= $("<img src='"+artistImgUrl+"'' alt='"+artistName+"' class='img-responsive'>")

		$("#artist-image").append(artistImg);

		console.log(artistImgUrl);

		$("#results-title").text("Events for "+artistName+ " in your area")
		console.log(artistName);

		console.log(artistId);

		console.log(artistInfo.images[1].url);
		//artist image displayed
		$(".artist-pic").html("<img src = "+artistInfo.images[2].url+" id='current-artist-pic'>")

		$(".artist-pic").hide();
		$(".artist-pic").fadeIn(200);






	var artistBtn = $("<img src='assets/images/playbutton.png' height='100' id='play-btnmain' class='playBtn'>");

				$("#artist-img-song").append(artistBtn);
				$("#play-btnmain").hide();
				setTimeout(function(){$("#play-btnmain").fadeIn(300)},300);

				GetAudio(artistId, "main");

				
					$('#play-btnmain').hover(function() {
						if (isPlaying === false){
					  $(this).attr('src', 'assets/images/playbutton1.png');
					};
					}, function() {
						if (isPlaying === false){
					  $(this).attr('src', 'assets/images/playbutton.png');
					};
					});
				

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

				var relatedArtistId = data.artists[i].id;

				console.log(relatedArtistId);

	

				var sampleBtn = $("<img src='assets/images/playbutton.png' height='50' class='playBtn' id='play-btn"+i+"'>");
				

				
				//building media object with artist image, name, and play button
				var newRow = $("<div class='row'>")
				var mediaObject = $("<div class='media'>")

				var mediaLeft = $("<div class='media-left'><img src="+data.artists[i].images[1].url+" class='related' value="+i+"></img></div>");

				mediaObject.append(mediaLeft);

				var mediaBody = $("<div class='media-body'><h5 class='media-heading'>"+data.artists[i].name+"</h5></div>");		
				mediaObject.append(mediaBody);
				mediaBody.append(sampleBtn);

				newRow.append(mediaObject);

				$("#related-artists").append(newRow);
				GetAudio(relatedArtistId, i);

						
			};

			

	});
 



$.ajax({
 type:"GET",
 url:'https://api.seatgeek.com/2/performers?client_id=NzIyODkxOHwxNDkxMjY2NjExLjMy&q='+artistName,
 async:true,
 dataType: "json",
 success: function(json) {
             console.log(json);
            var performerId1 = json.performers[0].id;
             
          


	//search seat geek for events related to our artist
	$.ajax({
		type:"GET",
		url:"https://api.seatgeek.com/2/events?client_id=NzIyODkxOHwxNDkxMjY2NjExLjMy&performers.id= "+ performerId1 + '&geoip=true&range=200mi',
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
	            var prettyTime = moment(eventTime).format("ddd, MMM Do, hh:mm");
	            console.log(prettyTime);

	            var performerName =  eventInfo.performers[0].name;

	        	var newMediaNode = $("<div class='media'>");

				var newMediaBody = $("<div class='media-body'>");

				var eventTitleDiv = $("<h4 class='media-heading'>"+ performerName +" live at "+ venueName +"</h4>");

	            var eventLocation = eventInfo.venue.location;

	            var locationFormatted = {lat:eventLocation.lat, lng:eventLocation.lon};

	            console.log(locationFormatted)

				var eventInfoDiv = $("<div>"+prettyTime + " <button data-lat='" + locationFormatted.lat + "' data-lng='" + locationFormatted.lng + "'class='btn btn-primary btn-block' id='get-location'>Get Location</button><a href="+ eventInfo.url +" target='_blank'><button class='btn btn-info btn-block'>Get your tickets Here!</button></a></div>");

				newMediaBody.append(eventTitleDiv);
				newMediaBody.append(eventInfoDiv);

	            var tixButton = eventInfoDiv.find('#get-location');
	            tixButton.on('click',  function(evt) {
	                var newCoords ={lat: parseFloat($(this).attr('data-lat')), lng: parseFloat($(this).attr('data-lng'))};
	                console.log(newCoords);
	                // when we click 'get location', display the map wrap
	                $('.map-wrap').removeClass('hide');
	                // add closer bitton event handler
	                $('#closer').on('click', function(){
	                	$('.map-wrap').addClass('hide');
	                
	                })
	                makeDaMap(newCoords);
	            });

				
				newMediaNode.append(newMediaBody);

				$("#event-list").append(newMediaNode);

        };

    }else{
    		$("#event-list").html("<h1 style='color:white'> Sorry, there are no upcoming events for this artist in your area</h1>");
    };
   

          },

      });
       },

});


	});
};







//function to clear divs out
function clearDivs(){
	$("#artist-image").fadeOut(300);
	setTimeout(function(){$("#artist-image").empty();}, 305);
	setTimeout(function(){$("#artist-image").fadeIn(400);}, 650);

	$("#related-artists").slideUp(300);
	setTimeout(function(){$("#related-artists").empty();}, 305);
	setTimeout(function(){$("#related-artists").hide();}, 305);
	setTimeout(function(){$("#related-artists").slideDown(400);}, 650);
	$("#event-list").slideUp(300);
	setTimeout(function(){$("#event-list").empty();}, 305);
	setTimeout(function(){$("#event-list").hide();}, 305);
	setTimeout(function(){$("#event-list").slideDown(400);}, 650);
	$("#map").empty();
	$("audio").remove();

	$("#play-btnmain").fadeOut(300);
	setTimeout(function(){$("#play-btnmain").remove();}, 305);

	$("#recent-searches").empty();
	
};







database.ref().on("value", function(snapshot){

		$("#recent-searches").empty();
		var firebaseArray = snapshot.val().recentSearches

	if(searchedArray.length === 0){
		for (i=0; i<firebaseArray.length; i++){
				searchedArray.splice(0,0,firebaseArray[i]);
			};
		};


		for (i=0; i<searchedArray.length; i++){
				var newButton = $("<button class='btn btn-primary btn-block recent-search' value='"+searchedArray[i]+"'>"+searchedArray[i]+"</button>");
				$("#recent-searches").append(newButton);
		};	

	});





$("#results").hide();
		// on click run function

$("#runSearch").on("click", function(){		
	
		//prevent default in order for the page not to reload
		event.preventDefault();
		artistSelected = $("#inputName").val().trim();

		getAllArtistInfo(artistSelected);
		//hide the front page and display the results page
		$("#page").fadeOut(500);
		setTimeout(function(){$("#results").fadeIn(1000)},500);
		// $("#results").fadeIn(1000);
		

});





$(document).on("click", '.playBtn', function() {
                    console.log("clicked");
                    if (isPlaying === false) {
                        $(this).attr('src', 'assets/images/pausebutton.png');
                        isPlaying = true;
                    } else if (isPlaying === true){
                        $(this).attr('src', 'assets/images/playbutton.png');
                        isPlaying = false;
                    };
  });





$(document).on("click", ".related", function(){
		
		clearDivs();
		artistNumb = $(this).attr("value")
		console.log(artistNumb);
		relatedArtist = relatedArtistsList[artistNumb].name;
		console.log(relatedArtist);
		setTimeout(function(){getAllArtistInfo(relatedArtist)}, 310);
		stopAudio();

});





$("#submit").on("click", function(){
	
	event.preventDefault();
	clearDivs();
	newArtist = $("#artist-input").val().trim();
	setTimeout(function(){getAllArtistInfo(newArtist)},310);
	stopAudio();
});


$(document).on("click",".recent-search", function(){

	clearDivs();
	var recentSearchName = $(this).attr("value");
	setTimeout(function(){getAllArtistInfo(recentSearchName)}, 310);
	stopAudio();

});




