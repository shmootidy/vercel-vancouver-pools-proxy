# Vancouver Pools Proxy

This is a serverless backend that handles the API requests for my frontend app, [Lower Mainland Pools](https://shmootidy.github.io/lower-mainland-pools).

It has three purposes:

1. Serving as a proxy server for requests to the City of Vancouver's community centre calendars.
2. Handling GET requests to my database, where I store details on the pools' amenities and cleaning schedules.
3. Populating the database with amenities and scheduling information.
    * These requests are handled manually, not through the app itself. One of them, populatePoolClosures, is triggered by a cron job.

## How it works

Vercel has a nice integration with Github, automatically deploying any changes pushed to the main branch of this repository.

Setting it up took the following steps:

1. Pushing this repo to Github.
2. Deploying this repo in Vercel. (Creating a new project in Vercel and pointing it to the Github repo.)
3. Pointing the frontend to the Vercel domain URL.

## Making changes

This backend is hooked up to two different places:
1. The Github Actions (cron job).
    * The commands for these actions are in this repo, in `/workflows/main.yml`
2. The frontend of the app.

**When making changes to the files, their names or the logic therein, take care that the frontend and the cron commands are likewise updated.**

Development can be done locally, by running `vercel dev` (which automatically uses port 3000) or `vercel dev --listen 3001`, and then pointing the frontend to the local url. (Don't forget to point the frontend back to the deployed app, if you're deploying frontend changes too!)

The serverless functions can be triggered manually with `curl -X POST <path to file>`. I use this mostly to check the manual files (`/api/manual`).

The cron-job can be triggered manually through Github by visiting the Actions tab on this repository, selecting the name of the cron job from the sidebar, and then clicking "Run Workflow".

## Notes on limitations:

Hosted on Vercel as part of a hobby project, it can handle a maximum of 12 function files, so it's pretty limited in scope.

## Possible To Dos

Writing out this README has me thinking: *Should I handle the manual jobs in another backend?*

I intend on building the app to include pools from neighbouring municipalities. Since Vercel has a 12-function-file limitation, I'll need to create different deployments to handle these municipalities. Since they'll also required cron jobs, it might make sense to have my backend structured like this:

  - Vancouver Pools frontend API requests (to pool calendars)
  - Other Pools frontend API requests (to pools calendars)
  - API requests to the database (including cron jobs?)
  - (API requests with the manual, cron jobs separately?)

Or I can keep things organized by municipality:
  - Vancouver Pools frontend API requests (to calendars and the database), AND manual jobs
  - Other Pools frontend API requests (to calendars and the database), AND manual jobs

I'll have to explore how the other pools have their schedule endpoints written and the layout of their websites. It might make more sense to keep things organized by municipality, and it might make more sense to have things organized by task. Like... do I want a main.yml file in each repository? :thinky-face:

## Definite To Dos

- Make this Typescript. JavaScript is so loosey goosey, it makes me very uneasy.
