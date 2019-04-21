// hkxx26 Country Lookup client/index.js

/* global gapi */

// Variable countryList storing the most recent JSON country data retrieved from server.
// Const authInstance storing the getAuthInstance from Google.
// Const serverURL storing the server URL.
let countryList;
let authInstance = false;
const serverURL = 'http://localhost:8080/';

// Retrieves ID Token.
const getIdToken = () => authInstance.currentUser.get().getAuthResponse().id_token;
// Retrieves user profile.
const getProfile = () => authInstance.currentUser.get().getBasicProfile();
// Returns boolean stating whether user is signed in or alerts the user if they are not.
const isSignedIn = () => (typeof authInstance.isSignedIn !== 'undefined') ? authInstance.isSignedIn.get() : alert('HTTP 401 Unauthorized Request - Please sign in to view account.');

// Displays an alert that alerts the user when the client can not connect to server.
const noConnection = () => {
  alert('HTTP 500 Internal Error - Error establishing server connection.');
};

// Function to sign out the user and clears the user card from the Accounts Page.
const signOut = () => {
  $('#content').html('');
  authInstance.signOut();
  authInstance = false;
};

// A template that creates the country cards.
const createCard = (data, i, favourite) => `<div class="card bg-light mb-3" id="${i}">
  <img src="${data.flag}" class="card-img-top" alt="...">
  <div class="card-header text-center">${data.name}</div>
  <div class="card-body text-center">
    <h5 class="card-title">Details</h5>
    <p class="card-text">Capital: ${data.capital}</p>
    <p class="card-text">Region: ${data.region}</p>
    <p class="card-text">Population: ${data.population}</p>
    <p class="card-text">Area: ${data.area} km²</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-info btn-sm">${favourite}</button>
  </div>
</div>`;

// Fetches the countries from the server and then Displays the country cards.
// No need for Catch statement as the promise failure is inside the .then .
const displayCountry = (element, favourite) => {
  $('#content').html('');
  fetch(serverURL + element)
    .then(resp => resp.json(), () => noConnection())
    .then((data) => {
      countryList = data;
      if ((countryList['message'] === "Not Found")) {
        alert('No Countries Found, Please Try Another Search Query.');
      }
      for (let i = 0; i < data.length; i++) {
        $('#content').append(createCard(data[i], i, favourite));
        (favourite === 'Add to favourites') ? addFavouriteEventListener(i) : deleteFavouriteEventListener(i);
      }
    }, () => alert('HTTP 204 No Content - No Favourite Countries. Please add a country to favourites to view.'))
};

// Function creates user card from template.
const createUserCard = profile => `<div class="card bg-light mb-3" id="${profile.getId()}">
  <div class="card-header text-center">${profile.getName()}</div>
  <div class="card-body text-center">
    <h5 class="card-title">Details</h5>
    <p class="card-text">Unique ID: ${profile.getId()}</p>
    <p class="card-text">Email: ${profile.getEmail()}</p>
  </div>
  <div class="card-footer">
   <button type="button" class="btn btn-warning">Sign Out</button>
  </div>
</div>`;

// Function which displays the user's card in the account section.
const DisplayUserCard = () => {
  $('#content').html('');
  if (isSignedIn()) {
    $('#content').append(createUserCard(getProfile()));
    document.getElementById(getProfile().getId()).addEventListener('click', () => signOut());
  }
};

// Button event listener for Account button on nav-bar.
document.getElementById('account').addEventListener('click', () => DisplayUserCard());

// Button event listener for My Favourite Countries button on nav-bar.
document.getElementById('favourites').addEventListener('click', () => {
  // Checks if user is signed in.
  if (isSignedIn()) {
    displayCountry(`favourites/${getIdToken()}`, 'Delete from favourites');
  }
});

// Button event listener to retrieve African Region Countries for the Africa button on nav-bar drop-down.
document.getElementById('africa').addEventListener('click', () => displayCountry('regions/Africa', 'Add to favourites'));

// Button event listener to retrieve American Region Countries for the American button on nav-bar drop-down.
document.getElementById('americas').addEventListener('click', () => displayCountry('regions/Americas', 'Add to favourites'));

// Button event listener to retrieve Asian Region Countries for the Asian button on nav-bar drop-down.
document.getElementById('asia').addEventListener('click', () => displayCountry('regions/Asia', 'Add to favourites'));

// Button event listener to retrieve European Region Countries for the Europe button on nav-bar drop-down.
document.getElementById('europe').addEventListener('click', () => displayCountry('regions/Europe', 'Add to favourites'));

// Button event listener to retrieve Oceanian Region Countries for the Oceania button on nav-bar drop-down.
document.getElementById('oceania').addEventListener('click', () => displayCountry('regions/Oceania', 'Add to favourites'));

// Button event listener to retrieve Search Query Countries for the Search button on nav-bar form.
document.getElementById('submit').addEventListener('click', () => displayCountry(`name/${document.getElementById('search').value}`, 'Add to favourites'));

// Button event listener to Sign-in user once Sign-In button is pressed.
document.getElementById('signIn').addEventListener('data-onsuccess', (googleUser) => onSignIn(googleUser));

// Adds event listener to each country card displayed on the regions / search tab with a 'click' callback to send a POST Request
// requesting to add the country to the users favourite countries if pressed. Also sends the users authentication token.
const addFavouriteEventListener = (id) => {
  document.getElementById(id).addEventListener('click', () => {
    // Checks if user is signed in.
    if (isSignedIn()) {
      // Retrieves Google Sign-in Token
      const idtoken = getIdToken();
      const data = countryList[id];
      // Sends the POST request with the user token and data to send (token, data respectively) in the POST request body.
      fetch(serverURL, {
        method: 'POST',
        body: JSON.stringify({
          idtoken,
          data,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => (res.status === 400) ? alert('HTTP 400 Unauthorized Request - Country Already in Favourites.') : res.json())
        .catch(() => noConnection());
    } else {
      alert('HTTP 401 Unauthorized Request - Please sign in to add to favourites.');
    }
  });
};

// Deletes HTML card element from Favourites section.
const removeElement = (elementId) => {
  // Removes an element from the document
  const element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
};

// Adds event listener to each country card displayed on the regions / search tab with a 'click' callback to send a DELETE Request
// requesting to delete a country from the users favourite countries if pressed. Also sends the users authentication token.
const deleteFavouriteEventListener = (id) => {
  document.getElementById(id).addEventListener('click', () => {
    // Checks if user is signed in.
    if (isSignedIn()) {
      // Retrieves Google Sign-in Token
      const idtoken = getIdToken();
      const data = countryList[id];
      // Sends the DELETE request with the user token and data to send (token, data respectively) in the DELETE request body.
      fetch(serverURL, {
        method: 'DELETE',
        body: JSON.stringify({
          idtoken,
          data,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())
      // Removes element from document.
        .then(() => removeElement(id))
        .catch(() => noConnection());
    } else {
      alert('HTTP 401 Unauthorized Request - Please sign in to delete from favourites.');
    }
  });
};

// Sends POST Request requesting to sign-up/login into the server. Also sends the users authentication token.
function onSignIn(googleUser) {
  authInstance = gapi.auth2.getAuthInstance();
  // Retrieves Google Sign-in Token
  const idtoken = googleUser.getAuthResponse().id_token;
  // Sends the POST request with the user token (idtoken) in the POST request body to sign-up/login into the server.
  fetch(`${serverURL}tokensignin`, {
    method: 'POST',
    body: `idtoken=${idtoken}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(res => res.json())
    .catch(() => alert('HTTP 401 Unauthorized Request - Invalid Credentials, Please sign-in again.'));
}