/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable linebreak-style */
/* eslint-disable no-alert */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-expressions */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
function createDropdown(countriesData) {
  const dropdown = document.createElement('select');
  dropdown.name = 'select-country';
  dropdown.id = 'select-country';

  const defaultOption = document.createElement('option');
  defaultOption.text = 'Choose your Country';
  defaultOption.value = '';
  dropdown.appendChild(defaultOption);

  countriesData.forEach((country) => {
    const option = document.createElement('option');
    option.text = country.name.common;
    option.value = country.cca3;
    if (country.postalCode !== undefined) {
      option.dataset.zip = country.postalCode.regex;
      option.dataset.format = country.postalCode.format;
    }
    dropdown.appendChild(option);
  });

  const dropdownContainer = document.getElementById('dropdown-container');
  dropdownContainer.appendChild(dropdown);
}

function hasError(field) {
  // Don't validate submits, buttons, file and reset inputs, and disabled fields
  if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;
  // Get validity
  const { validity } = field;

  // If valid, return null
  if (validity.valid) return;

  // If field is required and empty
  if (validity.valueMissing) return 'Please fill out this field.';

  // If not the right type
  if (validity.typeMismatch) {
    // Email
    if (field.type === 'email') return 'Please enter an email address.';

    // URL
    if (field.type === 'url') return 'Please enter a URL.';
  }

  // If too short
  if (validity.tooShort) return `Please lengthen this text to ${field.getAttribute('minLength')} characters or more. You are currently using ${field.value.length} characters.`;

  // If too long
  if (validity.tooLong) return `Please shorten this text to no more than ${field.getAttribute('maxLength')} characters. You are currently using ${field.value.length} characters.`;

  // If number input isn't a number
  if (validity.badInput) return 'Please enter a number.';

  // If a number value doesn't match the step interval
  if (validity.stepMismatch) return 'Please select a valid value.';

  // If a number field is over the max
  if (validity.rangeOverflow) return `Please select a value that is no more than ${field.getAttribute('max')}.`;

  // If a number field is below the min
  if (validity.rangeUnderflow) return `Please select a value that is no less than ${field.getAttribute('min')}.`;

  // If pattern doesn't match
  if (validity.patternMismatch) {
    // If pattern info is included, return custom error
    if (field.type === 'password') return 'Should Have an UpperCase, LowerCase, Number and Special Character';
    if (field.hasAttribute('title')) return field.getAttribute('title');

    // Otherwise, generic error
    return 'Please match the requested format.';
  }

  // If all else fails, return a generic catchall error
  return 'The value you entered for this field is invalid.';
}

function showError(field, error) {
  // Add error class to field
  field.classList.add('error');

  // Get field id or name
  const id = field.id || field.name;
  if (!id) return;

  // Check if error message field already exists
  // If not, create one
  let message = field.form.querySelector(`.error-message#error-for-${id}`);
  if (!message) {
    message = document.createElement('div');
    message.className = 'error-message';
    message.id = `error-for-${id}`;
    field.parentNode.insertBefore(message, field.nextSibling);
  }

  // Add ARIA role to the field
  field.setAttribute('aria-describedby', `error-for-${id}`);

  // Update error message
  message.innerHTML = error;

  // Show error message
  message.style.display = 'block';
  message.style.visibility = 'visible';
}

function removeError(field) {
  field.classList.remove('error');

  // Remove ARIA role from the field
  field.removeAttribute('aria-describedby');

  // Get field id or name
  const id = field.id || field.name;
  if (!id) return;

  // Check if an error message is in the DOM
  const message = field.form.querySelector(`.error-message#error-for-${id}`);
  if (!message) return;

  // If so, hide it
  message.innerHTML = '';
  message.style.display = 'none';
  message.style.visibility = 'hidden';
}

function checkPasswords() {
  const password = document.getElementById('password');
  const secondPassword = document.getElementById('repeat-password');
  if (password.validity.valid && secondPassword.validity.valid) {
    if (password.value !== secondPassword.value) {
      showError(password, 'Passwords are not equal');
    }
  }
}

fetch('https://restcountries.com/v3.1/all')
  .then((response) => response.json())
  .then((data) => {
    createDropdown(data);
  })
  .catch((error) => {
    console.error('Error API:', error);
  });

const selectLanguage = document.getElementById('language');
selectLanguage.addEventListener('change', () => {
  const img = document.getElementById('flag');
  selectLanguage.value === 'EN'
    ? img.src = './images/uk.png'
    : img.src = './images/spain.png';
});

const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
});

const forms = document.querySelectorAll('form');

for (let i = 0; i < forms.length; i++) {
  forms[i].setAttribute('novalidate', true);
}

document.addEventListener('blur', (event) => {
  const error = hasError(event.target);
  if (error) {
    showError(event.target, error);
  } else {
    removeError(event.target);
  }
  checkPasswords();
}, true);
document.addEventListener('submit', (event) => {
  // Get all of the form elements
  const fields = event.target.elements;

  // Validate each field
  // Store the first field with an error to a variable so we can bring it into focus later
  let error; let
    hasErrors;
  for (let i = 0; i < fields.length; i++) {
    error = hasError(fields[i]);
    if (error) {
      showError(fields[i], error);
      if (!hasErrors) {
        hasErrors = fields[i];
      }
    }
  }

  // If there are errrors, don't submit form and focus on first element with error
  if (hasErrors) {
    event.preventDefault();
    hasErrors.focus();
  }
  checkPasswords();
}, false);

const dropdownContainer = document.getElementById('dropdown-container');

dropdownContainer.addEventListener('change', () => {
  dropdownContainer.style.border = '2px solid green';
  const select = document.getElementById('select-country');
  const zip = document.getElementById('zip');
  const { selectedIndex } = select;
  const selectedOption = select.options[selectedIndex];
  if (selectedOption.dataset.zip && selectedOption.dataset.format) {
    zip.placeholder = `${selectedOption.innerHTML} Zip Code: ${selectedOption.dataset.format}`;
    zip.pattern = selectedOption.dataset.regex;
  } else {
    zip.placeholder = 'Zip Code';
    zip.removeAttribute('pattern');
  }
});
