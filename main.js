/* eslint-disable linebreak-style */
/* eslint-disable no-alert */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-expressions */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
function createDropdown(countriesData) {
  const dropdown = document.createElement('select');

  const defaultOption = document.createElement('option');
  defaultOption.text = 'Choose your Country';
  defaultOption.value = '';
  dropdown.appendChild(defaultOption);

  countriesData.forEach((country) => {
    const option = document.createElement('option');
    option.text = country.name.common;
    option.value = country.cca3;
    if (country.postalCode !== undefined) { option.dataset.zip = country.postalCode.regex; }
    dropdown.appendChild(option);
  });

  const dropdownContainer = document.getElementById('dropdown-container');
  dropdownContainer.appendChild(dropdown);
}

fetch('https://restcountries.com/v3.1/all')
  .then((response) => response.json())
  .then((data) => {
    createDropdown(data);
  })
  .catch((error) => {
    console.error('Error API:', error);
  });

const form = document.getElementById('form');
// const name = document.getElementById('name');

form.addEventListener('submit', (event) => {
  event.preventDefault();
});

const selectLanguage = document.getElementById('language');

selectLanguage.addEventListener('change', () => {
  const img = document.getElementById('flag');
  selectLanguage.value === 'EN'
    ? img.src = './images/uk.png'
    : img.src = './images/spain.png';
});

// Regex to all. Both passwords should be equals//
