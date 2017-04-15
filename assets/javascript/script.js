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




//array to put searches pushed and pulled from firebase
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


//stops all audio playing
function stopAudio(){
	$('audio').each(function(){
	    this.pause(); // Stop playing
	    this.currentTime = 0; // Reset time
	    var isPlaying = false;
	});
};



//this function creates an audio file for the artistID and makes it play and pause.
function GetAudio(ID, number){
		$.ajax({
			url: "https://api.spotify.com/v1/artists/"+ ID +"/top-tracks?country=US",
			method:"GET"
		}).done(function(music){

			var track = music.tracks[0].preview_url;

			var obj = document.createElement("audio");
			obj.src = track;
			obj.autoPlay = false;
			obj.preLoad = true;	
			obj.id = ID;	
			var isPlaying = false;	

			//placing the audio tag onto the page. div selected at random-does not affect the display
			$("#artist-image").append(obj);

			//when the selected play buttin is clicked, the matching audio file plays
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






// adds all searches to firebase as an array, array length limited to six. if more, the oldest search is spliced
function addToFirebase(artist){
		//adding result to the array
		if(searchedArray.length < 6){
			searchedArray.splice(0,0,artist);
		} else {
			searchedArray.splice(searchedArray.length-1,1);
			searchedArray.splice(0,0,artist);
	};

		database.ref().set({
			//adding the array to firebase
		recentSearches: searchedArray
	});

};








function getAllArtistInfo(input){


	// search for the artist in Spotify and pull out info
	$.ajax({
		url: "https://api.spotify.com/v1/search?query="+input+"&type=artist&market=US&offset=0&limit=3",
		method:"GET"
	}).done(function(response){
		

		var artistInfoArray = response.artists.items;


		var artistInfo = artistInfoArray[0];
		//artist ID pulled out. this used to search for related artists
		var artistId = artistInfo.id;
		//artist name - to be displayed and to be used to search seatgeek
		var artistName = artistInfo.name;

		addToFirebase(artistName);

		//posting image of artist to the page
		var artistImgUrl = artistInfo.images[1].url;
		var artistImg = $("<img src='"+artistImgUrl+"'' alt='"+artistName+"' class='img-responsive'>")

		$("#artist-image").append(artistImg);

	
//putting a title in the concert results pannel - the body will come when we call seat geek api
		$("#results-title").text("Events for "+artistName+ " in your area")
	



//this is the btn to play the sample for the searched for artist
		var artistBtn = $("<img src='assets/images/playbutton.png' height='100' id='play-btnmain' class='playBtn'>");

				$("#artist-img-song").append(artistBtn);
				$("#play-btnmain").hide();
				setTimeout(function(){$("#play-btnmain").fadeIn(300)},300);

				GetAudio(artistId, "main");

				//switching between play and pause image
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

	//loop through array of related artist objects. pull out whatever info we need on each
			for (i=0; i < relatedArtistsLength; i++){

				relatedArtistsList = data.artists;

				var relatedArtistId = data.artists[i].id;

				//making btn to play the sample - id marked with the array position so it knows which audio file to play
				var sampleBtn = $("<img src='assets/images/playbutton.png' height='50' class='playBtn' id='play-btn"+i+"'>");
				
	
				//make a new row
				var newRow = $("<div class='row'>")

				//build media object
				var mediaObject = $("<div class='media'>")
				var mediaLeft = $("<div class='media-left'><img src="+data.artists[i].images[1].url+" class='related' value="+i+"></img></div>");
				mediaObject.append(mediaLeft);
				var mediaBody = $("<div class='media-body'><h5 class='media-heading'>"+data.artists[i].name+"</h5></div>");		
				mediaObject.append(mediaBody);
				mediaBody.append(sampleBtn);


				//append media object to the row
				newRow.append(mediaObject);

				//place the new row into the panel body
				$("#related-artists").append(newRow);
				//run get audio function.
				GetAudio(relatedArtistId, i);
						
			};			

	});
 


//search artist name on seat geek api. we are looking for the id of the artist to use for next search
$.ajax({
 type:"GET",
 url:'https://api.seatgeek.com/2/performers?client_id=NzIyODkxOHwxNDkxMjY2NjExLjMy&q='+artistName,
 async:true,
 dataType: "json",
 success: function(json) {
             console.log(json);
            var performerId1 = json.performers[0].id;
             
          
	//search seat geek for events related to our artist's ID
		$.ajax({
			type:"GET",
			url:"https://api.seatgeek.com/2/events?client_id=NzIyODkxOHwxNDkxMjY2NjExLjMy&performers.id= "+ performerId1 + '&geoip=true&range=300mi',
			async:true,
			dataType: "json",
			success: function(results) {
				
				//if there are results
				if(results.events.length > 0){

					for (i=0; i< results.events.length; i++){

					var eventInfo = results.events[i];
					console.log(eventInfo);
					var displayLocation = eventInfo.venue.display_location;

					var venueName = eventInfo.venue.name;

				//using moment.js to reformat the time           
		            var eventTime = eventInfo.datetime_local;
		            var prettyTime = moment(eventTime).format("ddd, MMM Do, hh:mm");

		            var performerName =  eventInfo.performers[0].name;

		            //creating new node to place info into
		        	var eventMediaNode = $("<div class='media'>");

					var eventMediaBody = $("<div class='media-body'>");

					var eventTitleDiv = $("<h4 class='media-heading'>"+ performerName +" live at "+ venueName +"</h4>");

		            var eventLocation = eventInfo.venue.location;

		            var locationFormatted = {lat:eventLocation.lat, lng:eventLocation.lon};

		            //adding time date and get location button	
					var eventInfoDiv = $("<div>"+prettyTime + "<p>"+displayLocation+"</p> <button data-lat='" + locationFormatted.lat + "' data-lng='" + locationFormatted.lng + "'class='btn btn-primary btn-block' id='get-location'>Get Location</button><a href="+ eventInfo.url +" target='_blank'><button class='btn btn-info btn-block'>Get your tickets Here!</button></a></div>");

					eventMediaBody.append(eventTitleDiv);
					eventMediaBody.append(eventInfoDiv);

					//ading button to show you the map
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

					//place body into the main media object
					eventMediaNode.append(eventMediaBody);
					//put that built media object into the panel
					$("#event-list").append(eventMediaNode);
		        };

		    }else{
		    	//if no results, show this message
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

	//clears out all of the panels with animations
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

		$("#recent-searches").slideUp(300);
	setTimeout(function(){$("#recent-searches").empty();}, 305);
	setTimeout(function(){$("#recent-searches").hide();}, 305);
	setTimeout(function(){$("#recent-searches").slideDown(400);}, 650);
	
};






//call to get data from firebase
database.ref().on("value", function(snapshot){

	$("#recent-searches").empty();
		var firebaseArray = snapshot.val().recentSearches
//if the page is refreshed push the array in firebase into the searchedArray array
	if(searchedArray.length === 0){
		for (i=0; i<firebaseArray.length; i++){
				searchedArray.push(firebaseArray[i]);
			};
		};

		//make buttons for all of the elements of the array
		for (i=0; i<searchedArray.length; i++){
				var newButton = $("<button class='btn btn-primary btn-block recent-search' value='"+searchedArray[i]+"'>"+searchedArray[i]+"</button>");
				$("#recent-searches").append(newButton);
		};	

	});




	//hide results on page load
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




//switching the play btn and pause btn on click
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




//run same functions for searches, recent searches, or related artists


$(document).on("click", ".related", function(){	
		clearDivs();
		artistNumb = $(this).attr("value")
		console.log(artistNumb);
		relatedArtist = relatedArtistsList[artistNumb].name;
		console.log(relatedArtist);
		//delay in the function to account for animation.
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




