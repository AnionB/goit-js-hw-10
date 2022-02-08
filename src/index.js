import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountry from './fetchCountries';
const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const deboncedInput = debounce(onInput, DEBOUNCE_DELAY);

function onInput(evt) {
  const inputValue = evt.target.value.trim();
  if (inputValue) {
    tryFetch(inputValue);
  } else clearDisplay();
}
function clearDisplay() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function tryFetch(value) {
  fetchCountry(value)
    .then(response => {
      return response.json();
    })
    .then(countries => {
      if (countries.status === 404) {
        Notify.failure('Oops, there is no country with that name');
        clearDisplay();
        return;
      }

      displaySearchResult(countries);
    })
    .catch(message => {
      console.log(message);
    });
}
function displaySearchResult(resultArray) {
  if (resultArray.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    clearDisplay();
    return;
  }
  if (resultArray.length === 1) {
    console.log();
    refs.countryList.innerHTML = '';
    displayCountry(resultArray);
    return;
  }
  refs.countryInfo.innerHTML = '';
  displayCountriesList(resultArray);
}

function displayCountriesList(resultArray) {
  const countriesList = resultArray
    .map(country => {
      return `<li><img src="${country.flags.svg}" alt="${country.name}" width="100px">
        <p>${country.name}</p>
      </li>`;
    })
    .join('');
  refs.countryList.innerHTML = countriesList;
}

function displayCountry(country) {
  const countryItem = ` <h1><img src="${country[0].flags.svg}"  alt="${country[0].name}" width="100px" >${country[0].name}</h1><p>Capital:${country[0].capital}</p><p>Population:${country[0].population}</p><p>Language:${country[0].languages[0].name}</p>`;
  refs.countryInfo.innerHTML = countryItem;
}

refs.input.addEventListener('input', deboncedInput);
