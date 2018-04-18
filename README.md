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

Fix the layout of this app: 

<ol>
  <li>Add a way to view multiple streams in a responsive grid layout.</li>
  <li>When a user is clicked, implement the video embed function used on the game search.</li>
  <li>Add functionality to streamer select to display their livestream if their preview is clicked on.</li>
</ol>
  Bug testing: 

<ol>
  <li>Make sure mulitple requests cannot be spammed while loading results</li>
  <li>Ensure there is error handling if an ajax request fails to pull data from the api for both game and streamer search functions.</li>
  <li>When displaying the video make sure theres a default or error message if for some reason the video cannot be loaded.</li>
  <li>Handle unrecognized names / incorrect game titles and return an error describing the problem to the user.</li>
</ol>