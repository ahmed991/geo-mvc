/**
 *
 * This is the main application file.
 * The ideal place to handle any application launch settings
 *
 */

import {HomeView} from './home/HomeView.js';

// import { HomeView } from './home/HomeView.js';

/* --- */
webix.debug({events: true});
/* --- */

/* Global variables */
window.appdata = {
    appName: 'CityApp',
    cityName: 'Utrecht',
    cityCoords: [133500, 455200],
    zoom: 16.6
};
/* --- */

/* Initialization function */
webix.ready(function(){

    webix.ui(HomeView);
    document.title = appdata.cityName + ' City - Information App';


});
/* --- */