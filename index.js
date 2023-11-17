const searchTextForm = document.getElementById('search-text-form')
const containerMovies = document.getElementById('movies')

searchTextForm.addEventListener('submit', getSearchText)
let movieDetails = ``

function getSearchText(event) {
    event.preventDefault()

    const formData = new FormData(searchTextForm)
    const searchText = formData.get('search-text')
    findMovies(searchText.trim())
}

async function findMovies(searchText) {
    if(searchText) {

        const response = await fetch(`http://www.omdbapi.com/?apikey=a813525a&s=${searchText}`)
        const data = await response.json()

        getSearchResults(data.Search)
    }
}

function getSearchResults(movies) {
    
    movies.forEach(movie => {
        displayMovieDetails(movie.imdbID)
    })
}

async function displayMovieDetails(movieId) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=a813525a&i=${movieId}`)
    const movie = await response.json()
        movieDetails += `
            <div class="card">
                <div class="poster">
                    <img src=${movie.Poster != "N/A" ? movie.Poster: "No-Image.png"} class="movie-poster">
                </div>
                <div class="details">
                    <h3>${movie.Title}<img src="./star.png" class="rating-star"/><span class="rating">${movie.imdbRating}</span></h3>                   
                    <div class="movie-props">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <p class="add-movie"><img src="./add.png" data-add=${movieId} />Watchlist</p>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
            </div>
        `
      //console.log(movieDetails)
      containerMovies.innerHTML = movieDetails
   
}