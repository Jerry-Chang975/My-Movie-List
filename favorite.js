const BASE_URL = 'https://webdev.alphacamp.io/';
const INDEX_URL = BASE_URL + 'api/movies/';
const POSTER_URL = BASE_URL + '/posters/';
const movieContainer = document.querySelector('#data-panel');

function renderMovieList(data) {
  // render HTML
  let rawHTML = ``;
  data.forEach((movie) => {
    rawHTML += `
    <div class="card">
      <img
        src="${POSTER_URL + movie.image}"
        class="card-img-top mx-auto"
        alt="movie poster"
      />
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
      </div>
      <div class="card-footer text-body-secondary">
        <button
          href="#"
          class="btn btn-primary btn-show-movie"
          data-bs-toggle="modal"
          data-bs-target="#movie-modal"
          data-id="${movie.id}"
        >
          More
        </button>
        <button href="#" class="btn btn-danger btn-rm-favorite" data-id="${
          movie.id
        }">
          x
        </button>
      </div>
    </div>`;
  });
  movieContainer.innerHTML = rawHTML;
}

function getFavMovies() {
  renderMovieList(JSON.parse(localStorage.getItem('favMovies')));
}

movieContainer.addEventListener('click', (e) => {
  // check the click btn
  if (e.target.matches('.btn-show-movie')) {
    const movieTitle = document.querySelector('#movie-modal-title');
    const movieImgContainer = document.querySelector('#movie-modal-image');
    const movieRelease = document.querySelector('#movie-modal-date');
    const movieDescription = document.querySelector('#movie-modal-description');
    axios.get(INDEX_URL + String(e.target.dataset.id)).then((res) => {
      let { title, image, release_date, description } = res.data.results;

      movieTitle.textContent = title;
      movieImgContainer.src = POSTER_URL + image;
      movieDescription.textContent = description;
      movieRelease.textContent = 'release date: ' + release_date;

      // movieTitle.textContent =
    });

    console.log(e.target.dataset.id);
  }
});

function rmFavMovie(id) {
  const favMovies = JSON.parse(localStorage.getItem('favMovies'));
  const rmIndex = favMovies.findIndex((movie) => movie.id === id);
  favMovies.splice(rmIndex, 1);
  renderMovieList(favMovies);
  localStorage.setItem('favMovies', JSON.stringify(favMovies));
}

movieContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-rm-favorite')) {
    const rmId = parseInt(event.target.dataset.id);
    rmFavMovie(rmId);
  }
});

getFavMovies();
