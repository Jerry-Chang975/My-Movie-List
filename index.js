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
        <button href="#" class="btn btn-info btn-add-favorite">
          +
        </button>
      </div>
    </div>`;
  });

  movieContainer.innerHTML = rawHTML;
}

async function getMovieData() {
  let res = await axios.get(INDEX_URL);
  movieList.push(...res.data.results);
  renderMovieList(movieList);
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
      console.log(title);
      console.log(release_date);
      console.log(description);

      movieTitle.textContent = title;
      movieImgContainer.src = POSTER_URL + image;
      movieDescription.textContent = description;
      movieRelease.textContent = 'release date: ' + release_date;

      // movieTitle.textContent =
    });

    console.log(e.target.dataset.id);
  }
});

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

  if (searchInput.value) {
    // 2. traverse the movieList and filter
    const searchedMovieList = searchMovies(searchInput.value, movieList);

    // 4. rerender the page of searched movies
    renderMovieList(searchedMovieList);
  } else {
    renderMovieList(movieList);
  }
});

getMovieData();
