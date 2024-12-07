import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const catInfo = document.querySelector('.cat-info');

function initializeSlimSelect() {
  console.log('Initializing SlimSelect');
  new SlimSelect({
    select: breedSelect,
    settings: {
      showSearch: false,
      closeOnSelect: true,
      openPosition: 'auto',
      placeholderText: 'Select a breed',
    },
    events: {
      afterOpen: () => {
        const list = document.querySelector('.ss-list');
        list.style.maxHeight = '200px';
        list.style.overflowY = 'auto';
      }
    }
  });
}

function showLoader() {
  console.log('Showing loader');
  loader.style.display = 'block';
}

function hideLoader() {
  console.log('Hiding loader');
  loader.style.display = 'none';
}

function showError(message) {
  console.log('Showing error:', message);
  Notiflix.Notify.failure(message);
  document.querySelector('.error').style.display = 'block';
}

function hideError() {
  console.log('Hiding error');
  document.querySelector('.error').style.display = 'none';
}

function populateBreeds() {
  console.log('Populating breeds');
  showLoader();
  hideError();
  breedSelect.style.display = 'none';
  fetchBreeds()
    .then(breeds => {
      console.log('Number of breeds fetched:', breeds.length);
      breedSelect.innerHTML = breeds.map(breed => 
        `<option value="${breed.id}">${breed.name}</option>`
      ).join('');
      breedSelect.style.display = 'block';
      initializeSlimSelect();
    })
    .catch(err => {
      showError('Error loading breeds');
      console.error('Error loading breeds:', err);
    })
    .finally(() => {
      hideLoader();
    });
}

function showCatInfo(breedId) {
  console.log('Showing cat info for breed ID:', breedId);
  showLoader();
  hideError();
  catInfo.style.display = 'none';
  fetchCatByBreed(breedId)
    .then(cat => {
      console.log('Cat data:', cat);
      if (!cat || !cat.breeds || cat.breeds.length === 0) {
        showError('No breed information available');
        return;
      }
      const { breeds, url } = cat;
      const { name, description, temperament } = breeds[0];
      catInfo.innerHTML = `
        <img src="${url}" alt="${name}">
        <h2>${name}</h2>
        <p>${description}</p>
        <p><strong>Temperament:</strong> ${temperament}</p>
      `;
      catInfo.style.display = 'block';
    })
    .catch(err => {
      showError('Error loading cat info');
      console.error('Error loading cat info:', err);
    })
    .finally(() => {
      hideLoader();
    });
}

breedSelect.addEventListener('change', (e) => {
  const breedId = e.target.value;
  console.log('Selected breed ID:', breedId);
  showCatInfo(breedId);
});

window.addEventListener('load', populateBreeds);
