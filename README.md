# Vancouver Pools Proxy

This is a serverless backend that handles the API requests for my frontend app, [Lower Mainland Pools](!https://shmootidy.github.io/lower-mainland-pools).

It has three purposes:

1. Serving as a proxy server for requests to the City of Vancouver's community centre calendars.
2. Handling GET requests to my database, where I store details on the pools' amenities and cleaning schedules.
3. Populating the database with amenities and scheduling information.

- These requests are handled manually, not through the app itself. One of them, populatePoolClosures, is triggered by a cron job.

## Notes on limitations:

Hosted on Vercel as part of a hobby project, it can handle a maximum of 12 function files, so it's pretty limited in scope. It's also perfect for what my app needs: serving as a proxy
