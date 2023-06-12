const BASE_URL = 'https://webdev.alphacamp.io/';
const INDEX_URL = BASE_URL + 'api/movies/';
const POSTER_URL = BASE_URL + '/posters/';

const movieList = [];
const movieContainer = document.querySelector('#data-panel');
const searchBtn = document.querySelector('#search-submit-button');

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
        <button href="#" class="btn btn-info btn-add-favorite" data-id="${
          movie.id
        }">
          +
        </button>
      </div>
    </div>`;
  });

  if (rawHTML) {
    movieContainer.innerHTML = rawHTML;
  } else {
    movieContainer.innerHTML = '<h1>Not found!</h1>';
  }
}

async function getMovieData() {
  let res = await axios.get(INDEX_URL);
  movieList.push(...res.data.results);
  renderMovieList(movieList);
}

// search function
// 1. get search input keyword
// 2. traverse the movieList and filter
// 3. add matched movies into targetList
// 4. rerender the page of searched movies

function searchMovies(keyword, dataList) {
  // 3. add matched movie into targetList
  const targetList = dataList.filter((movie) =>
    movie.title.toLowerCase().includes(keyword.toLowerCase())
  );
  return targetList;
}

// toggle with clicking search button
searchBtn.addEventListener('click', (event) => {
  event.preventDefault(); // stop submit event

  // 1. get search input keyword
  const searchInput = document.querySelector('#search-input');
  if (searchInput.value) {
    // 2. traverse the movieList and filter
    const searchedMovieList = searchMovies(searchInput.value, movieList);

    // 4. rerender the page of searched movies
    renderMovieList(searchedMovieList);
  } else {
    renderMovieList(movieList);
  }
});

// toggle with input changing event
const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('input', (event) => {
  event.preventDefault(); // stop submit event

  if (searchInput.value.trim()) {
    // 2. traverse the movieList and filter
    const searchedMovieList = searchMovies(searchInput.value, movieList);

    // 4. rerender the page of searched movies
    renderMovieList(searchedMovieList);
  } else {
    renderMovieList(movieList);
  }
});

// addFavorite function
// 1. add eventListener in plus btn
// 2. get id of movie in favMovies that has been selected
// 3. save into localStorage

function addToFavorite(movieId) {
  const favMovies = JSON.parse(localStorage.getItem('favMovies')) || [];
  const movie = movieList.find((movie) => movie.id === movieId);
  if (favMovies.some((movie) => movie.id === movieId)) {
    alert('This movie has already been add to favorite list!');
  } else {
    favMovies.push(movie);
    localStorage.setItem('favMovies', JSON.stringify(favMovies));
    alert('Add to favorite successfully!');
  }
}

movieContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-add-favorite')) {
    const movieId = parseInt(event.target.dataset.id);
    // add into favMovies
    addToFavorite(movieId);
  }
});

getMovieData();
