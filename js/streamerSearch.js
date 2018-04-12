$(function() {
  let api = "https://api.twitch.tv/helix/";
  const id = "kzorunvk14ozf62rftb5a1d24qa73w";
  const streamSelect = $("#stream-selection");
  const btn = $("#subUser");
  let searchTerm = $("#gameSearchTerm"),
    twitchEmbed = $("#twitch-embed");
  let gameField = $('.gameSearch-fields');
  let streamerField = $(".streamSearch-fields");

  btn.on('click', evt => {
    evt.preventDefault();
    if (searchTerm.val() == "") return alert(`You must enter a user's name.`);
    btn.html('Loading...');
    getStreamerData();
  });
  searchTerm.on('keypress', evt => {
    let keyCode = evt.which || evt.keyCode;
    if (keyCode === 13) {
      if (searchTerm.val() == "") return alert(`You must enter a user's name.`);
      btn.html('Loading...');
      getStreamerData();
    }
  });


  //get username of streamer then - run GET https://api.twitch.tv/helix/streams?user_login
  function getStreamerData() {
    let term = searchTerm.val();
    let query = `${api}streams?user_login=${term}`;
    $.ajax({
      url: query,
      type: 'GET',
      data: 'JSON',
      beforeSend: xhr => xhr.setRequestHeader('Client-ID', id),
      success: response => {
console.log(response.data)
      }
    }); //end ajax
  }


  $("#showStreamerFields").on('click', function() {
    gameField.hide();
    streamerField.fadeToggle(600);
  });

}); //end of function ready
