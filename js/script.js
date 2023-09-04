const global = {
    currentPage: window.location.pathname
};

function highLightActiveLink() {
    console.log("HighLightActiveLink");
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute("href") === global.currentPage) {
            link.classList.add('active');
        }
    });
}

async function fetchPopularMovies() {
    const response = await fetchDataAPI('movie/popular');
    console.log(response.results);
    showSpinner();
    response.results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML =
        `<a href="movie-details.html?id=${movie.id}">
        ${
            movie.poster_path ?
            `<img
            src="http://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="Movie Title"
            />` :
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="Movie Title"
            />`
        }
    </a>
    <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
    <div>`

    document.querySelector("#popular-movies").appendChild(div);
    });
    hideSpinner();
    return response;
}

async function fetchPopularShows() {
    const response = await fetchDataAPI('tv/popular');
    console.log(response.results);
    showSpinner();
    response.results.forEach((tv) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML =
        `<a href="tv-details.html?id=${tv.id}">
        ${
            tv.poster_path ?
            `<img
            src="http://image.tmdb.org/t/p/w500${tv.poster_path}"
            class="card-img-top"
            alt="Tv Title"
            />` :
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="Tv Title"
            />`
        }
    </a>
    <div class="card-body">
        <h5 class="card-title">${tv.name}</h5>
        <p class="card-text">
        <small class="text-muted">Air date: ${tv.first_air_date}</small>
        </p>
    <div>`

    document.querySelector("#popular-shows").appendChild(div);
    });
    hideSpinner();
    return response;
}

function showSpinner() {
    document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
    document.querySelector(".spinner").classList.remove("show");
}

async function displayMovieDetails() {
    const movieID = window.location.search.split('=')[1];
    movie = await fetchDataAPI(`movie/${movieID}`);
    const div = document.createElement('div');
    div.innerHTML =
    `
    <div class="details-top">
    <div>
    ${
        movie.poster_path ?
        `<img
        src="http://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt=${movie.title}
        />` :
        `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt=${movie.title}
        />`
    }
</div>
    <div>
      <h2>Movie ${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
      ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li> ${genre.name} <li/>`).join('')}
      </ul>
      <a href="#" target="_blank" class="btn">${movie.homepage}</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${(movie.budget.toLocaleString("en-US"))}</li>
      <li><span class="text-secondary">Revenue:</span> $${(movie.revenue.toLocaleString("en-US"))}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime}</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
   <div> ${movie.production_companies.map((company) => `<span> ${company.name} <span/>`).join(', ')} </div>
  </div>

    `
    document.getElementById('movie-details').appendChild(div);
    console.log(movie);
    displayBackgroundImage('movie',movie.backdrop_path);
}

async function displayShowDetails() {
    const showID = window.location.search.split('=')[1];
    show = await fetchDataAPI(`tv/${showID}`);
    console.log(show);
    const div = document.createElement('div');
    div.innerHTML =
    `
    <div class="details-top">
    <div>
    ${
        show.poster_path ?
        `<img
        src="http://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt=${show.name}
        />` :
        `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt=${show.name}
        />`
    }
</div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
      <p>
      ${show.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${show.genres.map((genre) => `<li> ${genre.name} <li/>`).join('')}
      </ul>
      <a href="#" target="_blank" class="btn">${show.homepage}</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>show Info</h2>
    <ul>
      <li><span class="text-secondary">Number of Episodes:</span> $${(show.number_of_episodes)}</li>
      <li><span class="text-secondary">Last Episode To Air:</span> $${(show.last_episode_to_air.name)}</li>

      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
   <div> ${show.production_companies.map((company) => `<span> ${company.name} <span/>`).join(', ')} </div>
  </div>

    `
    document.getElementById('show-details').appendChild(div);
    console.log(show);
    displayBackgroundImage('show',show.backdrop_path);
}


function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.2';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }

}

async function fetchDataAPI(endpoint) {
    const API_KEY = 'c42805abafe25def68cba1e821cbc129';
    const API_URL = 'https://api.themoviedb.org/3/';
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();

    return data;
}

// Init App
function init() {
    switch(global.currentPage) {
        case '/':
        case '/index.html':
        {
            console.log('Home');
            fetchPopularMovies();
            break;
        }
        case '/shows.html' : {
            console.log('Shows');
            fetchPopularShows();
            break;
        }
        case '/movie-details.html' : {
            console.log('MovieDetails');
            displayMovieDetails();
            displayBackgroundImage();
            break;
        }
        case '/tv-details.html' : {
            console.log('TVDetails');
            displayShowDetails();
            break;
        }
        case '/search.html' : {
            console.log('TVDetails');
            break;
        }
    }
    highLightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);