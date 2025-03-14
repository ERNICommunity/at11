![Workflow Status](https://github.com/ERNICommunity/at11//actions/workflows/azure-webapps-node.yml/badge.svg)

at11
==========

Simple web application that fetches daily lunch menus from popular restaurants near [ERNI Slovakia office](http://erni.sk).

Live application is running at [http://at11.azurewebsites.net/](http://at11.azurewebsites.net/).


Developer's installation instructions
---

This is a [Node.js](http://nodejs.org) powered application writen it [TypeScript](https://www.typescriptlang.org), so first you need to have Node.js up and running.

1. Get the source code by either [downloading a zip](https://github.com/at11/at11/archive/master.zip) or cloning this repo.
1. Change into directory with extracted/cloned sources `cd path/to/sources`.
1. Execute `npm install`. This might take a moment as all required dependecies need to be downloaded.
1. Execute `npm start`. This will build and start the application.
1. Navigate your browser to [http://localhost:54321](http://localhost:54321) and you should see today's menus.
1. You can execute `npm test` to run the tests and linter.

P.S.: [Visual Studio Code](https://code.visualstudio.com/) settings are included in the repo, so if you use it, you are all set up (including debugging). You need to do only first 3 steps, then launch VS Code in that directory (`code .`), hit *F5*, lean back and relax...

Contributing
---
Feel free to [fork the repo](https://help.github.com/articles/fork-a-repo), make improvements and create a pull request.
