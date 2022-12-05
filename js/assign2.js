//localStorage.removeItem("songsAPIData");

let songsAPI; //Array containing all song / artist / genre information
let browserResults; //Array containing song / artist / genre information from search
let lastListRowColorOne = false;

initializeAPI();
initializeButtons();
refreshSearchBrowsePage(0, '');
visitPage("search-page-container");


/* Helper functions to reduce clutter
*/
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

function initializeAPI() {
   let songsAPIDataString = localStorage.getItem("songsAPIData");
   if (songsAPIDataString == null) { // API has not yet been fetched
      /* url of song api --- https versions hopefully a little later this semester */
      //const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php'; //real API
      const api = 'js/sample-songs.json'; //testing API
      fetch(api)
         .then(response => {
            if (response.ok) {
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
            songsAPIDataString = JSON.stringify(data);
            localStorage.setItem("songsAPIData", songsAPIDataString);
            document.getElementById('logo').appendChild(document.createTextNode(" (fetching API)"));
            console.log("Fetching API");
         });
   } 
   else {
      document.getElementById('logo').appendChild(document.createTextNode(" (using existing data)"));
      console.log("Using existing data");
      //console.log(songsAPIDataString);
   }
   songsAPI = JSON.parse(songsAPIDataString);
}

function refreshSearchBrowsePage(searchType, search){
   //searchType 0 = None, 1 = Title, 2 = Artist, 3 = Genre
   let resultsContainer = getById("browse-list");
   resultsContainer.replaceChildren(); //deletes all previous rows
   let validSong = false;
   for(let apiSong of songsAPI){
      validSong = false;
      switch(searchType){
         case 0: //Show all songs
            validSong = true;
            break;
         case 1: //Title search
            if(apiSong.title.toUpperCase().includes(search.toUpperCase())){
               validSong = true;
            }
            break;
         case 2: //Artist search
            if(apiSong.artist.name.toUpperCase().includes(search.toUpperCase())){
               validSong = true;
            }
            break;
         case 3: //Genre search
            if(apiSong.genre.name.toUpperCase().includes(search.toUpperCase())){
               validSong = true;
            }
            break;
      }
      if (validSong) {
         let thisRow = document.createElement("li");
         thisRow.classList.add("browse-list-row");
         if (lastListRowColorOne) {
            thisRow.classList.add("browse-list-row-color-two");
            lastListRowColorOne = false;
         }
         else {
            thisRow.classList.add("browse-list-row-color-one");
            lastListRowColorOne = true;
         }

         let titleText = makePNode(apiSong.title);
         titleText.setAttribute('id', apiSong.song_id);
         titleText.addEventListener("mouseup", function(){ //Button for visiting song page from list row 
            refreshSongPage(this);
            visitPage("song-view-page");
         });

         thisRow.appendChild(titleText);
         thisRow.appendChild(makePNode(apiSong.artist.name));
         thisRow.appendChild(makePNode(apiSong.year));
         thisRow.appendChild(makePNode(apiSong.genre.name.toUpperCase()));
         thisRow.appendChild(makePNode(apiSong.details.popularity));
         resultsContainer.appendChild(thisRow);
      }
   }
}
function initializeButtons() {
   /* Header navigation button functionality */
   document.getElementById("header-search-button").addEventListener("mouseup", function () {
      refreshSearchBrowsePage(0, '');
      visitPage("search-page-container");
   });

   document.getElementById("header-song-view-button").addEventListener("mouseup", function () {
      visitPage("song-view-page");
   });

   document.getElementById("header-playlist-button").addEventListener("mouseup", function () {
      visitPage("playlist-page");
   });

   //Song search buttons
   document.getElementById("clear-search-button").addEventListener("mouseup", function () {
      console.log("TODO Clear");
      getById("search-option-1").value = '';
      getById("search-option-2").value = '';
      getById("search-option-3").value = '';
      getById("name-search").checked = true;
      getById("artist-search").checked = false;
      getById("genre-search").checked = false;
      refreshSearchBrowsePage(0, '');
   });

   document.getElementById("filter-search-button").addEventListener("mouseup", function () {
      let searchType = "0";
      let inputBox;
      let searchText;
      for (button of getById("search-radio-buttons")) {
         if (button.checked) {
            searchType = Number(button.value);
            inputBox = "search-option-" + searchType.toString();
            searchText = getById(inputBox).value.toString();
         }
      }
      console.log(searchType);
      console.log(searchText);
      refreshSearchBrowsePage(searchType, searchText);
   });

   //Credits button
   getById("header-credits-button").addEventListener("mouseenter", function(){
      getById("credits").classList.remove("hidden");
      console.log("showing");
   });
   getById("header-credits-button").addEventListener("mouseleave", function(){
      getById("credits").classList.add("hidden");
      console.log("hiding");
   });
}

function refreshSongPage(showSong){
   let viewSong = songsAPI.find(songSearch => Number(songSearch.song_id) == Number(showSong.getAttribute('id')));
   console.log("[song name: " + showSong.textContent.toString() + "]");
   console.log("[song id: " + showSong.getAttribute('id') + "]");
   console.log("[search result title: " + viewSong.title + "]");
   console.log("[search result id: " + viewSong.song_id + "]");
   console.log("Visiting page");
   /*
   let container = query(".song-view-page");

   let songTitle = makePNode(viewSong.title);
   container.appendChild(songTitle);
   let artistName = makePNode(viewSong.artist.name);
   container.appendChild(artistName);
   let genreName = makePNode(viewSong.genre.name);
   container.appendChild(genreName);
   let popularity = makePNode(viewSong.details.popularity);
   container.appendChild(popularity);
   */
   let durationMinutes = (viewSong.details.duration / 60); //Gives minutes with decimal representing seconds
   let durationSeconds = Math.floor((durationMinutes - Math.floor(durationMinutes)) * 60); //Copies decimal only * 60
   durationMinutes = Math.floor(durationMinutes);
   let durationText = durationMinutes.toString() + " minutes, " + durationSeconds.toString() + " seconds";
   //let duration = makePNode(durationText);
   //container.appendChild(duration);

   getById("song-view-title").textContent = viewSong.title;
   getById("song-view-artist").textContent = viewSong.artist.name;
   getById("song-view-year").textContent = viewSong.year;
   getById("song-view-genre").textContent = viewSong.genre.name.toUpperCase();
   getById("song-view-duration").textContent = durationText;

   let analysisData = getById("analysis-left").firstChild.nextSibling;
   for(let i = 0; i <= 4; i++){
      switch(i){
         case 0:
            analysisData.textContent = "BPM: " + viewSong.details.bpm;
            analysisData = analysisData.nextElementSibling;
            break;
         case 1:
            analysisData.textContent = "Energy: " + viewSong.analytics.energy;
            analysisData = analysisData.nextElementSibling;
            break;
         case 2:
            analysisData.textContent = "Danceability: " + viewSong.analytics.danceability;
            analysisData = analysisData.nextElementSibling;
            break;
         case 3:
            analysisData.textContent = "Liveness: " + viewSong.analytics.liveness;
            break;
      }
   }
   analysisData = getById("analysis-right").firstChild.nextSibling;
   for(let i = 0; i <= 4; i++){
      switch(i){
         case 0:
            analysisData.textContent = "Valence: " + viewSong.analytics.valence;
            analysisData = analysisData.nextElementSibling;
            break;
         case 1:
            analysisData.textContent = "Acousticness: " + viewSong.analytics.acousticness;
            analysisData = analysisData.nextElementSibling;
            break;
         case 2:
            analysisData.textContent = "Speechiness: " + viewSong.analytics.speechiness;
            analysisData = analysisData.nextElementSibling;
            break;
         case 3:
            analysisData.textContent = "Popularity: " + viewSong.details.popularity;
            break;
      }
   }
}

function visitPage(pageName){
   pageName = "." + pageName.toString();
   query(".search-page-container").classList.add("hidden");
   query(".song-view-page").classList.add("hidden");
   query(".playlist-page").classList.add("hidden");
   query(pageName).classList.remove("hidden");
}

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/

