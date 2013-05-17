manual = 0;
cardNumber = 0;
stillLoading = 0;

function queryMeetup(lat,lon){
 
    var request_url = "http://api.meetup.com/2/groups?radius=25.0&order=id&desc=false&offset=0&format=json&lat="+lat+"&page=20&fields=&lon="+lon+"&sig_id=55414092&sig=4ce82daddbd9472c297859057d105bfdfc64436d";


    console.log(request_url);

    $.ajax({
         url: request_url,
         dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
         success:function(json){
             var rand = Math.floor(Math.random()*21);
             setMeetupDetails(json['results'][rand]);
         },
         error:function(){
             errorMessage();
         },
    });
       
}


function setMeetupDetails(results){
    console.log(results);
    if(! results){
        errorMessage();
    } else {
        spawnCard(results);        
    }
}


function runApp() {
    $(".loading").html("Loading...");
    stillLoading = 1;
    setTimeout(function(){
        if (stillLoading = 0) {
            errorMessage();
        }
    },3000);

    // if (manual = 0) {
        loadStatus();
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
      else{alert("Geolocation is not supported by this browser.");}
    // } else {
    //     queryMeetup(manual[0],manual[1]);
    // 
    // }
}
      
      
function showPosition(position)
{
      queryMeetup(position.coords.latitude,position.coords.longitude);
}

function loadStatus(){
    // $(".results").slideUp(); // Clear any old results hanging around
    $(".index").slideUp();
    $(".loading").slideDown();
    $('.main').after('<div class="loading-card"><!-- loading --></div>');
    $(".loading-card").slideDown();
    var target = $(".loading-card").get(0);
    var spinner = new Spinner().spin(target);
}

function manualEntry(){
    $("button").hide();
    // $(".manual").slideDown();
    $(".manual").css("display", "block");
    $(".manual").focus();
}

function getGoogleLocation(){
    
    
    loadStatus();
    
    var address = $('input.manual').val();


    var request_url = "http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=true&callback=handleMaps";


    console.log(request_url);

    $.ajax({
         url: request_url,
         dataType: 'json', // Notice! JSONP <-- P (lowercase)
         success:function(json){
             var loc = json['results'][0]['geometry']['location'];
             convertManual([loc['lat'],loc['lng']]);
             queryMeetup(loc['lat'],loc['lng']);
             
         },
         error:function(){
             alert("Error");
         },
    });
    
    
}

function convertManual(input){
    console.log(input);
    manual[0] = input[0];
    manual[1] = input[1];
    
}


function spawnCard(results){
    cardNumber++;
    var currCard = ".card"+cardNumber;
    console.log(currCard);
    $('.loading-card').before('<div class="card card'+cardNumber+'"><div class="meetup-details results"><a class="name" href="/"></a><a href="/" class="img-cont"><img src=""></a><div class="desc"></div></div></div>');
    
    $(currCard+" .name").html(results['name']);
    $(currCard+" a.name").attr("href", results['link']);
    $(currCard+" a.img-cont").attr("href", results['link']);
    $(currCard+" img").attr("src", results['group_photo']['photo_link']);
    
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
    

    stillLoading = 0;
    $(".loading").html("How about this one? Or <a onClick='runApp();' href='#'>find another meetup</a>.");

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

function errorMessage(){
    console.log("Problem loading")
    $(".loading").html("There's a problem, try <a href='javascript:location.reload();'>reloading</a>.");
}