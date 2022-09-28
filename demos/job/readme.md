# Job Class Demo

This demo shows how to use the `Job` class to submit a job and retrieve the results.

## Setup

1. First `npm run build` in the ArcGIS REST JS root folder to setup the dependencies.
3. Job has a `submitJob()` function that takes url, params, and authentication parameters. The response from this method returns an instance of the `Job` class.
4. To retrieve results, call `getAllResults()` in your `Job` instance which will check to see if the job is completed and returns the results if so.
5. In the terminal, run `npm start`.