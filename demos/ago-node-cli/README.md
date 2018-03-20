# Node CLI Examples

This demo shows how to create a command-line application that interacts with the ArcGIS Online API.

At this point, the commands are very simple and intended to demonstrate how to build up tooling.

This project uses the `commander` module, which streamlines the creation of node cli applications. Check out the [README](https://github.com/tj/commander.js/blob/master/Readme.md) for more details.

### Installing

Like all the other demo apps, run `npm run bootstrap` from the root.

### Running
If you use this demo as a starting point for your own command line package, you would publish it to npm, then on the target systems run `npm install <your-cli-package>`, and it would be available as a command.

But, this is demo code, and thus the package is not "installed" via `npm install ...`, before we can call it as `ago <command> <query>` we need to run `npm link` in the `/demos/ago-node-cli` folder. After you do that, the command should work.

Here is a post with information on creating node command line tools: [A Guide to Creating a NodeJs Command](https://x-team.com/blog/a-guide-to-creating-a-nodejs-command/)

### Commands

| command | description | example |
| --- | --- | --- |
| `ago search <query>` | search for items | `ago search water` |
| `ago export <id> <file>` | export an item to a json file | `ago export a62cb9d894f145cc89531c096d0012b1 pa.json` |

## Building your own tooling

If you want to build out some commands of your own, you can also clone a stand-alone version of this repo from https://github.com/dbouwman/arcgis-rest-js-commands
