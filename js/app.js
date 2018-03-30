(function() {
  const storage = window.localStorage;
  let api = "https://api.twitch.tv/helix/";
  const id = "kzorunvk14ozf62rftb5a1d24qa73w";
  const vidLoc = $("#twitch-embed");
  const streamSelect = $("#stream-selection");
  const btn = $("#subUser");
  let searchTerm = $("#searchTerm");

  //initializing the search query
  btn.on('click', evt => {
    evt.preventDefault();
    if (searchTerm.val() == "") return alert('You must enter a video game name.');
    btn.html('Loading...');
    getGameId();
  });
  searchTerm.on('keypress', evt => {
    let keyCode = evt.which || evt.keyCode;
    if (keyCode === 13) {
      if (searchTerm.val() == "") return alert('You must enter a video game name.');
      btn.html('Loading...');
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
          let viewCount = streams.viewer_count;
          let name = getUserNameFromId(id);
          name.then(ans => {
              displayName = ans.data[0].display_name;
              let content = $(`
                <div class="single-stream">
                <img class="stream-thumbnail" src=${tb}>
                <p class="single-stream-content">
                <h3 id="${id}">${displayName}</h3>
                is playing <span class="search-term">${searchTerm.val()}</span> for ${viewCount} viewers.
                </p>
                </div>
              `);
              streamSelect.append(content);
            })
            .catch(error => {
              if (error) return streamSelect.empty().html(`Error retrieving content, please try your search again.`);
            });
        } // end of for...of loop
      } // end of success function
    });
    btn.html('Search');
  } //end of getStreams

  //use streamer id to find streamer username - https://api.twitch.tv/helix/users?id=${queried game user id}
  function getUserNameFromId(userId) {
    let query = `${api}users?id=${userId}`;
    return Promise.resolve($.ajax({
      url: query,
      beforeSend: xhr => xhr.setRequestHeader('Client-ID', id)
    })); //have to use ES6 promises to return the success data back to the for of loop.
  } // end of getUserNameFromId


  //when a user clicks on the thumbnail, have it save their username as the id of the title of the streamer so twitch embed can access their stream. - EDIT: implemented version is: while dynamically generating the content I assign the user id to their h3 tag as an ID.

  //TODO: Implement twitch embed and potentially make the results a slider? When a user clicks on the streamer they want to watch, run a query with the streamer's ID and fetch their channel. Has to be display name and not ID, so a query will be necessary in order to grab the stream. - COMPLETED

  //This will find the correct target since the element doesnt exist when the DOM is created.
  streamSelect.on('click', 'div', function() {
    let ID = $(this).find('h3').attr('id');
    let name = getUserNameFromId(ID);

    name.then(ans => {
      let userName = ans.data[0].display_name;
      new Twitch.Embed("twitch-embed", {
        width: "100%",
        height: "100%",
        chat: "default",
        layout: "video",
        channel: userName
      }); //end twitch embed
    }); //end of then function

  }); //end of twitch embed function

  //TODO: Figure out a better layout for the results. Make a better display for the video location. Ideally will have selections appear in a row directly under the search bar and the video will appear under the suggestions. Still have to implement a clear feature once another request is made so the old results disappear. Will need to make some sort of check to see how many videos are currently being displayed and a way for the user to remove a stream they dont want to view. Utilize local storage in a way that allows for previous searches for convenience. Possibly a simple array containing past searches that can be toggled in and out of view with a title saying "click here for previous searches" or some shit like that.

})();
