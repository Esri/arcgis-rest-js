
/**
 * Bring in searchItems fn
 */
const { searchItems } = require("@esri/arcgis-rest-items");

module.exports = {
  /**
   * Execute the command
   */
  execute: function (query) {
    // construct the search call..
    return searchItems({ 
      searchForm: {
        q: query,
        start: 1,
        num: 10
      }
    })
    .then((response) => {
      // if we got results
      if (Array.isArray(response.results) && response.results.length)  {
        console.info(`${response.total} items found for "${query}".`);
        response.results.forEach((entry) => {
          console.info(`${entry.id} | ${entry.title}`);
        })
      } else {
        console.info(`No results found for "${query}".`);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }
}