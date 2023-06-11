const BASE_URL = "https://webdev.alphacamp.io/";
const INDEX_URL = BASE_URL + "api/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const movieList = [];
const movieContainer = document.querySelector("#data-panel");

function renderMovieList(data) {
  // render HTML
  let rawHTML = ``;
  data.forEach((movie) => {
    rawHTML += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card" style="width: 100%">
          <img
            src="${POSTER_URL + movie.image}"
            class="card-img-top mx-auto"
            alt="movie poster"
          />
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
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
        </div>
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

movieContainer.addEventListener("click", (e) => {
  // check the click btn
  if (e.target.matches(".btn-show-movie")) {
    const movieTitle = document.querySelector("#movie-modal-title");
    const movieImgContainer = document.querySelector("#movie-modal-image");
    const movieRelease = document.querySelector("#movie-modal-date");
    const movieDescription = document.querySelector("#movie-modal-description");
    axios.get(INDEX_URL + String(e.target.dataset.id)).then((res) => {
      let { title, image, release_date, description } = res.data.results;
      console.log(title);
      console.log(release_date);
      console.log(description);

      movieTitle.textContent = title;
      movieImgContainer.src = POSTER_URL + image;
      movieDescription.textContent = description;
      movieRelease.textContent = "release date: " + release_date;

      // movieTitle.textContent =
    });

    console.log(e.target.dataset.id);
  }
});

getMovieData();
