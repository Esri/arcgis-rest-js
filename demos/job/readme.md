# Job Class Demo

This demo shows how to use the `Job` class to submit a job and retrieve the results.

## Setup

1. First `npm run build` in the ArcGIS REST JS root folder to setup the dependencies.
2. Copy `.env.example` to `.env` and add your API key. This is used in the script for authentication.
3. Job has a `submitJob()` function that takes url, params, and authentication parameters. The response from this method returns a `jobId` and `jobStatus`.
4. To retrieve results, call `getAllResults()` which will check to see if the job is completed from the instance id from the class and returns the results if so.

## Running the demo

5. In the terminal, run `npm start`.