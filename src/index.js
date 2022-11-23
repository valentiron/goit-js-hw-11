import fetchImg from './js/API.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.search-form__input'),
  search: document.querySelector('#search-form button'),
  gallery: document.querySelector('.gallery'),
  moreBtn: document.querySelector('.load-more'),
};

let lightboxGallery = new SimpleLightbox('.gallery a');

refs.moreBtn.style.display = 'none';
let pageNumber = 1;

refs.form.addEventListener('submit', onSubmit);
refs.moreBtn.addEventListener('click', onLoadMore);

function onSubmit(event) {
  event.preventDefault();
  clearImages();

  const neededData = refs.input.value.trim();
  if (neededData) {
    fetchImg(neededData, pageNumber).then(dataFound => {
      if (!dataFound.hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        createImgList(dataFound.hits);
        Notify.success(
          `Hooray! We found ${dataFound.totalHits} images.`
        );
        refs.moreBtn.style.display = 'block';
        lightboxGallery.refresh();
      }
    });
  }
}

function onLoadMore() {
  pageNumber++;
  const neededData = refs.input.value.trim();
  refs.moreBtn.style.display = 'none';
  fetchImg(neededData, pageNumber).then(dataFound => {
    if (!dataFound.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createImgList(dataFound.hits);
      Notify.success(
        `Hooray! We found ${dataFound.totalHits} images.`
      );
      refs.moreBtn.style.display = 'block';
      lightboxGallery.refresh();
    }
  });
}

function createImgList(images) {
  console.log(images, 'images');
  const markup = images
    .map(image => {
      console.log('img', image);
      return `<div class="photo-box">
       <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
        <div class="info-box">
           <p class="info-text">
    <b>Likes</b> <span class="info-backend"> ${image.likes} </span>
</p>
            <p class="info-text">
                <b>Views</b> <span class="info-backend">${image.views}</span>  
            </p>
            <p class="info-text">
                <b>Comments</b> <span class="info-backend">${image.comments}</span>  
            </p>
            <p class="info-text">
                <b>Downloads</b> <span class="info-backend">${image.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
  refs.gallery.innerHTML += markup;
}

function clearImages() {
    refs.gallery.innerHTML = '';
    pageNumber = 1;
    refs.moreBtn.style.display = 'none';
}