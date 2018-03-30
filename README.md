# Twitch API Integration

This project was done based on a react project I saw while browsing around and wanted to recreated this with vanillaJS and jQuery.

## Dependencies
<ul>
<li>SCSS</li>
<li>vanillaJS</li>
<li>jQuery</li>
<li>Gulp (just for speeding up the process)</li>
<li>Twitch Helix API</li>
<li>Twith Embed.js</li>
</ul>

## How it works

This program works by using the open Twitch API (using the new helix API).

It runs multiple queries to find the correct information and return a list of 20 streamers for the game you searched for.

Once you click on the item (being the thumbnail or the streamer name) it will find the user's stream and display it below the search field.

## Work in progress

Still have quite a few changes and optimizations that I want to make.

TODO: Figure out a better layout for the results. Make a better display for the video location. Ideally will have selections appear in a row directly under the search bar and the video will appear under the suggestions. Still have to implement a clear feature once another request is made so the old results disappear. Will need to make some sort of check to see how many videos are currently being displayed and a way for the user to remove a stream they dont want to view. Utilize local storage in a way that allows for previous searches for convenience. Possibly a simple array containing past searches that can be toggled in and out of view with a title saying "click here for previous searches" or some shit like that.
