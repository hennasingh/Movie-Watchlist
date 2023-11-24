const searchTextForm = document.getElementById("search-text-form")
const containerMovies = document.getElementById("movies")


let movieDetails = ``
let mySavedMovies = []
const url = window.location.href
const moviesFromStorage = JSON.parse(localStorage.getItem("myMovies"))

if(moviesFromStorage){
    mySavedMovies = moviesFromStorage
}

document.addEventListener('click', function(event) {
    if(event.target.dataset.add){
        if(!mySavedMovies.includes(event.target.dataset.add)){
            mySavedMovies.push(event.target.dataset.add)
            localStorage.setItem("myMovies", JSON.stringify(mySavedMovies))
        }
    } else if(event.target.dataset.remove){
        console.log(event.target.dataset.remove)
        const value = event.target.dataset.remove
        if(mySavedMovies.length == 1){
            movieDetails = ``
            containerMovies.innerHTML = `
                <div class="start-exploring">
                    <p class="no-movies"> Your watchlist is looking a little empty...</p>
                    <a href="index.html" class="bold add-movie"><img src="./add.png" /> Let's add some movies</a>
                </div>
                `
        } else {
            mySavedMovies = mySavedMovies.filter(item => item!== value)
        
            localStorage.setItem("myMovies",JSON.stringify(mySavedMovies) )
            renderMovies()
        }
    }
})

if(url.endsWith('index.html')){ 
    searchTextForm.addEventListener("submit", getSearchText);
} else {
    console.log('watchlist')
    renderMovies()
}
function renderMovies() {
    movieDetails = ``
    mySavedMovies.forEach(movieId => {
        displayMovieDetails(movieId)
    })
}
function getSearchText(event) {
  event.preventDefault()

  const formData = new FormData(searchTextForm);
  const searchText = formData.get("search-text")
  findMovies(searchText.trim())
}

async function findMovies(searchText) {

  if (searchText) {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=a813525a&s=${searchText}`
      );
      const data = await response.json()
      if (data.Search == undefined) {
        throw Error("Unable to find what you're looking for")
      } else {
        getSearchResults(data.Search)
      }
    } catch (err) {
      {
        containerMovies.innerHTML = `
            <div class="no-movies">
                <p >Unable to find what you're looking for. Please try another search.</p>
            </div>      
            `
      }
    }
  }
}

function getSearchResults(movies) {
  movies.forEach((movie) => {
    displayMovieDetails(movie.imdbID)
  })
}

async function displayMovieDetails(movieId) {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=a813525a&i=${movieId}`
  )
  const movie = await response.json()
  const image = url.endsWith('index.html') ? `<img src="./add.png" data-add=${movieId} />Watchlist`: `<img src="./remove.png" data-remove=${movieId} />Remove`
  movieDetails += `
            <div class="card">
                <div class="poster">
                    <img src=${
                      movie.Poster != "N/A" ? movie.Poster : "No-Image.png"
                    } class="movie-poster">
                </div>
                <div class="details">
                    <h3>
                    ${movie.Title}
                    <img src="./star.png" class="rating-star"/><span class="rating">${movie.imdbRating}</span></h3>                   
                    <div class="movie-props">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <p class="add-movie">${image}</p>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
            </div>
            `
  containerMovies.innerHTML = movieDetails
}
