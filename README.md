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

TODO: Fix the layout of this app. Add a search based on a streamer's name to find what
they're playing etc... Add a way to view multiple streams in a responsive grid layout.
Begin to program the streamer search functionality.
