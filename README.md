# Table of Contents

1. [Country Lookup API](#Country Lookup API)

* 1.1. [Open Endpoints]()
* 1.2. [Endpoints that require Authentication]()
* 1.3. [Example JSON formatted response:]()

2. [Example Website](#Example Website)

* 2.1. [index.html]()
* 2.2. [index.js]()

The first half of the documentation will explain the Country Lookup API, The second half the Example Website. 

# Country Lookup API

The Country Lookup API mainly uses the data from the [Rest Countries RESTful API](http://restcountries.eu/#rest-countries) and the structure of the JSON responses produced by the server for the user is similar to the format in which Rest Countries makes responses.

Where full URLs are provided in responses they will be rendered as if the service is running on `'http://localhost:8080/'`.

The example server is stored in the files `server.js` and `app.js` and started using `'npm start'` and runs on the local machine on `PORT 8080`.
`app.js` exports the express `app` and the `server.js` file imports the `app` and starts the express server.

When running the server, due to external log-in verification using Google Sign-in; on server restart please reset the browser cache or log out before restarting the server since certain browsers (i.e. Safari) store login details and the user may appear to be signed in before they have signed up. This could cause the user to experience issues/bugs.

User account information is saved hence if a user signs out and logs back in there favourite countries list is preserved. This is because all data is preserved in memory.

Eslint tests are performed by the command `'npm run pretest'` & Jest Mocking tests `'npm test'`.
* Eslint is run using the `'eslint:recommended'` rules.
* Jest requires an internet connection for certain external tests fetching to the external API.

## Open Endpoints

Open endpoints require no Authentication.

* [Login]() : `POST /tokensignin` 
    * `Success: HTTP 201/200 (Created User/OK, Login)` `Failure: HTTP 401 (Incorrect Authentication Details)`
    * Handles Google Initial Login POST Request. The body of the request should contain the users Unique Google-Sign in token in the body of the request with the key `idtoken`. A Token can be acquired from the Google Sign-In it is the users unique: `id_token`. This will setup a new account for the user if one has not been created and login the user onto the example website. 

* [Get Regions]() : `GET /regions/:id`
    * `Success: HTTP 200 (OK)` `Failure: HTTP 400 (Bad Request)`
    * Handles GET Request requesting a specific Region's countries. Returns that regions countries. Requires a world country region in the URL. Examples include: `Africa`, `Americas`, `Asia`, `Europe`, `Oceania`.

* [Get Name]() : `GET /name/:id`
    * `Success: HTTP 200 (OK)` `Failure: HTTP 404 (Not Found)`
    * Handles GET Request Searching for a specific countries. Returns all countries that contain the letters in the query. Requires country name in the URL.

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the body of the request with the key `idtoken`. A Token can be acquired from the Google Sign-In it is the users unique: `id_token`.

### Account related

Endpoints for viewing and manipulating the Accounts features of the Authenticated User has permissions to access.

* [Get Favourite Countries]() : `GET /favourites/:token`
    * `Success: HTTP 200/204 (OK, Sent Favourite Countries/No Content)` `Failure: HTTP 401 (Incorrect Authentication Details)`
    * Handles GET Request requesting the user's favourite countries. Also checks the authentication of the User. Returns the user's favourite countries. Requires the users token in the URL.

* [Add Country]() : `POST /`
    * `Success: HTTP 200/400 (Ok, Added to Favourites/Already in Favourites)` `Failure: HTTP 401 (Incorrect Authentication Details)`
    * Handles POST Request requesting to add a country to the user's favourite countries. Also checks the user's authentication token. Adds the country requested to the user's favourite countries list. The parameters of the request should include in the body the users unique token as `idtoken` and the country data to be sent `data`. However, the example website only utilises `name`, `capital`, `region`, `population`, `area` and `flag`. Hence the Add Country POST requests only require those fields in the request data `object` in the request body. 

* [Delete Country]() : `DELETE /`
    * `Success: HTTP 200/400 (Ok, Deleted from Favourites/Not in Favourites)` `Failure: HTTP 401 (Incorrect Authentication Details)`
    * Handles DELETE Request requesting to delete a country from the user's favourite countries. Also checks the user's authentication token. Deletes the country requested from the user's favourite countries list. The parameters of the request should include in the body the users unique token as `idtoken` and the country data to be sent `data`. Unlike the Add Country POST requests, the Delete Country DELETE request only requires the field `name` in the request data `object` in the request body. 

## Example JSON formatted response:

```json
[
    {
        "name": "United Kingdom of Great Britain and Northern Ireland",
        "topLevelDomain": [
            ".uk"
        ],
        "alpha2Code": "GB",
        "alpha3Code": "GBR",
        "callingCodes": [
            "44"
        ],
        "capital": "London",
        "altSpellings": [
            "GB",
            "UK",
            "Great Britain"
        ],
        "region": "Europe",
        "subregion": "Northern Europe",
        "population": 65110000,
        "latlng": [
            54,
            -2
        ],
        "demonym": "British",
        "area": 242900,
        "gini": 34,
        "timezones": [
            "UTC-08:00",
            "UTC-05:00",
            "UTC-04:00",
            "UTC-03:00",
            "UTC-02:00",
            "UTC",
            "UTC+01:00",
            "UTC+02:00",
            "UTC+06:00"
        ],
        "borders": [
            "IRL"
        ],
        "nativeName": "United Kingdom",
        "numericCode": "826",
        "currencies": [
            {
                "code": "GBP",
                "name": "British pound",
                "symbol": "£"
            }
        ],
        "languages": [
            {
                "iso639_1": "en",
                "iso639_2": "eng",
                "name": "English",
                "nativeName": "English"
            }
        ],
        "translations": {
            "de": "Vereinigtes Königreich",
            "es": "Reino Unido",
            "fr": "Royaume-Uni",
            "ja": "イギリス",
            "it": "Regno Unito",
            "br": "Reino Unido",
            "pt": "Reino Unido",
            "nl": "Verenigd Koninkrijk",
            "hr": "Ujedinjeno Kraljevstvo",
            "fa": "بریتانیای کبیر و ایرلند شمالی"
        },
        "flag": "https://restcountries.eu/data/gbr.svg",
        "regionalBlocs": [
            {
                "acronym": "EU",
                "name": "European Union",
                "otherAcronyms": [],
                "otherNames": []
            }
        ],
        "cioc": "GBR"
    }
]
```

# Example Website

The example website is located in the `clients` folder. The client website consists of two files: `index.html` and `index.js`.

## index.html

index.html contains the html code for the example website. It has been checked and is Standards Compliant with HTML5. ([https://validator.w3.org/](https://validator.w3.org/))

When disconnected from the server the example website will display an alert: `HTTP 500 Internal Error - Error establishing server connection.`. Once the connection has been restored the website will continue to work normally.

### External dependencies 

index.html is a bare-bones HTML document that imports the following external dependencies:
* Bootstrap CSS
* Google Sign-in API
* jQuery first
* Popper.js
* Bootstrap JS
* And finally index.js

The Docs for Google's Sign-In: `https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin

### NavBar

index.html contains a Bootstrap component, the `Navbar`. It is responsive to different viewport sizes with a collapsible Navbar which turns into a hamburger. 

The Navbar includes the following options:

* [Account]()

    * The `Account` Navbar option displays the account information for the user. Producing a card with the user's information provided the user is signed in. 

    * An Alert: `HTTP 401 Unauthorized Request - Please sign in to view account.` will be displayed to the user if they have not logged in and try to access the `Account` section.

    * The user details include: `Name`, `Unique ID` (from Google Sign-in) and `Email`. The card also has a `sign out` button in the footer which would log out the user.

* [My Favourite Countries]()

    * The `My Favourite Countries` Navbar option displays the favourite countries saved by the user. Producing cards with all the user's favourites countries provided the user is signed in. 

    * An Alert: `HTTP 401 Unauthorized Request - Please sign in to view favourites.` will be displayed to the user if they have not logged in and try to access the `My Favourite Countries` section.

    * An Alert: `HTTP 204 No Content - No Favourite Countries. Please add a country to favourites to view.` will be displayed to the user if they have logged in and have not added any countries to there favourite countries.

* [Regions]()

    * The `Regions` Navbar option features a drop-down options list containing all the regions in the world including: `Africa`, `Americas`, `Asia`, `Europe`, `Oceania`. The option chosen will produce cards displaying all the countries within that region.

    * This option does not require authentication/the user to be signed in.

* [Search]()

    * The `Search` Navbar option features a form and a search button. Once search is pressed it will return all country cards which include the string inputted into the form.

    * An Alert: `No Countries Found, Please Try Another Search Query.` will be displayed to the user if no countries are found with the query given by the user.

    * This option does not require authentication/the user to be signed in.

* [Sign-in]()

    * The `Sign-in` Navbar option will display a pop up linking to Google's Sign-In page where the user will login with there google account. 

    * This will log in a user into our server (or create a user account if it is the first time a user is logging into the server). 

### Main Content

`<div class="card-columns" id="content"></div>`

The main `content` div class is a bootstrap `Card Columns` component. `index.js` dynamically loads content into this div.

Country cards are displayed in the div displaying each of the country details. If the country is already in the user's favourites or if the user is not signed-in when attempting to add a country to favourites the following alerts are displayed to the user (respectively): `HTTP 400 Unauthorized Request - Country Already in Favourites.` and `HTTP 401 Unauthorized Request - Please sign in to add to favourites.`.
            
## index.js

index.js contains the js code for the example website.

### Variable / Consts

* [countryList]() : `Variable` storing the most recent JSON country data retrieved from server.

* [authInstance]() : `Const` storing the getAuthInstance from Google.

* [serverURL]() : `='http://localhost:8080/'` `Const` storing the server URL.

### Get Functions

* [getIdToken]() : `Function` returning the ID Token.

* [getProfile]() : `Function` returning the user profile.

* [isSignedIn]() : `Function` returns boolean stating whether user is signed in or alerts the user if they are not. `HTTP 401 Unauthorized Request - Please sign in to view account.`

### Functions / Templates

* [noConnection]() : Displays an alert that alerts the user when the client can not connect to the server. alert: `HTTP 500 Internal Error - Error establishing server connection.`

* [signOut]() : Function to sign out the user and clears the user card from the Accounts Page.

* [createCard]() : A template that creates the country cards.

* [displayCountry]() : Fetches the countries from the server and then Displays the country cards.

* [createUserCard]() : Function creates user card from template.

* [DisplayUserCard]() : Function which displays the user's card in the account section.

### Button Event Listeners

E.g. `document.getElementById('#ElementID').addEventListener('click', ... `

* [account]() : Button event listener for `Account` button on nav-bar.

* [favourites]() : Button event listener for `My Favourite Countries` button on nav-bar.

* [africa]() : Button event listener to retrieve African Region Countries for the `Africa` button on nav-bar drop-down.

* [americas]() : Button event listener to retrieve American Region Countries for the `American` button on nav-bar drop-down.

* [asia]() : Button event listener to retrieve Asian Region Countries for the `Asian` button on nav-bar drop-down.

* [europe]() : Button event listener to retrieve European Region Countries for the `Europe` button on nav-bar drop-down.

* [oceania]() : Button event listener to retrieve Oceanian Region Countries for the `Oceania` button on nav-bar drop-down.

* [submit]() : Button event listener to retrieve Search Query Countries for the `Search` button on nav-bar form.

* [signIn]() : Button event listener to Sign-in user once `Sign-In` button is pressed.

### POST / DELETE Requests

* [addFavouriteEventListener]() : Adds event listener to each country card displayed on the regions/search tab with a `click` callback to send a POST Request requesting to add the country to the user's favourite countries if pressed. Also sends the user's authentication token.

* [removeElement]() : Deletes HTML card element from Favourites section.

* [deleteFavouriteEventListener]() : Adds event listener to each country card displayed on the regions/search tab with a `click` callback to send a DELETE Request requesting to delete a country from the user's favourite countries if pressed. Also sends the user's authentication token.

* [onSignIn]() : Sends POST Request requesting to sign-up/login into the server. Also sends the user's authentication token. alerts the user with: `HTTP 401 Unauthorized Request - Invalid Credentials, Please sign-in again.` if invalid credentials are entered.