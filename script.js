manual = 0;
cardNumber = 0;
stillLoading = 0;
userLocation = [];

// set userLocation array
function setUserLocation(lat,lon){
    userLocation = [lat,lon];
}

// logic
function queryMeetup(lat,lon){
    var request_url = "http://api.meetup.com/2/groups?radius=25.0&order=id&desc=false&offset=0&format=json&lat="+lat+"&page=20&fields=&lon="+lon+"&sig_id=55414092&sig=4ce82daddbd9472c297859057d105bfdfc64436d";
    console.log("request url: "+request_url);
    $.ajax({
         url: request_url,
         dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
         success:function(json){
             // pick out a random group and spawn card
             var results_length = json['results'].length;
             if(results_length == 0){
                 errorMessage("No results in your area!");
             }
             // console.log(results_length);
             var rand = Math.floor(Math.random()* (results_length+1) );
             // console.log(rand);
             var results = json['results'][rand];
             // setMeetupDetails(json['results'][rand]);
             console.log(results);
             if(! results){
                 errorMessage();
             } else {
                 spawnCard(json['results'][rand]);        
             }
             
         },
         error:function(){
             errorMessage();
         },
    });    
}


// function setMeetupDetails(results){
//     console.log(results);
//     if(! results){
//         errorMessage();
//     } else {
//         spawnCard(results);        
//     }
// }

// interface and function
function newCard() {
    // $(".loading").html("Loading...");
    // stillLoading = 1;

    loadStatus();
    // setTimeout(function(){
    //     if (stillLoading = 0) {
    //         errorMessage();
    //     }
    // },3000);
    
    queryMeetup( userLocation[0] , userLocation[1] );

    // if (manual = 0) {
      //   loadStatus();
      //   if (navigator.geolocation)
      //   {
      //       navigator.geolocation.getCurrentPosition(showPosition);
      //   }
      // else{alert("Geolocation is not supported by this browser.");}
    // } else {
    //     queryMeetup(manual[0],manual[1]);
    // 
    // }
}
      
      
function showPosition(position)
{
    setUserLocation( position.coords.latitude, position.coords.longitude );
    // loadMeetup([position.coords.latitude , position.coords.longitude], 'geolocate');
      queryMeetup(userLocation[0],userLocation[1]);
}

// interface
//
// set loading messages,
// queue up timeout errors, etc
//
function loadStatus(){
    stillLoading = 1;
    
    setTimeout(function(){
        if (stillLoading == 1) {
            errorMessage();
        }
    },3000);
    
    
    // $(".results").slideUp(); // Clear any old results hanging around
    $(".index").slideUp();
    $(".loading").slideDown();
    $('.main').after('<div class="loading-card"><!-- loading --></div>');
    $(".loading-card").slideDown();
    var target = $(".loading-card").get(0);
    var spinner = new Spinner().spin(target);
}

function unloadStatus(){
    stillLoading = 0;
    $(".loading").html("How about this one? Or <a onClick='newCard();' href='#'>find another meetup</a>.");
}

function errorMessage(optionalMessage){
    console.log("Problem loading")
    if (optionalMessage) {
        console.log(optionalMessage);
        $(".loading").html(""+optionalMessage+" <a href='javascript:location.reload();'>Reload the page</a>.");
        stillLoading = 0;
    } else {
        $(".loading").html("Hmm, seems to be a problem. Try <a href='javascript:location.reload();'>reloading</a>?");
    }
}


// interface
function manualEntryReveal(){
    $("button").hide();
    // $(".manual").slideDown();
    $(".manual").css("display", "block");
    $(".manual").focus();
}

// logic
function getGoogleLocation(){
    loadStatus();
    var address = $('input.manual').val();
    var request_url = "http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=true&callback=handleMaps";
    console.log("Google request: "+request_url);
    $.ajax({
         url: request_url,
         dataType: 'json', // Notice! JSONP <-- P (lowercase)
         success:function(json){
             // var loc = json['results'][0]['geometry']['location'];
             // convertManual([loc['lat'],loc['lng']]);
             if (json['status'] == "ZERO_RESULTS") {
                 errorMessage("Not sure where you mean... try being more specific.");
             }
             console.log( json['results'][0]['geometry']['location']['lng'] );
             setUserLocation(
                 json['results'][0]['geometry']['location']['lat'],
                 json['results'][0]['geometry']['location']['lng']
             );
             queryMeetup(userLocation[0],userLocation[1]);
             
         },
         error:function(){
             // alert("Error");
             errorMessage();
         },
    });   
}

function getGeolocation(){
    loadStatus();
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{alert("Geolocation is not supported by this browser.");}
    
    // newCard();
}

// function convertManual(input){
//     console.log(input);
//     manual[0] = input[0];
//     manual[1] = input[1];
//     
// }

// interface and logic
function spawnCard(results){
    
    cardNumber++;
    var currCard = ".card"+cardNumber;
    console.log(currCard);
    $('.loading-card').before('<div class="card card'+cardNumber+'"><div class="meetup-details results"><a class="name" href="/"></a><a href="/" class="img-cont"><img src=""></a><div class="desc"></div></div></div>');
    
    $(currCard+" .name").html(results['name']);
    $(currCard+" a.name").attr("href", results['link']);
    $(currCard+" a.img-cont").attr("href", results['link']);
    if (! results['group_photo'] ) {
        $(currCard+" img").remove();
    } else {
        $(currCard+" img").attr("src", results['group_photo']['photo_link']);
    } 
       
    if (! results['description']) {
        $(currCard+" .desc").html("<p>No description.</p>");
    } else {
        var cleanDesc = results['description'].replace(/(<(?!\/?p(?=>|\s.*>))\/?.*?>)/ig,"");
        if (! cleanDesc.indexOf("<p>") == 0) {
            cleanDesc = '<p>'+cleanDesc+'</p>';
        }
        $(currCard+" .desc").html(cleanDesc);
    }

    // $(".loading-card").css({'position':'fixed'});
    
    unloadStatus();
    $(currCard).slideDown('medium', 'swing');
    
    $(currCard).animate({
        top: 0,
      }, 500, function() {
        $(currCard).css({ 'z-index': 10 });
      });
    
      // var newCardHeight = $(currCard).height();
      // $(".card"+(cardNumber-1) ).animate({
      //     top: '+='+newCardHeight,
      //   }, 1000, function() {
      //     // Animation complete.
      //   });
    
    
    $(".results").slideDown();

    $(".loading-card").animate({
          opacity: 0,
        }, 100, function() {
            $(".loading-card").slideUp(500, function() {
                $(".loading-card").remove();
            });
        });
}
