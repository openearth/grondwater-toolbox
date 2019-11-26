# BRL waterbodemstool

[BRL](https://basisrivierbodemligging.netlify.com) makes it possible to simulate the effects of changing the depth of a river bed.

[![Netlify Status](https://api.netlify.com/api/v1/badges/1535c4c2-d3d3-496e-b404-38e41899efea/deploy-status)](https://app.netlify.com/sites/modest-allen-8e57cd/deploys)

## Development

The projects stack is comprised of:
* [Vue](https://vuejs.org/) as application framework
* [Vue Router](https://router.vuejs.org/) for routing
* [Vuex](https://vuex.vuejs.org/) for state management
* [Vuetify](https://vuetifyjs.com/) for styling
* [Mapbox](https://www.mapbox.com/) as the map solution
* [vue-mapbox](https://soal.github.io/vue-mapbox/) as a Vue wrapper for Mapbox

### Getting started

* Clone the repository.
* Copy `.env.example` to `.env` and set the environment variables. Copy them from the [Netlify build configuration](https://app.netlify.com/sites/basisrivierbodemligging/settings/deploys#environment-variables) or ask your tech lead.
* Run app in development mode (`npm start`), see [scripts](#scripts).
* Changes on master trigger a new build and deploy to the [live environment](https://basisrivierbodemligging.netlify.com).

### Scripts

This project requires [Node.js](http://nodejs.org/) (recommended v12.11.0) and [npm](https://npmjs.org/) (comes with Node).

After installing dependencies using `npm ci` the following scripts are available:

`npm run ...` | Description
---|---
`build` | Builds app for production to `dist/`.
`serve` | Serves app on [`http://localhost:8080`](http://localhost:8080) with hot reloading.
`start` | Short for `run dev`

## License

[GNU General Public License v3.0](license) (GNU GPLv3) © [Deltares](https://www.deltares.nl) and [De Voorhoede](https://www.voorhoede.nl)
