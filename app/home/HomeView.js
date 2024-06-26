/**
 *  --- Home View ---
 */

//https://docs.webix.com/api__refs__ui.layout.html

import {HomeCtrl} from './HomeController.js';
import { StatsCtrl } from '../statistics/StatisticsController.js';
import { StatsView } from '../statistics/StatisticsView.js';

export const HomeView = {
    type: 'space',
    cols: [{
        view: 'tabview',
        id: 'home-view',
        tabbar: {
            optionWidth: 150,
            on: {
                onAfterRender: HomeCtrl.onViewReady
            }
        },
        cells: [{
            header: 'Statistics',
            body: StatsView
        },{
            header: 'Planning',
            body: {
                id: 'planning-view',
                template: 'The planning view goes in this container...'
            }
        },{
            header: 'Transport',
            body: {
                id: 'transport-view',
                template: 'Real-time transport data will be displayed here...'
            }
        },{
            header: '&bull;&nbsp;&bull;&nbsp;&bull;',
            body: {
                id: 'temporary-view',
                template: 'Any other required view can be added here...'
            }
        }]
    }],
    getController: () => {
        return HomeCtrl;
    }
};