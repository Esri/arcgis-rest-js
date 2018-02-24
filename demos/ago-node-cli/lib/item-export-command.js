const { getItem, getItemData } = require("@esri/arcgis-rest-items");
const jsonfile = require('jsonfile');

module.exports = {
  /**
   * Execute the command
   */
  execute: function (id, fileName) {
    console.info(`Exporting item ${id} to file ${fileName}`);
    // construct the search call..
    let model = {};
    return getItem(id)
    .then((item) => {
      model.item = item;
      if (this.shouldFetchData(item.type)){
        console.info(`...Fetching ./data for item of type ${item.type}`);
        return getItemData(id);
      } else {
        console.info(`...Items of type ${item.type} do not have json ./data - skipping`);
        return Promise.resolve();
      }
    })
    .then((maybeData) => {
      if (maybeData) {
        model.data = maybeData;
      }
      // now write out the file...
      jsonfile.writeFileSync(fileName, model,  {spaces: 2});
      console.info(`Done. Exported "${model.item.title}" to ${fileName}`);
    })
    .catch((err) => {
      console.error(err);
    });
  },

  /**
   * Not all item types have json /data
   */
  shouldFetchData (type) {
    let result = false;
    let exportables = ['Web Map', 'Web Mapping Application', 'Hub Page', 'Hub Initiative', 'Hub Site Application'];
    // if the type is in this list, we can export it...
    if (exportables.indexOf(type) > -1) {
      result = true;
    }
    return result;
  }
}