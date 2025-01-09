/* jshint esversion: 8 */
/* jshint browser: true */
/* jshint node: true */
'use strict';

const genre = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
    "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"
];

const genreId = [
    28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648,
    10749, 878, 10770, 53, 10752, 37
];

const apiKeyYoutube = 'AIzaSyDBYuIx5xdiv06cBIdkB7XbfO52GjyEurA';
const apiKeyTMDB = '5e7e151b6ac2b50933e6c837912fe67a';
const apiKeyOMDB = '8a4584ca'; 

function populateGenre(selectId, sList, genreId) {
    let sel = document.getElementById(selectId);
    sList.forEach((genre, index) => {
        let anOption = document.createElement("option");
        anOption.setAttribute("value", genreId[index]);
        anOption.innerHTML = genre;
        sel.appendChild(anOption);
    });
}
// calls omdb api to fetch initial list of movies
async function getListOfMovie(genId) {
    const imdbRating = document.getElementById('imdbRating').value || 0; // Default to 0 if not provided
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKeyTMDB}&with_genres=${genId}&vote_average.gte=${imdbRating}&sort_by=popularity.desc`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results.length > 0) {
            const randomMovie = getRandomMovie(data.results);
            displayMovie(randomMovie);
        } else {
            alert('No movies found with the specified TMDB voting average.');
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        alert('There was an error fetching the movie information.');
    }
}
// randomizer 
function getRandomMovie(movies) {
    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex];
}

function displayMovie(movie) {
    const resultDiv = document.getElementById('displayResult');

    const tmdbVotingAvg = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    resultDiv.innerHTML = `
        <h3>${movie.title} (${movie.release_date.split('-')[0]})</h3>
        <p>TMDB Voting Average: ${tmdbVotingAvg}</p>
        <p>${movie.overview}</p>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster" width="200px">
        <div id="relatedPersonsContainer" class="related-persons-container"></div>
        <div id="trailerContainer" class="trailer-container"></div>
        <div id="castList"></div>
        <button id="saveMovieBtn" class="save-button" title="Add to Favorites">
            <i class="far fa-heart"></i>
        </button>
    `;

    // Fetch and display the trailer, related persons, and cast for the movie
    findTrailer(movie.title);
    findRelatedPersons(movie.title); 
    findActors(movie.title);

    // Add event listener for the save button
    const saveButton = document.getElementById('saveMovieBtn');
    saveButton.addEventListener('click', () => {
        saveMovieToLocalStorage(movie);
        toggleHeartIcon(saveButton); // Toggle the heart icon
    });
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    resultDiv.innerHTML = `
    <h3>${movie.title} (${movie.release_date.split('-')[0]})</h3>
    <p>TMDB Voting Average: ${tmdbVotingAvg}</p>
    <p>${movie.overview}</p>
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster" width="200px">
    <div id="relatedPersonsContainer" class="related-persons-container"></div>
    <div id="trailerContainer" class="trailer-container"></div>
    <div id="castList"></div>
    <button id="saveMovieBtn" class="btn btn-primary mt-3" title="Add to Favorites">
        <i class="far fa-heart"></i> Save Movie
    </button>
`;
    document.getElementById("saveMovieBtn").addEventListener("click", function() {
        saveMovieToLocalStorage(movie);
    });

}


async function findRelatedPersons(movieTitle) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKeyOMDB}&t=${encodeURIComponent(movieTitle)}`);
    const data = await response.json();

    if (data.Response === "True") {
        displayRelatedPersons(data);
    } else {
        document.getElementById('relatedPersonsContainer').innerHTML = '<p>Related persons not found.</p>';
    }
}

function displayRelatedPersons(data) {
    const relatedPersonsContainer = document.getElementById('relatedPersonsContainer');
    relatedPersonsContainer.innerHTML = `
        <h4>Related Persons</h4>
        <p>Director: ${data.Director}</p>
        <p>Writer: ${data.Writer}</p>
    `;
}


function saveMovieToLocalStorage(movie) {
    console.log("Attempting to save movie:", movie);
    const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    const movieExists = savedMovies.some(savedMovie => savedMovie.id === movie.id);
    
    if (movieExists) {
        alert('This movie is already saved.');
        return;
    }

    savedMovies.push(movie);
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
    alert('Movie saved successfully!');
}
function displaySavedMovies() {
    const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    
    if (savedMovies.length === 0) {
        document.getElementById('savedMoviesList').innerHTML = '<p>No movies saved yet.</p>';
        return;
    }

    savedMovies.forEach(movie => {
        const movieItem = `
            <div class="saved-movie">
                <h3>${movie.title} (${movie.release_date.split('-')[0]})</h3>
                <p>TMDB Voting Average: ${movie.vote_average.toFixed(1)}</p>
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" width="200px">
            </div>
        `;
        document.getElementById('savedMoviesList').innerHTML += movieItem;
    });
}

function removeMovie(movieId) {
    const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    const updatedMovies = savedMovies.filter(movie => movie.id !== movieId);
    
    localStorage.setItem('savedMovies', JSON.stringify(updatedMovies));
    displaySavedMovies();  
}

async function findTrailer(seriesName) {
    const name = `${seriesName} trailer`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(name)}&key=${apiKeyYoutube}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            displayTrailer(videoId);
        } else {
            alert('No trailer found for this movie.');
        }
    } catch (error) {
        console.error('Error in fetching:', error);
        alert('The trailer could not be fetched.');
    }
}

function displayTrailer(videoId) {
    const trailerContainer = document.getElementById('trailerContainer');
    trailerContainer.innerHTML = `
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `;
}

// This looks up the series in OMDB API

async function findActors(movieTitle) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKeyOMDB}&t=${encodeURIComponent(movieTitle)}`);
    const data = await response.json();
    
    console.log(data); 

    if (data.Response === "True") {
        displayCast(data);
    } else {
        document.getElementById('castList').innerHTML = '<p>Cast not found.</p>';
    }
}
//It gives the cast and picture of it

async function displayCast(data) {
    const castList = document.getElementById('castList');
    castList.innerHTML = ''; 

    const cast = data.Actors.split(', ');

    for (const actor of cast) {
        const actorName = actor.split(' as ')[0].trim();

        const imgSrc = await fetchActorImage(actorName);
        
        const actorDiv = document.createElement('div');

        actorDiv.className = 'actor';
        
        const img = document.createElement('img');
        img.src = imgSrc || 'https://via.placeholder.com/1600x2400';

        const nameDiv = document.createElement('div');
        nameDiv.textContent = actorName; 
        actorDiv.appendChild(img);
        actorDiv.appendChild(nameDiv); 
        castList.appendChild(actorDiv);
    }
}
// This is the 4th API which takes the image of the cast

async function fetchActorImage(actorName) {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(actorName)}&format=json&origin=*`);
    const data = await response.json();

    if (data.query.search.length > 0) {
        const pageTitle = data.query.search[0].title;

        const imgResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&origin=*`);
        const imgData = await imgResponse.json();
        const page = Object.values(imgData.query.pages)[0];

        return page.thumbnail && page.thumbnail.source || null;   
     }

    return null; 
}


// Add event listener for the SPIN button
document.getElementById("spinButton").addEventListener('click', () => {
    const genreSelect = document.getElementById('genreOptions');
    const selectedGenre = genreSelect.value;
    getListOfMovie(selectedGenre); // Get the list of movies based on selected genre
});


window.onload = function () {
    populateGenre("genreOptions", genre, genreId);
};