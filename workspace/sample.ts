/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { searchItems } from "../packages/arcgis-rest-portal/dist/esm/index.js";

// If you are using node < 14.8, you need to wrap the await in an async IFFE
//(async function () {
const response = await searchItems("water");
console.log(`Public item search for "water": ${response.total} total results`);
response.results.map((itm) => {
  console.log(`Title: ${itm.title}`);
});
// })();
