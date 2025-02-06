// Fetch API for navigation menu
fetch('https://pysoftware.com/v1/menu_items', {
  headers: {
    'X-API-KEY':'process.env.API_KEY' // Use environment variable to store API key
  }
})
.then(response => response.json())
.then(data => {
  const menuItems = data;
  const navMenu = document.getElementById('nav-menu');
  menuItems.forEach(item => {
    const menuItem = document.createElement('li');
    const menuItemLink = document.createElement('a');
    menuItemLink.href = item.href;
    menuItemLink.textContent = item.menu_item;
    menuItem.appendChild(menuItemLink);
    navMenu.appendChild(menuItem);
  });
})
.catch(error => {
  console.error('Error:', error);
  // Display an error message to the user
  const errorMessage = document.createElement('p');
  errorMessage.textContent = 'Error loading menu items';
  document.body.appendChild(errorMessage);
});

// Fetch API for address list
let currentPage = 1;
const addressesPerPage = 10;
let totalAddresses = 0;

function getAddressList() {
  fetch(`https://pysoftware.com/v1/address_inventory/${currentPage}`, {
    headers: {
      'X-API-KEY': process.env.API_KEY // Use environment variable to store API key
    }
  })
  .then(response => response.json())
  .then(data => {
    const addresses = data;
    const addressListBody = document.getElementById('address-list-body');
    addressListBody.innerHTML = '';
    addresses.forEach(address => {
      const addressRow = document.createElement('tr');
      const addressIdCell = document.createElement('td');
      addressIdCell.textContent = address.id;
      const addressFirstNameCell = document.createElement('td');
      addressFirstNameCell.textContent = address.first_name;
      const addressLastNameCell = document.createElement('td');
      addressLastNameCell.textContent = address.last_name;
      const addressStreetCell = document.createElement('td');
      addressStreetCell.textContent = address.street;
      const addressPostcodeCell = document.createElement('td');
      addressPostcodeCell.textContent = address.postcode;
      const addressStateCell = document.createElement('td');
      addressStateCell.textContent = address.state;
      const addressCountryCell = document.createElement('td');
      addressCountryCell.textContent = address.country;
      const addressActionsCell = document.createElement('td');
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = () => {
        // Edit address functionality
        const editAddressForm = document.createElement('form');
        editAddressForm.innerHTML = `
          <label for="first_name">First Name:</label>
          <input type="text" id="first_name" value="${address.first_name}">
          <label for="last_name">Last Name:</label>
          <input type="text" id="last_name" value="${address.last_name}">
          <label for="street">Street:</label>
          <input type="text" id="street" value="${address.street}">
          <label for="postcode">Postcode:</label>
          <input type="text" id="postcode" value="${address.postcode}">
          <label for="state">State:</label>
          <input type="text" id="state" value="${address.state}">
          <label for="country">Country:</label>
          <input type="text" id="country" value="${address.country}">
          <button type="submit">Save Changes</button>
        `;
        addressActionsCell.appendChild(editAddressForm);
        editAddressForm.onsubmit = (event) => {
          event.preventDefault();
          const updatedAddress = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            street: document.getElementById('street').value,
            postcode: document.getElementById('postcode').value,
            state: document.getElementById('state').value,
            country: document.getElementById('country').value,
          };
          // Update address API call
          fetch(`https://pysoftware.com/v1/address_inventory/${address.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': process.env.API_KEY // Use environment variable to store API key
            },
            body: JSON.stringify(updatedAddress),
          })
          .then(response => response.json())
          .then(data => {
            console.log('Address updated successfully');
            getAddressList();
          })
          .catch(error => {
            console.error('Error:', error);
          });
        };
      };
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => {
        // Delete address functionality
        fetch(`https://pysoftware.com/v1/address_inventory/${address.id}`, {
          method: 'DELETE',
          headers: {
            'X-API-KEY': process.env.API_KEY // Use environment variable to store API key
          },
        })
        .then(response => response.json())
        .then(data => {
          console.log('Address deleted successfully');
          getAddressList();
        })
        .catch(error => {
          console.error('Error:', error);
        });
      };
      addressActionsCell.appendChild(editButton);
      addressActionsCell.appendChild(deleteButton);
      addressRow.appendChild(addressIdCell);
      addressRow.appendChild(addressFirstNameCell);
      addressRow.appendChild(addressLastNameCell);
      addressRow.appendChild(addressStreetCell);
      addressRow.appendChild(addressPostcodeCell);
      addressRow.appendChild(addressStateCell);
      addressRow.appendChild(addressCountryCell);
      addressRow.appendChild(addressActionsCell);
      addressListBody.appendChild(addressRow);
    });
  })
  .catch(error => {
    console.error('Error:', error);
    // Display an error message to the user
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Error loading address list';
    document.body.appendChild(errorMessage);
  });
}

// Get total number of addresses
fetch('https://pysoftware.com/v1/customer_numbers', {
  headers: {
    'X-API-KEY': process.env.API_KEY // Use environment variable to store API key
  }
})
.then(response => response.json())
.then(data => {
  totalAddresses = data;
  getAddressList();
})
.catch(error => {
  console.error('Error:', error);
  // Display an error message to the user
  const errorMessage = document.createElement('p');
  errorMessage.textContent = 'Error loading total addresses';
  document.body.appendChild(errorMessage);
});

// Previous button click event
document.querySelector('.prev-btn').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    getAddressList();
  }
});

// Next button click event
document.querySelector('.next-btn').addEventListener('click', () => {
  if (currentPage < Math.ceil(totalAddresses / addressesPerPage)) {
    currentPage++;
    getAddressList();
  }
});

// Search button click event
document.getElementById('search-btn').addEventListener('click', () => {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const addressRows = document.querySelectorAll('.address-list table tbody tr');
  
  addressRows.forEach(row => {
    const firstName = row.children[1].textContent.toLowerCase();
    const lastName = row.children[2].textContent.toLowerCase();
    if (firstName.includes(searchTerm) || lastName.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// Initial call to get address list
getAddressList();

// Add active class to the current page link
const current = window.location.pathname;
const navLinks = document.querySelectorAll('#nav-menu a');

navLinks.forEach(link => {
  if (link.href === currentPage) {
    link.classList.add('active');
  }
});