/**
 * Re-export the commands so they can be used in other contexts
 */
const itemSearchCommand = require('./lib/item-search-command');
const itemExportCommand = require('./lib/item-export-command');

// just re-export the commands so they can be run in another scropt
module.exports = {
  search: itemSearchCommand,
  export: itemExportCommand
};
