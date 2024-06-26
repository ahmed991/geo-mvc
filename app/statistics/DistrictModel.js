/*--- Districts Model ---*/

const Districts = new webix.DataCollection({
    datatype: 'json'
});


/**
 * Retrieve statistical data form the server
 * @param {string} cityName - The name of the city to be used as a filter for the service.
 * @returns {json} A JSON object with population and landuse records.
 */
export function getDistricts(cityName){
	return Districts.load(() => {
		return webix.ajax().get('https://gisedu.itc.utwente.nl/student/s3182363/gpw/CityApp/api/districtstats.py?', { cityname: cityName });
	});
};