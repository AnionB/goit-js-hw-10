import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

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
    // console.log(inputValue);
    fetchCountry(inputValue);
  } else refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function fetchCountry(value) {
  fetch(
    ` https://restcountries.com/v3.1/name/${value}?fields=name,capital,population,flags,languages`,
  )
    .then(response => {
      if (response.status === 404) {
        Notify.failure('Oops, there is no country with that name');
        throw error;
      }
      return response.json();
    })
    .then(countries => {
      console.log('then');
      //   console.log(countries);
      displaySearchResult(countries);
    })
    .catch(message => {
      console.dir(message);
    });
}

function displaySearchResult(resultArray) {
  //   console.log(resultArray.length);
  if (resultArray.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (resultArray.length === 1) {
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
      return `<li><img src="${country.flags.svg}" alt="${country.name.common}" width="100px">
        <p>${country.name.official}</p>
      </li>`;
    })
    .join('');
  refs.countryList.innerHTML = countriesList;
}

function displayCountry(country) {
  //   console.log(country[0].capital);

  const countryItem = ` <h1><img src="${country[0].flags.svg}"  alt="${country[0].name.common}" width="100px" >${country[0].name.official}</h1><p>Capital:${country[0].capital[0]}</p><p>Population:${country[0].population}</p><p>Language:${country[0].name.language}</p>`;
  //   console.log(countryItem);
  refs.countryInfo.innerHTML = countryItem;
}

refs.input.addEventListener('input', deboncedInput);
