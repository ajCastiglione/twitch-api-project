$(function() {
  const storage = window.localStorage;
  let api = "https://api.twitch.tv/helix/";
  const id = "kzorunvk14ozf62rftb5a1d24qa73w";
  const streamSelect = $("#stream-selection");
  const gameBtn = $("#subGame");
  const userBtn = $("#subUser");
  let searchTerm = $("#gameSearchTerm"),
    twitchEmbed = $("#twitch-embed"),
    userSearchTerm = $("#userSearchTerm");
  let streamerData = [],
    userData = [],
    vidCount = 0;
  const slider = $('.owl-carousel');
  let gameField = $('.gameSearch-fields');
  gameField.hide();
  let streamerField = $(".streamSearch-fields");
  streamerField.hide();

  //initializing the search query
  gameBtn.on('click', evt => {
    evt.preventDefault();
    streamerData = [];
    if (searchTerm.val() == "") return alert('You must enter a video game name.');
    gameBtn.html('Loading...');
    getGameId();
  });
  searchTerm.on('keypress', evt => {
    let keyCode = evt.which || evt.keyCode;
    streamerData = [];
    if (keyCode === 13) {
      if (searchTerm.val() == "") return alert('You must enter a video game name.');
      gameBtn.html('Loading...');
      getGameId();
    }
  });

  //Use query term (name of game) to find game id of searched game - https://api.twitch.tv/helix/games?name=${query term}
  function getGameId() {
    let gameId;
    let term = searchTerm.val();
    let query = `${api}games?name=${term}`;
    $.ajax({
      url: query,
      type: 'GET',
      data: 'JSON',
      beforeSend: xhr => xhr.setRequestHeader('Client-ID', id),
      success: response => {
        if (!response.data[0].id) return "Invalid game title, please try your search again.";
        gameId = response.data[0].id;
        getStreams(gameId, term);
      },
      error: (xhr, status, abort) => {
        streamSelect.html('Retrying query...');
        getGameId();
      }
    });
  } //end of getGameId

  //use game id to find current streams of the searched for game - https://api.twitch.tv/helix/streams?game_id=${queried game id}

  function getStreams(gameId, term) {
    let displayName;
    let query = `${api}streams?game_id=${gameId}`;
    $.ajax({
      url: query,
      type: 'GET',
      data: 'JSON',
      beforeSend: xhr => xhr.setRequestHeader('Client-ID', id),
      success: response => {
        //console.log(response.data);
        let availStreams = response.data;
        for (let streams of availStreams) {
          let id = streams.user_id;
          let tb = streams.thumbnail_url.replace(/{width}/gi, "500").replace(/{height}/gi, "500");
          if (!tb) tb = 'https://www.twitch.tv/p/assets/uploads/glitch_474x356.png';
          let viewCount = streams.viewer_count;
          let name = getUserNameFromId(id);
          name.then(ans => {
              displayName = ans.data[0].display_name;
              streamerData.push({
                name: displayName,
                thumb: tb,
                views: viewCount,
                userID: id
              });
            })
            .catch(error => {
              if (error) return streamSelect.empty().html(`Error retrieving content, please try your search again after 1 minute has passed - due to query limitations.`);
            });
        } // end of for...of loop

      }, // end of success function
      complete: function() {
        setTimeout(function() {
          displayContent();
          localStorage.streamPeople = JSON.stringify(streamerData);
        }, 1200);
      }
    }); // end ajax
  } //end of getStreams

  //use streamer id to find streamer username - https://api.twitch.tv/helix/users?id=${queried game user id}
  function getUserNameFromId(userId) {
    let query = `${api}users?id=${userId}`;
    return Promise.resolve($.ajax({
      url: query,
      beforeSend: xhr => xhr.setRequestHeader('Client-ID', id)
    })); //have to use ES6 promises to return the success data back to the for of loop.
  } // end of getUserNameFromId

  function displayContent(savedStreamersArr) {
    gameBtn.html('Search');
    streamSelect.empty();
    if (savedStreamersArr) {
      savedStreamersArr = savedStreamersArr.sort((a, b) => b.views - a.views);
      for (let streamer of savedStreamersArr) {
        let content = $(`
          <div class="single-stream">
          <img class="stream-thumbnail" src=${streamer.thumb}>
          <p class="single-stream-content">
          <h3 class="single-stream-title" id="${streamer.userID}">${streamer.name}</h3>
          is playing <span class="search-term">${searchTerm.val()}</span> for ${streamer.views} viewers.
          </p>
          </div>
        `);
        streamSelect.append(content);
      } //end of for of loop
      putItInaSlider();
    } else {
      slider.owlCarousel('destroy');
      streamerData = streamerData.sort((a, b) => b.views - a.views);
      for (let streamer of streamerData) {
        let content = $(`
        <div class="single-stream">
        <img class="stream-thumbnail" src=${streamer.thumb}>
        <p class="single-stream-content">
        <h3 class="single-stream-title" id="${streamer.userID}">${streamer.name}</h3>
        is playing <span class="search-term">${searchTerm.val()}</span> for ${streamer.views} viewers.
        </p>
        </div>
      `);
        streamSelect.append(content);
      } //end of for of loop
      putItInaSlider();
    }

  } //end of display content

  function putItInaSlider() {
    slider.owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      dots: false,
      mouseDrag: false,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 2
        },
        1030: {
          items: 3
        },
        1240: {
          items: 5
        },
        1600: {
          items: 6
        }
      }
    });
  }

  //This will find the correct target since the element doesnt exist when the DOM is created.
  streamSelect.on('click', '.single-stream', function() {
    let ID = $(this).find('h3').attr('id');
    let name = getUserNameFromId(ID);
    let vidSpot = $(`<div id="live-stream" class="streamNum-${vidCount} twitch-liveStream"></div>`);
    let closeVid = $(`<div class="close-video">X</div>`);
    twitchEmbed.append(vidSpot);
    vidSpot.append(closeVid);

    name.then(ans => {
      let userName = ans.data[0].display_name;
      new Twitch.Embed("live-stream", {
        width: "100%",
        height: "100%",
        chat: "default",
        layout: "video",
        channel: userName
      }); //end twitch embed
    }); //end of then function
    vidCount++;
  }); //end of twitch embed function

  //Setting up local storage to save the streamer array
  if (localStorage.streamPeople) {
    let savedStreamersArr = JSON.parse(localStorage.streamPeople);
    displayContent(savedStreamersArr);
  }

  // Removing videos
  twitchEmbed.on("click", ".close-video", function() {
    let parentVideo = $(this).parent();
    parentVideo.remove();
  });

  // Btn to show game search field
  $("#showGameFields").on('click', function() {
    streamerField.hide();
    gameField.fadeToggle(600);
  });

  /*=====================================Streamer Search Section==================================================*/

  userBtn.on('click', evt => {
    evt.preventDefault();
    if (userSearchTerm.val() == "") return alert(`You must enter a user's name.`);
    userBtn.html('Loading...');
    getStreamerData();
  });
  userSearchTerm.on('keypress', evt => {
    let keyCode = evt.which || evt.keyCode;
    if (keyCode === 13) {
      if (userSearchTerm.val() == "") return alert(`You must enter a user's name.`);
      userBtn.html('Loading...');
      getStreamerData();
    }
  });

  //get username of streamer then - run GET https://api.twitch.tv/helix/streams?user_login=
  function getStreamerData() {
    let term = userSearchTerm.val();
    let query = `${api}streams?user_login=${term}`;
    $.ajax({
      url: query,
      type: 'GET',
      data: 'JSON',
      beforeSend: xhr => xhr.setRequestHeader('Client-ID', id),
      success: response => {
        let ans = response.data[0];
        userData.push({
          name: term,
          image: ans.thumbnail_url.replace(/{width}/gi, 500).replace(/{height}/gi, 500),
          online: ans.type,
          views: ans.viewer_count
        });
        getGameFromId(ans.game_id);
      }
    }); //end ajax
  }

  //Once I have the game ID run another query to get the name of the game - https://api.twitch.tv/helix/games?id=
  function getGameFromId(ID) {
    let term = ID;
    let query = `${api}games?id=${term}`;
    $.ajax({
      url: query,
      type: 'GET',
      data: 'JSON',
      beforeSend: xhr => xhr.setRequestHeader('Client-ID', id),
      success: response => {
        let game = response.data[0].name;
        userData[0].game = game;
        displayUserContent();
      }
    });
  }

  function displayUserContent() {
    userBtn.html("Search");
    streamSelect.empty();
    slider.owlCarousel('destroy');
    let user = userData[0];
    let content = $(`
      <div class="single-user">
        <img class="user-thumbnail" src="${user.image}">
        <div class="single-user-content">
        <h3 class="single-user-title">${user.name}</h3>
        is playing <span class="search-term">${user.game}</span> for ${user.views} viewers.
        </div>
      </div>
      `);
      streamSelect.append(content);
  }


  $("#showStreamerFields").on('click', function() {
    gameField.hide();
    streamerField.fadeToggle(600);
  });

  /*TODO: Fix the layout of this app. Add a search based on a streamer's name to find what
  they're playing etc... Add a way to view multiple streams in a responsive grid layout.
  Beginning to program the streamer search functionality.
  */
});
