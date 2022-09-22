import { Job, JOB_STATUSES } from "@esri/arcgis-rest-request";

Job.submitJob({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob",
  params: `{("DATE" > date '1998-01-01 00:00:00' AND "DATE" < date '1998-01-31 00:00:00') AND ("Day" = 'SUN' OR "Day"= 'SAT')}`,
  startMonitoring: true,
  pollingRate: 1000
}).then(async (job: any) => {
  job.on(JOB_STATUSES.Status, (message: any) => console.log(message));
  await job.getAllResults().then((result: any) => console.log(result)).then(() => job.stopEventMonitoring())
});