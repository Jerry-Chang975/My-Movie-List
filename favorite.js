const BASE_URL = 'https://webdev.alphacamp.io/';
const INDEX_URL = BASE_URL + 'api/movies/';
const POSTER_URL = BASE_URL + '/posters/';

const favDataPanel = document.querySelector('#data-panel');
const pagination = document.querySelector('.pagination');
const colorSwitch = document.querySelector('#colorMode');
const renderSwitch = document.querySelector('#list-card-switch');

const PAGE_COUNT = 12;
const FIRST_PAGE = 1;
const favMovies = [];
let totalPages;

function cardRenderMode(data) {
  let rawHTML = ``;
  data.forEach((movie) => {
    if (!colorSwitch.checked) {
      rawHTML += `<div class="card m-3 bg-dark text-light" data-movie-id="${movie.id}">`;
    } else {
      rawHTML += `<div class="card m-3" data-movie-id="${movie.id}">`;
    }
    rawHTML += `
        <i class="heart fa fa-heart fa-lg m-2" data-movie-id="${movie.id}"></i>
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
    favDataPanel.innerHTML = rawHTML;
  } else {
    favDataPanel.innerHTML = '<h1>You do not have any favorite movie~~</h1>';
  }
}

function listRenderMode(data) {
  const favoriteList = JSON.parse(localStorage.getItem('favoriteMovie')) || [];
  favoriteList;
  let rawData = ``;
  data.forEach((movie) => {
    if (!colorSwitch.checked) {
      rawData += `
        <tr class="table-dark" data-movie-id="${movie.id}">
          <td><i class="heart fa fa-heart fa-lg m-2" data-movie-id="${movie.id}"></i></td>
          <td data-bs-toggle="modal" data-bs-target="#movie-modal" data-movie-id="${movie.id}">${movie.title}</td>
        </tr>
      `;
    } else {
      rawData += `
        <tr class="table-light" data-movie-id="${movie.id}">
          <td><i class="heart fa fa-heart fa-lg m-2" data-movie-id="${movie.id}"></i></td>
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
    favDataPanel.innerHTML = tableHTML;
  } else {
    favDataPanel.innerHTML = '<h1>You do not have any favorite movie~~</h1>';
  }
}

function renderMovieList(data) {
  switch (localStorage.getItem('renderMode')) {
    case 'card':
      cardRenderMode(data);
      break;
    case 'list':
      listRenderMode(data);
      break;
    default:
      cardRenderMode(data);
      localStorage.setItem('renderMode', 'card');
      break;
  }
}

function renderMovieModal(movieId) {
  // get elements which need to be updated
  const modalMovieTitle = document.querySelector('#modal-movie-title');
  const modalMovieImg = document.querySelector('#modal-movie-img');
  const modalMovieDetail = document.querySelector('#modal-movie-detail');

  // clear last movie detail
  modalMovieTitle.textContent = '';
  modalMovieImg.src = '';
  modalMovieDetail.innerHTML = '';
  // use origin movieList (faster)
  const movieDetail = favMovies.find((movie) => movie.id === movieId);
  modalMovieTitle.textContent = movieDetail.title;
  modalMovieImg.src = POSTER_URL + movieDetail.image;
  modalMovieDetail.innerHTML = `
  <p><em>release date: ${movieDetail.release_date}</em></p>
  <p>${movieDetail.description}</p>
`;
}

function renderPagination(curPage) {
  totalPages = Math.ceil(favMovies.length / PAGE_COUNT);
  rawHTML = ``;
  for (let i = 0; i < totalPages; i++) {
    if (i + 1 === curPage) {
      rawHTML += `
        <li class="page-item active">
          <a class="page-link" href="">${i + 1}</a>
        </li>
      `;
    } else {
      if (!colorSwitch.checked) {
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
  pagination.innerHTML = rawHTML;
}

function getFavoriteMovie() {
  favMovies.push(...JSON.parse(localStorage.getItem('favoriteMovie')));
}

function getPageMovieData(dataList, page) {
  return dataList.slice((page - 1) * PAGE_COUNT, page * PAGE_COUNT);
}

function removeFromFavorite(movieId) {
  // check id is existed or not
  const movieIndexInFav = favMovies.findIndex((movie) => movie.id === movieId);
  if (movieIndexInFav !== -1) {
    favMovies.splice(movieIndexInFav, 1);
  }
  localStorage.setItem('favoriteMovie', JSON.stringify(favMovies));
  // rerender
  setTimeout(() => {
    let curPage = parseInt(
      document.querySelector('.page-item.active').children[0].textContent
    );
    let curMovies = getPageMovieData(favMovies, curPage);
    if (!curMovies.length) {
      curPage -= 1;
      curMovies = getPageMovieData(favMovies, curPage);
    }
    renderMovieList(curMovies);
    renderPagination(curPage);
  }, 1000);
}

function movieCardEvent() {
  favDataPanel.addEventListener('click', (event) => {
    const movieId = parseInt(event.target.dataset.movieId);
    if (event.target.tagName === 'I') {
      event.target.classList.toggle('fa-heart-o');
      switch (localStorage.getItem('renderMode')) {
        case 'card':
          event.target.parentElement.classList.add('fade-out');
          break;
        case 'list':
          event.target.parentElement.parentElement.classList.add('fade-out');
          break;
      }
      removeFromFavorite(movieId);
    } else if (movieId) {
      renderMovieModal(movieId);
    }
  });
}

function paginationEvent(dataList) {
  pagination.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.tagName === 'A') {
      const curPage = parseInt(event.target.textContent);
      renderMovieList(getPageMovieData(dataList, curPage));
      renderPagination(curPage);
      renderModeEvent(dataList, curPage);
    }
  });
}

function renderModeEvent(dataList, curPage) {
  renderSwitch.addEventListener('click', (event) => {
    switch (event.target.dataset.renderMode) {
      case 'card':
        localStorage.setItem('renderMode', 'card');
        break;
      case 'list':
        localStorage.setItem('renderMode', 'list');
        break;
    }
    renderMovieList(getPageMovieData(dataList, curPage));
  });
}

function main() {
  if (localStorage.getItem('colorMode') === 'dark') {
    colorSwitch.click();
  }
  getFavoriteMovie();
  renderMovieList(getPageMovieData(favMovies, FIRST_PAGE));
  movieCardEvent();
  totalPages = Math.ceil(favMovies.length / PAGE_COUNT);
  renderPagination(FIRST_PAGE);
  paginationEvent(favMovies);
  renderModeEvent(favMovies, FIRST_PAGE);
}

colorSwitch.addEventListener('input', (event) => {
  const nav = document.querySelector('nav.navbar');
  const modal = document.querySelector('#modalColor');
  const cards = document.querySelectorAll('div.card');
  const pages = document.querySelectorAll('a.page-link');
  const body = document.querySelector('body');
  const trows = document.querySelectorAll('tr');

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
  if (!colorSwitch.checked) {
    localStorage.setItem('colorMode', 'dark');
  } else {
    localStorage.setItem('colorMode', 'light');
  }
});

main();
