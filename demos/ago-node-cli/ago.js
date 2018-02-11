#!/usr/bin/env node
require('isomorphic-fetch');
require('isomorphic-form-data');
/**
 * This demo uses the commander module, which streamlines the creation of command-line-applications
 */
const program = require('commander');

program
  .version('0.0.1');

/**
 * Bring in the search command...
 */
const itemSearchCommand = require('./lib/item-search-command');

program
  .command('search <query>')
  .description('Search for items')
  .action(function (query) {
    itemSearchCommand.execute(query);
  });

  const itemExportCommand = require('./lib/item-export-command');
  program
  .command('export <itemId> <filename>')
  .description('Export an item to a json file')
  .action(function (id, filename) {
    itemExportCommand.execute(id, filename);
  });

program.parse(process.argv);