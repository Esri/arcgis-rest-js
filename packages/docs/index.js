var Package = require("dgeni").Package;
const path = require("path");
const util = require("util");
console.log(__dirname);
//    Create and export a new Dgeni package called dgeni-example. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
module.exports = new Package("dgeni-example", [
  require("dgeni-packages/jsdoc"),
  require("dgeni-packages/typescript"),
  require("dgeni-packages/nunjucks")
])
  .config(function(log) {
    log.level = "debug";
  })
  // Configure the processor for reading files from the file system.
  .config(function(readFilesProcessor, writeFilesProcessor) {
    readFilesProcessor.basePath = __dirname;
    readFilesProcessor.$enabled = false; // disable for now as we are using readTypeScriptModules

    writeFilesProcessor.outputFolder = path.join(__dirname, "build");
  })
  // Configure the processor for understanding TypeScript.
  .config(function(readTypeScriptModules) {
    readTypeScriptModules.basePath = __dirname;
    readTypeScriptModules.ignoreExportsMatching = [
      /^_/,
      "FormData",
      "URLSearchParams"
    ];
    readTypeScriptModules.hidePrivateMembers = true;
    readTypeScriptModules.sourceFiles = [
      "node_modules/arcgis-core/src/index.ts"
    ];
  })
  // Configure processor for finding nunjucks templates.
  .config(function(templateFinder, templateEngine) {
    // Where to find the templates for the doc rendering
    templateFinder.templateFolders = ["templates"];

    // Standard patterns for matching docs to templates
    templateFinder.templatePatterns = [
      "${ doc.template }",
      "${ doc.id }.${ doc.docType }.template.html",
      "${ doc.id }.template.html",
      "${ doc.docType }.template.html",
      "${ doc.id }.${ doc.docType }.template.js",
      "${ doc.id }.template.js",
      "${ doc.docType }.template.js",
      "${ doc.id }.${ doc.docType }.template.json",
      "${ doc.id }.template.json",
      "${ doc.docType }.template.json",
      "common.template.html"
    ];

    // dgeni disables autoescape by default, but we want this turned on.
    templateEngine.config.autoescape = true;

    // add a filter so we know what is going on...
    templateEngine.filters.push({
      name: "inspect",
      process: function(obj) {
        return util.inspect(obj, { depth: 2 });
      }
    });
  })
  // Configure ids and paths
  .config(function(
    computeIdsProcessor,
    computePathsProcessor,
    EXPORT_DOC_TYPES
  ) {
    computeIdsProcessor.idTemplates.push({
      docTypes: ["member"],
      getId: function(doc) {
        return doc.fileInfo.relativePath;
      },
      getAliases(doc) {
        return doc.classDoc.aliases.map(alias => alias + "." + doc.name);
      }
    });

    computePathsProcessor.pathTemplates.push({
      docTypes: ["member"],
      getPath: function computeModulePath(doc) {
        doc.moduleFolder = `${doc.id.replace(/\/index$/, "")}`;
        return doc.moduleFolder;
      },
      getOutputPath() {
        // These docs are not written to their own file, instead they are part of their class doc
      }
    });

    computePathsProcessor.pathTemplates.push({
      docTypes: ["module"],
      getPath(doc) {
        const name = doc.id.split("/")[1];
        return `api/${name}`;
      },
      getOutputPath(doc) {
        const name = doc.id.split("/")[1];
        return `api/${name}/index.html`;
      }
    });

    computePathsProcessor.pathTemplates.push({
      docTypes: EXPORT_DOC_TYPES,
      outputPathTemplate: "${moduleDoc.path}/${name}/index.html",
      pathTemplate: "${moduleDoc.path}/${name}"
    });
  });
