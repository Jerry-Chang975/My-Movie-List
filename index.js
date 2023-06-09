const BASE_URL = 'https://webdev.alphacamp.io/';
const INDEX_URL = BASE_URL + 'api/movies/';
const POSTER_URL = BASE_URL + '/posters/';
const movieList = [];

axios
  .get(BASE_URL + 'movies')
  .then((res) => {
    movieList.push(...res.data.results);
    console.log(movieList);
  })
  .catch((e) => {
    console.log(e);
  });
