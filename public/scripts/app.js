// This file is *VERY* long!
// Consider breaking giant client-side JS files into smaller ones that each have a certain job. 
// They can then be linked in the HTML in the order they need to load.
// It's not always straightforward, but it would make this file more managable.


console.log('sanity check, app.js is connected');

//Declare global variables here
var map,
    template,
    $reviewsList,
    allReviews = [],
    classes,
    batwichSmack = [
      'Wanna know my secret identity?',
      'Stick it in your food hole!',
      'For whom the BLT tolls.',
      'A hotdog is no sandwich.',
      'Who wants a knuckle sandwich!?',
      'Who you callin turkey!?',
      'Swear to me!',
      "I'm Batwich",
      'My parents were eaten when I was young.  I took it poorly.',
      "I'm a cipher, wrapped in an enigma, smothered in secret sauce.",
      "I don't trust noodles.  They're all impastas.",
      'My partner is a small fry.'
    ],
    heroSmack = [
      'Eat me!',
      'Silence of the hams.',
      'The po-boy only rings twice.',
      "I'm pretty sure a hot dog is a sandwich.",
      'I hAvE cHaT BuBbLeS!!',
      'Whoa, no one called anyone a JT.',
      'Stick it in your food hole!',
      'I never get soggy.',
      'My super power is flavor!',
      'Please, do it for the sliders.',
      'Potato chips do not belong in a sandwich.',
      'Lettuce celebrate!'
    ];

if(!activeUser){        // why are you doing this when the page first loads?   activeUser isn't defined yet?
  var activeUser = {}
}

var giphyApi = "https://api.giphy.com/v1/gifs/search";

if(!(activeUser.reviews)){          // same, activeUser not defined when the page first loads
  activeUser.reviews = [];
}


// these things only happen once the document is ready
$(document).ready(function(){
  console.log('The DOM body is ready')
  console.log('Body parser parsing that body!');     // body-parser is server side only.
  $('.batwich-chat').hide();
  $('.hero-chat').hide();


//*****************
//*****************

   // You might have been able to find more semantic names than sourceOne, sourceTwo, sourceThree
  //Gif Handlebars templates
  var sourceOne = $('#selectableGif-template2').html(),
    templateGif = Handlebars.compile(sourceOne),
    sourceThree = $('#gif-choice').html(),
    templateGifChoice = Handlebars.compile(sourceThree),

    // Review Handlebars template
    $reviewsList = ('#review-form'),
    sourceTwo = $("#review-template").html(),
    templateReview = Handlebars.compile(sourceTwo);

    
    //Restaurant Handlebars templates
    sourceRestaurant = $('#restaurant-template').html(), // this line is missing 'var', so the next 4 are global variables.
    templateRestaurant = Handlebars.compile(sourceRestaurant),

    sourceTwoButtons = $('#review-template-buttons').html(),
    templateReviewButtons = Handlebars.compile(sourceTwoButtons);

  // this is what submits the form to add a review in
  $('.new-review').on('submit', function(event) {
    console.log('submit clicked');  // remove debugging console.logs if cleaning up for portfolio
    event.preventDefault();

    $.ajax({
      method: 'POST',
      url: '/api/reviews',
      data: $(this).serializeArray(),
      success: newReviewSuccess,
      error: newReviewError
    })
  })

  // this is what searches giphy for images
  $('.form-gif').on('submit', function(event){
    console.log('gif submit clicked');
    event.preventDefault();

    $.ajax({
      method: 'GET',
      url: giphyApi,
      data: $(this).serializeArray(),
      success: newGifSearchSuccess,
      error: newGifSearchError
    })
  })

  // this is what handles clicking on a gif
  $('.gifSelectionField2').on('click', '.gifBox', function(event){
    $('.gifSelectionField2').empty();
    var pickedGifHtml = templateGifChoice({ userChosenGif: this.src});
    $('.selected-gif').empty();
    $('.selected-gif').append(pickedGifHtml);
  })

  // this is what populates selectable gifs
  function newGifSearchSuccess(json){
    console.log('ajax call for gif successful.  Gif: ', json);
    // empty space to prevent gifs from multiple searches showing at the same time
    $('.gifSelectionField2').empty();
    json.data.forEach(function(gif){
      var giphyHtml = templateGif({ insertGifHere: gif.images.fixed_height_small.url});
      $(".gifSelectionField2").append(giphyHtml);
    });
  }

  // when pages loads this will trigger and runs the append review function.  gets reviews from review all endpoint
  $.ajax({
    method: 'GET',
    url: '/api/reviews',
    success: appendReviews,
    error: noAppend
  })

  //when page loads, save active user to a variable
  $.ajax({
    method: 'GET',
    url: '/api/user/active',
    success: saveUser,
    // error: noAppend
  })

  // this is the area that deals with the map
  //hide map area when page loads
  $('#hero-map').hide();

  // listener for find hero button.  hides button to search again until map is moved.
  $('.map-section').on('click', '#map-button', function(){
    console.log('map button pressed');
    $('#hero-map').show();
    $('.find-hero-button').hide();

    // set default location as Hell Mi
    var defaultLocation = {
      location: {
        lat: 42.4347,
        lng: -83.9850
      }
    }

    // crete the map using the default location
    createMap(defaultLocation);
  })

    // why is this function indented?
    // creates a google map using location info
    function createMap(data){
      console.log('location found - lat: ', data.location.lat, 'lng: ', data.location.lng);
      $('.change-location').hide();
      if (document.getElementById('mapPlacement')){
        map = new google.maps.Map(document.getElementById('mapPlacement'), {
          center: {lat: data.location.lat, lng: data.location.lng},
          zoom: 15
        });
        $.ajax({
          method: 'POST',
          url: '/api/locations',
          data: data,
          success: showRestaurants,
          error: noRestaurants
        })
      } else {
        activeUser.location = data.location;
        console.log(activeUser);
        $.ajax({
          method: 'POST',
          url: '/api/locations',
          data: activeUser,
          success: appendRestaurants,
          error: noRestaurants
        })
      }
    }

    function noLocation(data){
      console.log('could not find location ', data);
    }

    // looks at each restaraunt sent from yelp
    function showRestaurants(data){
      console.log('you found restaurants! ', data);
      data.forEach(function(restaurant){
        var location = {
          lat: restaurant.coordinates.latitude,
          lng: restaurant.coordinates.longitude
        };
        // this is the content that goes on the card associated with each restaurant in the map
        var content = '<h6>' + restaurant.name + '</h6>' + '<p>' + restaurant.location.address1 + '</p>';
        addMarker(location, content);
      })
    }

    // places a marker on the map for each restaraunt
    function addMarker(position, content){
      var myLatlng, marker, infowindow,contentString;
      // places each marker
      marker = new google.maps.Marker({
        position: position,
        map: map
      });
      // fills in data for the card that appears when clicking on any marker
      contentString = content;
      infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      // listen for click to open the window when a marker is clicked on
      marker.addListener('click', function() {
        // open the restaraunt info when marker clicked on
       infowindow.open(map, marker);
      });
    }

    function noRestaurants(data){
      console.log('you found no restaurants :(  NO SOUP FOR YOU ... wait ... sandwich ... NO SANDWICH FOR YOU!!', data);
    }

    // did you look into map events for this?
    // https://developers.google.com/maps/documentation/javascript/events#MarkerEvents
    //Detects clicking and dragging on the map, shows the button to search
    $('.hero-map').mousedown(function(){
      if ($('.hero-map').mousemove(function(){
      })){
        $('.change-location').show(600);
      }
    })

    // Listener for searching where the user currently is
    $('.current-location').on('click', '#current-location', findLocation)

    function findLocation (){
      console.log('I know where you live!');
      $.ajax({
        method: 'POST',
        url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDN9w5iCC44NN-_bnoO7Yu8ZXnmHB_QmJg',
        success: createMap,
        error: noLocation
      })
    }

    // Listener for searching where the map is currently centered
    $('.change-location').on('click', '#change-location', function(){
      console.log('Searching in the new map location');
      var movedMapLocation = {
        location: {
          lat: map.getCenter().lat(),
          lng: map.getCenter().lng()
        }
      }
      createMap(movedMapLocation);
    })

    // button listener to hide the map area once it's open
    $('.map-section').on('click', '#hide-map-button', function(){
      $('#hero-map').hide();
      $('.find-hero-button').show();
    })

    // this is the end of the map area

    $('.business-search').on('submit', function(event) {
      event.preventDefault();
      console.log('submit clicked');
      activeUser.term = $(this).serializeArray()[0].value
      console.log(activeUser, $(this).serializeArray())
      findLocation()
    })

    function appendRestaurants(restaurants){
      console.log(restaurants)
      $('#business-submit-form').removeClass('hidden')
      $('.restaurant-list').html('')
      restaurants.forEach(function (restaurant){
        $('.restaurant-list').append(templateRestaurant({restaurantName: restaurant.name}))
      })
    }

    $('.business-submit').on('submit', function(event) {
      event.preventDefault();
      console.log('submit clicked');
      var restaurant = $(this).serializeArray()[0].value;
      $('.business-forms').addClass('hidden');
      $('#review-form').removeClass('hidden');
      $('#review-form').prepend('<h2>'+restaurant+'</h2>');
      $('#restaurant-input').val(restaurant)
      console.log(restaurant);
    })

  // this is what spits out each review onto the page.
  function appendReviews(allReviews) {
    var reviewHtml;

    // for each review:
    allReviews.forEach(function(reviewData){
      // create HTML for individual review
      var reviewInfo = {
        reviewContent: reviewData.reviewContent,
        reviewStars: reviewData.stars,
        // turnary cheking to see if reviewData is true or false - if true return yes, if false return no
        reviewRecommend: reviewData.recommend ? "Yes" : "No",
        reviewGif: reviewData.gif,
        reviewId: reviewData._id,
        author: reviewData.username
        };                                                         // indentation is off
        console.log(reviewData.username);
        if (activeUser.reviews.indexOf(reviewData._id)>=0){
          reviewHtml = templateReviewButtons(reviewInfo);
        } else {
          reviewHtml = templateReview(reviewInfo);
        }
        if(activeUser._id){
          $('.login').hide();
          $('.sign-up').hide();
        } else {
          $('.create').hide();
          $('.logout').hide();
        }
      // add review to top of review area
      $('.appendReviews').prepend(reviewHtml);
    });

    // listener for pressing the edit review.  Directs to edit page.
    $('.reviewIndividual').on('click', '#edit-button', function(){
      localStorage.setItem('classes', $(this).attr("class").split(' ')[0]);
      console.log('the edit button was pressed! Review Id is ' + classes);
      window.location.href="../edit";
    })

    // listener for the create review button.  Directs to create page.
    $('#create-button').on('click', function(){
      console.log('the create button was pressed!');
      window.location.href="../create";
    })

    $('.edit-review').on('submit', function(event) {
      console.log('edit review submit clicked');
      event.preventDefault();
      $.ajax({
        method: 'PUT',
        url: '/api/reviews/' + localStorage.getItem("classes"),
        data: $(this).serializeArray(),
        success: newReviewSuccess,
        error: newReviewError
      })
    })

    // click event for pressing the delete review button.  hits the delete route with Id from review
    $('.reviewIndividual').on('click', '#delete-button', function(){
      // sets variable to be the first class associated with this button (which is the id of the review)
      var classes = $(this).attr("class").split(' ')[0];
      console.log('the delete button was pressed! Review Id is ' + classes);
      $.ajax({
        method: 'DELETE',
        url: '/api/reviews/' + classes,
        success: deleteReview,
        error: deleteFailure
      })
      location.reload();
    })

  // this is the end of append reviews function
  };

  function editReview(data){
    console.log('Trying to edit the review below', data);
    templateReview({
      reviewContent: data.reviewContent2
    })
    console.log('The review was edited', data);
    return templateReview;
    window.location.href="../";
  }

  function heroChat() {
    smackTalk = setInterval(function(){
      $('.batwich-chat').empty();
      $('.hero-chat').empty();
      var chance = Math.round(Math.random());

      if (chance) {
        $('.hero-chat').hide();
        $('.batwich-chat').show(400);
        $('.batwich-chat').html(batwichSmack[Math.round(Math.random() * (batwichSmack.length - 1))]);
      } else {
        $('.batwich-chat').hide();
        $('.hero-chat').show(400);
        $('.hero-chat').html(heroSmack[Math.round(Math.random() * (heroSmack.length - 1))]);
      }
    }, 5500);
  }
  heroChat();

// This is the end of on ready function
})


function newReviewSuccess(review){
  console.log('ajax call on review successful.  Review: ', review);
  window.location.href="../"
}

function newReviewError(error){
  console.log('ajax call on review dun messed up.  Error: ', error);
}

function yelpSuccess(restaurant){
  console.log(restaurant);
}

function yelpError (error){
  console.log('ajax call on yelp dun messed up.  Error: ', error);
}

function yelpCallback (data){
  console.log('this is the yelp callback', data);
}

function noAppend (err){
  console.log('the reviews did not append', err);
}

function newGifSearchError(error){
  console.log('ajax call on gif search went bad, boss.  Error: ', error);
}

function deleteReview(data){
  console.log('delete review triggered!', data);
}

function deleteFailure(error){
  console.log('The delete went bad.  Did you delete the right thing?  Did you delete everything?', error);
}

function editFailure(error){
  console.log('Oh, no!  We have failed to edit!  Things remained the same, and you hated that stuff! Error: ', error);
}

function saveUser(user){
  console.log(user);
  activeUser = user;
}
