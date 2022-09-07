# Job Class Demo

This demo explains how to use this class to submit a job and retrieve the results

## Setup

1. Make sure you run `npm run build` in the root folder to setup the dependencies
2. Job has a submitJob() that takes a url, params, and authentication, the response from this method should return a jobId and jobStatus
3. In order to retrive results, call getAllResults() which will check to see if the job is completed from the instance id from the class, then return all the results

## Running the demo

6. `npm start`