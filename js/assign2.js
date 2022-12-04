//localStorage.removeItem("songsAPIData");
let songsAPIDataString = localStorage.getItem("songsAPIData");
if (songsAPIDataString == null){ // API has not yet been fetched
   /* url of song api --- https versions hopefully a little later this semester */	
   //const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php'; //real API
   const api = 'js/sample-songs.json'; //testing API
   fetch(api)
   .then(response => {
      if(response.ok){
         return response.json()
      } 
      else {
         return Promise.reject({
            status: response.status,
            statusText: response.statusText
         });
      }
   })
   .then(data => {
      //let songsAPIDataArray = data; //unnecessary
      songsAPIDataString = JSON.stringify(data);
      localStorage.setItem("songsAPIData", songsAPIDataString);
      document.getElementById('logo').appendChild(document.createTextNode(" (fetching API)"));
      console.log("Fetching API");
   });
}else{
   document.getElementById('logo').appendChild(document.createTextNode(" (using existing data)"));
   console.log("Using existing data");
   console.log(songsAPIDataString);
}

/* Helper function to reduce clutter from writing document.getElementById() */
function getById(selectID){
   return document.getElementById(selectID);
}
function query(selectElement){
   return document.querySelector(selectElement);
}
function queryAll(selectElement){
   return document.querySelectorAll(selectElement);
}
function makePNode(nodeText){
   let newElement = document.createElement("p");
   let newText = document.createTextNode(nodeText);
   newElement.appendChild(newText);
   return newElement;
}

/* Header navigation button functionality */
document.getElementById("header-search-button").addEventListener("mouseup", function(){
   visitPage("search-page-container");
});

document.getElementById("header-song-details-button").addEventListener("mouseup", function(){
   visitPage("song-details-page");
});

document.getElementById("header-playlist-button").addEventListener("mouseup", function(){
   visitPage("playlist-page");
});

function populateSearchBrowsePage(){
   let songsAPI = JSON.parse(songsAPIDataString);
   for(let apiSong of songsAPI){
      let resultsContainer = getById("browse-search-results");
      let thisRow = document.createElement("section");
      //let titleText = songsAPI[c].title;
      thisRow.appendChild(makePNode(apiSong.title));
      thisRow.appendChild(makePNode(apiSong.artist.name));
      thisRow.appendChild(makePNode(apiSong.year));
      thisRow.appendChild(makePNode(apiSong.genre.name));
      thisRow.appendChild(makePNode(apiSong.details.popularity));
      resultsContainer.appendChild(thisRow);
   }
}

populateSearchBrowsePage();
visitPage("search-page-container");

//visitSearchPage();

/* Visit page functions*/
/*
function visitSearchPage(){
   console.log("visitSearchPage");
   //Page visibility
   query(".search-page-container").classList.remove("hidden");
   query(".song-details-page").classList.add("hidden");
   query(".playlist-page").classList.add("hidden");
   //Active tab indicator
   getById("header-search-button").classList.add("header-button-current-page");
   getById("header-song-details-button").classList.remove("header-button-current-page");
   getById("header-playlist-button").classList.remove("header-button-current-page");
}
function visitSongDetailsPage(){
   console.log("visitSongDetailsPage");
   //Page visibility
   query(".search-page-container").classList.add("hidden");
   query(".song-details-page").classList.remove("hidden");
   query(".playlist-page").classList.add("hidden");
   //Active tab indicator
   getById("header-search-button").classList.remove("header-button-current-page");
   getById("header-song-details-button").classList.add("header-button-current-page");
   getById("header-playlist-button").classList.remove("header-button-current-page");
}
function visitPlaylistPage(){
   console.log("visitPlaylistPage");
   //Page visibility
   query(".search-page-container").classList.add("hidden");
   query(".song-details-page").classList.add("hidden");
   query(".playlist-page").classList.remove("hidden");
   //Active tab indicator
   getById("header-search-button").classList.remove("header-button-current-page");
   getById("header-song-details-button").classList.remove("header-button-current-page");
   getById("header-playlist-button").classList.add("header-button-current-page");
}
*/

function visitPage(pageName){
   pageName = "." + pageName.toString();
   query(".search-page-container").classList.add("hidden");
   query(".song-details-page").classList.add("hidden");
   query(".playlist-page").classList.add("hidden");
   query(pageName).classList.remove("hidden");
}

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/

