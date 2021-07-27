"use strict"

const serverURL = "https://ten-coordinated-spectrum.glitch.me/movies"

    //Call data & get it
    function AJAX(url, method = "GET", data){

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        return fetch(url, options)
            .then(response => response.json()) //parsing data
            .then(responseData => responseData)
            .catch(error => error);
    }

    //DISPLAY DATA
    AJAX(serverURL)
        .then(data => {console.log("Inital Data Load:"); console.log(data); displayMovies(data); hideLoading()})

    //Hide loading data when data is loaded
    function hideLoading(){
        $(".loading").addClass("canSee");
    };

    //Add movie data to HTML
    function displayMovies(movies) {
        //resets html to blank, so when user adds movie page is reset
        $("#movieContainer").html("");

        //generates html for displaying movie
        movies.forEach(function (movie) {
            $("#movieContainer").append(`<div class="col">
                                <h4>${movie.title}</h4>
                                <img src="${movie.poster}" alt="Example Image">
                                 <p id="movieYear${movie.year}">${movie.year}</p>
                                 <p id="movieRating${movie.rating}">${movie.rating}</p>
                                 <p id="moviePlot${movie.plot}">${movie.plot}</p>
                                 <button type="button" id="editButton${movie.id}" class="editButton" data-id=${movie.id}>Edit</button>
                                 <button type="button" id="deleteButton${movie.id}" class="deleteButton" data-id=${movie.id}>Delete</button>
                                 </div>`);
        });
    }

    //DELETES MOVIE WHEN CLICKED
    $(document).on("click",".deleteButton",function() {
      const actuallyDelete = confirm("Do you really want to delete selected movie?");
      if(actuallyDelete){
          AJAX(serverURL + "/" + $(this).attr("data-id"), "DELETE")
              .then(AJAX(serverURL)
                  .then(data => displayMovies(data)))
      }
    });


//one modal in index and all edit buttons bring it up

//closes form when "closed" is clicked/selected
    function closeForm() {
        document.getElementById("myForm").style.display = "none";
    }

//when edit button clicked, pulls up form for input
    $(document).on("click",".editButton",function() {

            //sets number for ID to reference to later
            let testID = $(this).attr("data-id");

           //TODO: set current values of year/rating/plot as default form text

            //displays pop-up form on click
            $("#myForm").css("display", "block");

        //upon submit click, edit current movie values to whatever input value is
        $('#editSubmit').click(function (event){
            event.preventDefault();
            console.log("Submit clicked!");

            //PATCH
            AJAX(serverURL + "/" + testID, "PATCH", {
                title: $("#movieTitle").val(),
                year: $("#yearReleased").val(),
                rating: $("#movieRating").val(),
                plot: $("#moviePlot").val()
            }).then(AJAX(serverURL)
                .then(data => {displayMovies(data); closeForm()}))
        });
    });

//upon click of submit button, updates data and regenerates movies
    $('#submit').click(function(event) {
        event.preventDefault();

        //POST - Update data with new user input from form
        AJAX(serverURL, "POST",
            {title: $("#title").val(),
            year: $("#year").val(),
            rating: $("#rating").val(),
            plot: $("#plot").val()
            })
            .then(function (data){
                console.log(data);
            });

        //Refreshes movie data to display user input/movie
        AJAX(serverURL)
            .then(data => {console.log("Data load after user input:"); console.log(data); displayMovies(data); hideLoading()})
    });


//sort by genres when new genre is selected
    $("#genreSelect").change(function (event){
        event.preventDefault();

        AJAX(serverURL)
            .then(data => updateGenreMovie(data, $("#genreSelect").val()));
    });

//function to only display movies that match selected genre
    function updateGenreMovie(movies, genre) {
        //resets html to blank, so when user adds movie page is reset
        $("#movieContainer").html("");

        //generates html for displaying movie (only if match selected genre)
        movies.forEach(function (movie) {
            if(movie.genre.includes(genre)){
                $("#movieContainer").append(`<div class="col">
                                    <h4>${movie.title}</h4>
                                    <img src="${movie.poster}" alt="Example Image">
                                     <p id="movieYear${movie.year}">${movie.year}</p>
                                     <p id="movieRating${movie.rating}">${movie.rating}</p>
                                     <p id="moviePlot${movie.plot}">${movie.plot}</p>
                                     <button type="button" id="editButton${movie.id}" class="editButton" data-id=${movie.id}>Edit</button>
                                     <button type="button" id="deleteButton${movie.id}" class="deleteButton" data-id=${movie.id}>Delete</button>
                                     </div>`);
            }
            else if(genre === "Genre"){
                displayMovies(movies);
            }
        });
    }

//sort by rating when new rating is selected
    $("#ratingSelect").change(function (event){
        event.preventDefault();
        AJAX(serverURL)
            .then(data => updateRatingMovie(data, $("#ratingSelect").val()));
});


//function to only display movies that match selected rating
    function updateRatingMovie(movies, rating) {
        //resets html to blank, so when user adds movie page is reset
        $("#movieContainer").html("");

        //generates html for displaying movie (only if match selected genre)
        movies.forEach(function (movie) {
            if(movie.rating.includes(rating)){
                $("#movieContainer").append(`<div class="col">
                                        <h4>${movie.title}</h4>
                                        <img src="${movie.poster}" alt="Example Image">
                                         <p id="movieYear${movie.year}">${movie.year}</p>
                                         <p id="movieRating${movie.rating}">${movie.rating}</p>
                                         <p id="moviePlot${movie.plot}">${movie.plot}</p>
                                         <button type="button" id="editButton${movie.id}" class="editButton" data-id=${movie.id}>Edit</button>
                                         <button type="button" id="deleteButton${movie.id}" class="deleteButton" data-id=${movie.id}>Delete</button>
                                         </div>`);
            }
            else if(rating === "Rating (Stars)"){
                displayMovies(movies);
            }
        });
    }