//localStorage.removeItem("songsAPIData");
var lastListRowColorOne = false;

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
   //console.log(songsAPIDataString);
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
   refreshSearchBrowsePage(0, '');
   visitPage("search-page-container");
});

document.getElementById("header-song-details-button").addEventListener("mouseup", function(){
   visitPage("song-details-page");
});

document.getElementById("header-playlist-button").addEventListener("mouseup", function(){
   visitPage("playlist-page");
});

//Song search buttons
document.getElementById("clear-search-button").addEventListener("mouseup", function(){
   console.log("TODO Clear");
   getById("search-option-1").value = '';
   getById("search-option-2").value = '';
   getById("search-option-3").value = '';
   getById("name-search").checked = true;
   getById("artist-search").checked = false;
   getById("genre-search").checked = false;
   refreshSearchBrowsePage(0, '');
});

document.getElementById("filter-search-button").addEventListener("mouseup", function(){
   let searchType = "0";
   let inputBox;
   let searchText;
   for(button of getById("search-radio-buttons")){
      if(button.checked){
         searchType = Number(button.value);
         inputBox = "search-option-" + searchType.toString();
         searchText = getById(inputBox).value.toString();
      }
   }
   console.log(searchType);
   console.log(searchText);
   refreshSearchBrowsePage(searchType, searchText);
});

function refreshSearchBrowsePage(searchType, search){
   //searchType 0 = None, 1 = Title, 2 = Artist, 3 = Genre
   let songsAPI = JSON.parse(songsAPIDataString);
   let resultsContainer = getById("browse-list");
   resultsContainer.replaceChildren(); //deletes all previous rows
   let validSong = false;
   for(let apiSong of songsAPI){
      validSong = false;
      switch(searchType){
         case 0:
            validSong = true;
            break;
         case 1:
            if(apiSong.title.toUpperCase().includes(search.toUpperCase())){
               validSong = true;
            }
            break;
         case 2:
            if(apiSong.artist.name.toUpperCase().includes(search.toUpperCase())){
               validSong = true;
            }
            break;
         case 3:
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

         //let titleText = songsAPI[c].title;
         thisRow.appendChild(makePNode(apiSong.title));
         thisRow.appendChild(makePNode(apiSong.artist.name));
         thisRow.appendChild(makePNode(apiSong.year));
         thisRow.appendChild(makePNode(apiSong.genre.name.toUpperCase()));
         thisRow.appendChild(makePNode(apiSong.details.popularity));
         resultsContainer.appendChild(thisRow);
      }
   }
}

refreshSearchBrowsePage(0, '');
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

