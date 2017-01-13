# Where's My Hero!?
Where's My Hero!? - [Link to Deployed version of the project](https://shielded-inlet-58489.herokuapp.com/)


## Who is our user?
Our user is a tech savvy sandwich aficionado.  Someone who won’t be fooled by any questionable piece of meat sitting lacklusterly between a pair of tired old buns.  No!  Our user expects the greatest culinary experience offered.  But, the question remains, where to get it?  Where’s their club, their open face, their BLAT ...  where’s their hero?

Thats where we come in.  We host reviews of sandwiches to help our users find the best usage of their food oriented face holes.  We find their hero and we tell them right where to shove it!


See the published project at github.com/sf-wdi-labs/readme-example!


## Technologies Used
* jQuery
* HTML
* CSS
* Express
* NodeJS
* Mongoose
* Bootstrap
* JavaScript
* Handlebars
* Mongoose Sessions
* Yelp api
* Google Maps api
* Geolocation api
* Giphy api
* Google fonts api




## Code I'm Proud Of

### Ryan Johnson:
Setting up database relationships was an exciting challenge.  We have one submission form that saves data using four different models and relates everything so that it can be accessed in a number of ways.  This snippet illustrates one piece of our route that relates a review to a sandwich.  It also creates a sandwich instance if it does not already exist on our database.  This will allow us to later add some gamifying aspects to the site, to dynamically suggest sandwiches to users based on similar users behavior, and to create user pages and other interesting queries.
```javascript
db.Sandwich.findOne({type: req.body.sandwichType}, function(err, sandwich){
      if(err){
        console.log('FindOne error in server.js', err);
        //if the sandwich exits, push related data
      } else if (sandwich){
        console.log('found a sandwich: ', sandwich)
        sandwich.reviews.push(newReview)
        newReview.sandwiches.push(sandwich)
        sandwich.save()
      } else {
        //if it's a new sandwich, create it, then push related data
        console.log("that's a new sandwich")
        var newSandwich = new db.Sandwich({type: req.body.sandwichType})
        newSandwich.save()
        newSandwich.reviews.push(newReview)
        newReview.sandwiches.push(newSandwich)
        newSandwich.save()
        console.log(newSandwich)
      }
      //save the changes
      newReview.save()
    })
```
### Michael Blair:
I'm very proud of the map functionality I wrote.  I've set up the map to hide by default, and to open at the touch of a button.  Upon opening the button to deploy it hides, and a button to change the location to the user's current location appears.  I'm especially proud of the code that will detect the user moving the map and show another button that enables the user to search for food at the new center of the map allowing them to check other neighborhoods.  And, when the map is drawn the button to search in the new location vanishes and only appears when the map is moved again.

A challenge I faced while writing this was in learning how to locate the coordinates for the center of the map.  I found many posts online and much documentation about how to change the center of the map, but not the other way around.  When I saw that the code to change the center was .setCenter() I thought that if I was writing the software I would use .getCenter() to get the center of the map at a specific location, then found that the function existed, but with very little documentation or posts about usage.  After more searching and trial and error I learned that with this function you call the .lat() and .lng() functions to finalize the call.

<!-- good problem-solving and writeup -->

```javascript
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

//Detects clicking and dragging on the map, shows the button to search
$('.hero-map').mousedown(function(){
  if ($('.hero-map').mousemove(function(){
  })){
    $('.change-location').show(600);
  }
})
```

### Ryan Thomas:
The snippet that I'm very proud of is switching pages. Most of the work I did was on the front end, so having a chance to struggle through a new subject on the back end was really helpful for me in learning more about backend. Struggling through that cleared other general problems that have troubled me in the past.  It really solidified my route building.

<!-- Include one of the back-end routes that powers this too, since the code below shows you using the browser's `window` API to change the URL. -->

```javascript
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
```


## Screen Shots
####Homepage
![homepage](https://i.imgur.com/89gjzo6.png "Homepage")

####Create Page
![create form](https://i.imgur.com/E8MJrzI.png "Create Form")

####Login Modal
![sign up form](https://i.imgur.com/opMLlE9.jpg "Sign Up Form")
