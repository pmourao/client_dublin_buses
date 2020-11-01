# Dublin Buses

The Proof of Concept of a user interface client built using React.
The aim of this PoC is create an interactive map that fetches data form the Restful API based on filters.

## Project description
This project consist in 3 pages [Home,About,Swagger]
On the Home as the main page there's a pane on the left with filters, a Map fulfilling the entire available area, built using MapBox react component.

### Why Mapbox?
Mapbox is a powerful, versatile tool for creating interactive maps and visualizing geographic data. Tons of reputable companies employ it for a variety of use cases (The New York Times, Strava, and Weather Channel, to name a few).

### Why React?
React is widely used by most complex and modern web applications, it uses some kind of library or structure. It is actually quite overkill for the current example, but it is a good example to start with.

### Restful API
The Restful API service documentation is available [here](https://github.com/pmourao/api_dublin_buses) 
## Available Scripts

In the project directory, assuming you have the latest `Node.js` installed, you can run:
### To run for Development.

### `npm run install-all`
To install all required dependencies

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Production

### 1. Create a config.json with the following keys 
```
{
  "apiKey": "<firebase apiKey>",
  "authDomain": "<Project-ID>.firebaseapp.com",
  "projectId": "<Project-ID>",
  "domain": "https://us-central1-<Project-ID>.cloudfunctions.net",
  "mapbox_style_url" : "mapbox://styles/<USER-ID>/<style_id>",
  "mapboxApiAccessToken" : "<API-KEY>"
}
```
### 2. Install Firebase CLI

Install the Firebase CLI by running the following command:

```javascript
$ npm install -g firebase-tools
```

### 3. Log in on Firebase

Log in to Firebase (for the first time use). Follow instructions on the screen.

```javascript
$ firebase login
```

### 4. Build and deploy
Change the <Project-ID> on the deploy-all script in the `package.json`
```javascript
$ npm run deploy
```

## DEMO

[Demo available **here**](https://buses-map-d1556.web.app)

![screenshot](https://buses-map-d1556.web.app/demo_dashboard.png)