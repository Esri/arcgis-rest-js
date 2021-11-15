import { readFile } from "fs/promises";
import { fileFromPath } from "formdata-node/file-from-path";
import mime from "mime-types";

import { Blob, File } from "@esri/arcgis-rest-form-data";
import { addAttachment, addFeatures } from "@esri/arcgis-rest-feature-service";

const serviceUrl =
  "https://services9.arcgis.com/tPT6CGkx2VJKZshp/arcgis/rest/services/test_w_attachments/FeatureServer/0";

async function addDemoPoint() {
  const { addResults } = await addFeatures({
    url: serviceUrl,
    features: [
      {
        geometry: {
          x: getRandomInRange(-180, 180, 3),
          y: getRandomInRange(-180, 180, 3),
          spatialReference: { wkid: 4326 }
        },
        attributes: { name: `Upload Test: ${new Date().toISOString()}` }
      }
    ]
  });

  console.log("Add Feature Results:", addResults);

  return addResults[0].objectId;
}

try {
  const imagePath = "./image.jpg";
  const objectId = await addDemoPoint();

  // Option 1: using the `fileFromPath` utility
  const file = await fileFromPath(imagePath);

  // Option 2: using `fs.readFile` and converting Buffer to Blob
  const buffer = await readFile(imagePath);
  const blob = new Blob([new Uint8Array(buffer).buffer], {
    type: mime.lookup(imagePath)
  });

  // Option 3: convert from Buffer to Blob to file
  const fileFromBlob = new File([blob], "fileFromBlob.jpg", {
    type: mime.lookup(imagePath)
  });

  // Option 4: convert from Buffer to File
  const fileFromBuffer = new File(
    [new Uint8Array(buffer).buffer],
    "fileFromBuffer.jpg",
    {
      type: mime.lookup(imagePath)
    }
  );

  const results = await Promise.all([
    addAttachment({
      url: serviceUrl,
      featureId: objectId,
      attachment: file
    }),
    addAttachment({
      url: serviceUrl,
      featureId: objectId,
      attachment: blob
    }),
    addAttachment({
      url: serviceUrl,
      featureId: objectId,
      attachment: fileFromBlob
    }),
    addAttachment({
      url: serviceUrl,
      featureId: objectId,
      attachment: fileFromBuffer
    })
  ]);
  console.log("Add Attachment Results:", results);
} catch (e) {
  console.error(e);
}

// Used for generating a random lat/lng
// from https://stackoverflow.com/a/6878845
function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}
