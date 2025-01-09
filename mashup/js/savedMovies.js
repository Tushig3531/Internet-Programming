// Function to display saved movies from local storage
function displaySavedMovies() {
    const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    const savedMoviesList = document.getElementById('savedMoviesList');

    if (savedMovies.length === 0) {
        savedMoviesList.innerHTML = '<p class="text-muted">No movies saved yet.</p>';
        return;
    }

    savedMovies.forEach(movie => {
        const movieItem = `
            <div class="saved-movie mb-3">
                <h3>${movie.title} (${movie.release_date.split('-')[0]})</h3>
                <p>TMDB Voting Average: ${movie.vote_average.toFixed(1)}</p>
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" width="200px">
                <button class="btn btn-danger mt-2" onclick="removeMovie(${movie.id})">Remove</button>
            </div>
        `;
        savedMoviesList.innerHTML += movieItem;
    });
}

// Function to remove a movie from local storage
function removeMovie(movieId) {
    let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    savedMovies = savedMovies.filter(movie => movie.id !== movieId);
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
    displaySavedMovies();  // Refresh the movie list
}

// Display saved movies on page load
window.onload = function () {
    displaySavedMovies();
};