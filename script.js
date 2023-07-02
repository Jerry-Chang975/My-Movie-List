const BASE_URL = 'https://webdev.alphacamp.io/';
const INDEX_URL = BASE_URL + 'api/movies/';
const POSTER_URL = BASE_URL + '/posters/';

const PAGE_COUNT = 20;
const FIRST_PAGE = 1;

const views = {
  dataPanel: document.querySelector('#data-panel'),
  searchInput: document.querySelector('#movie-search-input'),
  pagination: document.querySelector('.pagination'),
  colorSwitch: document.querySelector('#colorMode'),
  renderSwitch: document.querySelector('#list-card-switch'),

  cardRenderMode(dataList) {
    const favoriteList =
      JSON.parse(localStorage.getItem('favoriteMovie')) || [];
    favoriteList;
    let rawHTML = ``;
    dataList.forEach((movie) => {
      if (!this.colorSwitch.checked) {
        rawHTML += `
      <div class="card m-3 bg-dark text-light" data-movie-id="${movie.id}">
    `;
      } else {
        rawHTML += `
      <div class="card m-3" data-movie-id="${movie.id}">
    `;
      }

      if (favoriteList.some((favMovie) => favMovie.id === movie.id)) {
        rawHTML += `
          <i class="heart fa fa-heart fa-lg m-2" data-movie-id="${movie.id}"></i>
        `;
      } else {
        rawHTML += `
          <i class="heart fa fa-heart-o fa-heart fa-lg m-2" data-movie-id="${movie.id}"></i>
        `;
      }

      rawHTML += ` 
        <div class="card-body" data-bs-toggle="modal" data-bs-target="#movie-modal" data-movie-id="${
          movie.id
        }">
          <img src="${
            POSTER_URL + movie.image
          }" class="card-img-top" alt="movie image" data-movie-id="${movie.id}">
          <p class="card-title text-center" data-movie-id="${movie.id}">${
        movie.title
      }</p>
        </div>
      </div>
    `;
    });
    if (rawHTML) {
      this.dataPanel.innerHTML = rawHTML;
    } else {
      this.dataPanel.innerHTML = '<h1>Not found !</h1>';
    }
  },
  listRenderMode(dataList) {
    const favoriteList =
      JSON.parse(localStorage.getItem('favoriteMovie')) || [];
    favoriteList;
    let rawData = ``;
    dataList.forEach((movie) => {
      let heartIcon;
      if (favoriteList.some((favMovie) => favMovie.id === movie.id)) {
        heartIcon = `
        <i class="heart fa fa-heart fa-lg m-2" data-movie-id="${movie.id}"></i>
      `;
      } else {
        heartIcon = `
        <i class="heart fa fa-heart-o fa-heart fa-lg m-2" data-movie-id="${movie.id}"></i>
      `;
      }
      if (!this.colorSwitch.checked) {
        rawData += `
        <tr class="table-dark" data-movie-id="${movie.id}">
          <td>${heartIcon}</td>
          <td data-bs-toggle="modal" data-bs-target="#movie-modal" data-movie-id="${movie.id}">${movie.title}</td>
        </tr>
      `;
      } else {
        rawData += `
        <tr class="table-light" data-movie-id="${movie.id}">
          <td>${heartIcon}</td>
          <td data-bs-toggle="modal" data-bs-target="#movie-modal" data-movie-id="${movie.id}">${movie.title}</td>
        </tr>
      `;
      }
    });
    let tableHTML = `
    <table class="table table-striped table-hover">
      <tbody>
        ${rawData}
      </tbody>
    </table>
  `;
    if (rawData) {
      this.dataPanel.innerHTML = tableHTML;
    } else {
      this.dataPanel.innerHTML = '<h1>Not found !</h1>';
    }
  },
  renderMovieList(data) {
    switch (localStorage.getItem('renderMode')) {
      case 'card':
        this.cardRenderMode(data);
        break;
      case 'list':
        this.listRenderMode(data);
        break;
      default:
        this.cardRenderMode(data);
        localStorage.setItem('renderMode', 'card');
        break;
    }
  },
  renderMovieModal(movieId) {
    // get elements which need to be updated
    const modalMovieTitle = document.querySelector('#modal-movie-title');
    const modalMovieImg = document.querySelector('#modal-movie-img');
    const modalMovieDetail = document.querySelector('#modal-movie-detail');

    // clear last movie detail
    modalMovieTitle.textContent = '';
    modalMovieImg.src = '';
    modalMovieDetail.innerHTML = '';
    // use origin movieList (faster)
    const movieDetail = models.movieList[movieId - 1];
    modalMovieTitle.textContent = movieDetail.title;
    modalMovieImg.src = POSTER_URL + movieDetail.image;
    modalMovieDetail.innerHTML = `
      <p><em>release date: ${movieDetail.release_date}</em></p>
      <p>${movieDetail.description}</p>
    `;
  },
  renderPagination(dataList, curPage) {
    totalPages = Math.ceil(dataList.length / PAGE_COUNT);
    rawHTML = ``;
    for (let i = 0; i < totalPages; i++) {
      if (i + 1 === curPage) {
        rawHTML += `
          <li class="page-item active">
            <a class="page-link" href="">${i + 1}</a>
          </li>
        `;
      } else {
        if (!this.colorSwitch.checked) {
          rawHTML += `
          <li class="page-item">
            <a class="page-link dark-bg" href="">${i + 1}</a>
          </li>`;
        } else {
          rawHTML += `
          <li class="page-item">
            <a class="page-link" href="">${i + 1}</a>
          </li>`;
        }
      }
    }
    this.pagination.innerHTML = rawHTML;
  },
  renderColorSwitch() {
    const nav = document.querySelector('nav.navbar');
    const modal = document.querySelector('#modalColor');
    const cards = document.querySelectorAll('div.card');
    const pages = document.querySelectorAll('a.page-link');
    const trows = document.querySelectorAll('tr');
    const body = document.querySelector('body');
    body.classList.toggle('dark-bg');
    nav.classList.toggle('navbar-dark');
    nav.classList.toggle('bg-dark');
    modal.classList.toggle('bg-dark');
    modal.classList.toggle('text-light');
    cards.forEach((card) => {
      card.classList.toggle('bg-dark');
      card.classList.toggle('text-light');
    });
    pages.forEach((page) => {
      page.classList.toggle('dark-bg');
    });
    trows.forEach((tr) => {
      tr.classList.toggle('table-dark');
      tr.classList.toggle('table-light');
    });

    // save to localStorage
    if (!views.colorSwitch.checked) {
      localStorage.setItem('colorMode', 'dark');
    } else {
      localStorage.setItem('colorMode', 'light');
    }
  },
};

const controllers = {
  async fetchMoviesData() {
    // get movie data
    const res = await axios.get(INDEX_URL);
    models.movieList.push(...res.data.results);
    models.totalPages = Math.ceil(models.movieList.length / PAGE_COUNT);
  },
  getPageMovieData(dataList, page) {
    return dataList.slice((page - 1) * PAGE_COUNT, page * PAGE_COUNT);
  },
  addToFavorite(movieId) {
    // check id is existed or not
    const favoriteList =
      JSON.parse(localStorage.getItem('favoriteMovie')) || [];
    const favMovie = models.movieList.find((movie) => movie.id === movieId);
    const movieIndexInFav = favoriteList.findIndex(
      (movie) => movie.id === favMovie.id
    );
    if (movieIndexInFav === -1) {
      favoriteList.push(favMovie);
    } else {
      favoriteList.splice(movieIndexInFav, 1);
    }
    localStorage.setItem('favoriteMovie', JSON.stringify(favoriteList));
  },
  searchMovieList(keyword, dataList) {
    return dataList.filter((element) => {
      let movieName = element.title;
      return movieName.toLowerCase().includes(keyword.toLowerCase());
    });
  },

  // events
  movieCardEvent() {
    views.dataPanel.addEventListener('click', (event) => {
      const movieId = parseInt(event.target.dataset.movieId);
      if (event.target.tagName === 'I') {
        event.target.classList.toggle('fa-heart-o');

        switch (localStorage.getItem('renderMode')) {
          case 'card':
            event.target.parentElement.classList.add('shock');
            break;
          case 'list':
            event.target.parentElement.parentElement.classList.add('shock');
            break;
        }
        this.addToFavorite(movieId);
      }
      if (movieId) {
        views.renderMovieModal(movieId);
      }
    });
    views.dataPanel.addEventListener('animationend', (event) => {
      if (
        event.target.classList.contains('card') ||
        event.target.tagName === 'TR'
      ) {
        event.target.classList.remove('shock');
      }
    });
  },
  searchEvent() {
    // add search funciton
    // 1. get the keyword from input tag
    // 2. search btn event toggle search function
    // 3. traverse the movieList content which matched keyword
    // 4. rerender the page
    views.searchInput.addEventListener('input', (event) => {
      // get input keywords
      const keyword = event.target.value.trim();
      // filter the movies
      const searchList = this.searchMovieList(keyword, models.movieList);
      models.totalPages = Math.ceil(searchList.length / PAGE_COUNT);
      // rerender the page
      views.renderMovieList(this.getPageMovieData(searchList, FIRST_PAGE));
      views.renderPagination(searchList, FIRST_PAGE);
      this.paginationEvent(searchList);
      this.renderModeEvent(searchList, FIRST_PAGE);
    });
  },
  paginationEvent(dataList) {
    views.pagination.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.tagName === 'A') {
        const curPage = parseInt(event.target.textContent);
        views.renderMovieList(this.getPageMovieData(dataList, curPage));
        views.renderPagination(dataList, curPage);
        this.renderModeEvent(dataList, curPage);
      }
    });
  },
  renderModeEvent(dataList, curPage) {
    views.renderSwitch.addEventListener('click', (event) => {
      switch (event.target.dataset.renderMode) {
        case 'card':
          localStorage.setItem('renderMode', 'card');
          break;
        case 'list':
          localStorage.setItem('renderMode', 'list');
          break;
      }
      views.renderMovieList(this.getPageMovieData(dataList, curPage));
    });
  },
};

const models = {
  movieList: [],
  totalPages: 0,
};

async function main() {
  // color mode
  views.colorSwitch.addEventListener('input', views.renderColorSwitch);
  if (localStorage.getItem('colorMode') === 'dark') {
    views.colorSwitch.click();
  }
  await controllers.fetchMoviesData();
  // render movie
  views.renderMovieList(
    controllers.getPageMovieData(models.movieList, FIRST_PAGE)
  );

  // pagination
  views.renderPagination(models.movieList, FIRST_PAGE);
  controllers.paginationEvent(models.movieList, models.totalPages);

  // search event
  controllers.searchEvent();

  // add show movie event
  controllers.movieCardEvent();

  // add movie render mode event
  controllers.renderModeEvent(
    controllers.getPageMovieData(models.movieList, FIRST_PAGE),
    FIRST_PAGE
  );
}

main();
