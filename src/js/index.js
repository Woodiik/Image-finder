import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const { Notify } = require('notiflix');

const refs = {
  form: document.querySelector('.search-form'),
  searchBtn: document.querySelector('.submit-btn'),
  searchInput: document.querySelector('.search-input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onClick);

let page = 1;
let gallery = new SimpleLightbox('.gallery a');

async function onSubmit(e) {
  refs.loadMoreBtn.classList.remove('is-active');
  refs.gallery.innerHTML = '';
  e.preventDefault();
  if (refs.form.elements.searchQuery.value.trim() === '') {
    return;
  }
  page = 1;
  try {
    const { hits } = await fetchCards();
    if (hits.length === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    mapArrayAndRenderCards(hits);
    gallery.refresh();
    if (refs.gallery.childElementCount < 40) {
      Notify.info(
        `We load ${refs.gallery.childElementCount} photos, we haven't more about your request`
      );
    } else {
      Notify.success(
        `We load ${refs.gallery.childElementCount} photos. If u want more - press "Load more" under the gallary`
      );
    }
    refs.loadMoreBtn.classList.add('is-active');
  } catch (error) {
    Notify.failure(`Something was wrong, try again ||     ${error.message}`);
  }
}
async function onClick() {
  page += 1;
  try {
    const { hits } = await fetchCards();
    mapArrayAndRenderCards(hits);
    gallery.refresh();
    console.log(refs.gallery.childElementCount);
    if (refs.gallery.childElementCount >= 500) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      Notify.success(
        `"Hooray! We found ${refs.gallery.childElementCount} images."`
      );
    }
    refs.loadMoreBtn.classList.add('is-active');
  } catch (error) {
    Notify.failure(`Something was wrong, try again ||     ${error.message}`);
  }
}
async function fetchCards() {
  const API_KEY = '33842320-ed19ffa83cc28946150fb442a';
  const BASE_URL = 'https://pixabay.com/api/';
  const response = await fetch(
    `${BASE_URL}?key=${API_KEY}&q=${refs.searchInput.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  return await response.json();
}
function mapArrayAndRenderCards(array) {
  array.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      comments,
      views,
      downloads,
    }) => {
      renderCards({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        comments,
        views,
        downloads,
      });
    }
  );
}
function renderCards({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  comments,
  views,
  downloads,
}) {
  const markup = `<div class="photo-card"> 
  <a href="${largeImageURL}"><img class="card-img" src="${webformatURL}" alt="${tags}" title="" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</spa>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`;
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
