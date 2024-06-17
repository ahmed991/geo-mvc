/*--- Color Model ---*/

const ColorSets = new webix.DataCollection({
	datatype: 'json',
	data: [{
        group: 'g1',
        stroke: '#d41811', /*red*/
        fill: '#ec1a13',
        tints: [ ]
    },{
        group: 'g2',
        stroke: '#e65c00', /*orange*/
        fill: '#ff6600',
        tints: [ ]
    },{
        group: 'g3',
        stroke: '#734d26', /*brown*/
        fill: '#996633',
        tints: [ ]
    },{
        group: 'g4',
        stroke: '#33cc00', /*light-green*/
        fill: '#39e600',
        tints: [ ]
    },{
        group: 'g5',
        stroke: '#e6b800', /*yellow*/
        fill: '#ffcc00',
        tints: [ ]
    },{
        group: 'g6',
        stroke: '#3c9043', /*green*/
        fill: '#408000',
        tints: [ ]
    },{
        group: 'g7',
        stroke: '#005fb3', /*blue*/
        fill: '#0088ff',
        tints: [ ]
    },{
        group: 'g8',
        stroke: '#00b3b3', /*cyan*/
        fill: '#00cccc',
        tints: [ ]
    },{
        group: 'g9',
        stroke: '#b034b2', /*purple*/
        fill: '#c94dcb',
        tints: [ ]
    }]
});


/**
 * Identify the correct color scheme to be used for a given group.
 * @param {string} group - The 'id' of a group.
 * @returns {object} The set of color properties of the matched group.
 */
export function getColorSet(group){
	return ColorSets.find((record) => {
		return record.group === group
	}, true);
};