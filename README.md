[![Build Status](https://travis-ci.org/ERNICommunity/at11.svg?branch=master)](https://travis-ci.org/ERNICommunity/at11)
![Dependencies](https://david-dm.org/ERNICommunity/at11.svg)

at11
==========

Simple web application that fetches daily lunch menus from popular restaurants near [ERNI Slovakia office](http://erni.sk).

Live application is running at [http://at11.azurewebsites.net/](http://at11.azurewebsites.net/).


Developer's installation instructions
---

This is a [Node.js](http://nodejs.org). powered application, so first you need to have Node.js up and running. You can get node.js installers [from here](http://nodejs.org/download/).

1. Get the [sources](https://github.com/at11/at11/archive/master.zip) and extract them locally. You can also clone the repository if you wish. If you want to contribute feel free to [fork the repo](https://help.github.com/articles/fork-a-repo), make improvements and create pull requests.
2. Change into directory with sources `cd path/to/sources`.
3. Execute `npm install`. This might take a while as all required dependecies need to be downloaded.
4. After successful installation execute `node app`. This will prompt a few messages, last of them being `Listening on port 54321...` and hang.
5. Navigate your browser to [http://localhost:54321](http://localhost:54321) and you should see today's menus.
