manual = 0;



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
             alert("Error");
         },
    });
       
}


function setMeetupDetails(results){
    $(".loading").html("How about...");
    $(".name").html(results['name']);
    $("a.name").attr("href", results['link']);
    $("img").attr("src", results['group_photo']['photo_link']);
    results
    var cleanDesc = results['description'].replace(/(<(?!\/?p(?=>|\s.*>))\/?.*?>)/ig,"");
    $(".desc").html(cleanDesc);
    $(".results").slideDown();
    
}


function runApp() {
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
    $(".results").slideUp(); // Clear any old results hanging around
    $(".index").slideUp();
    $(".loading").slideDown();
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