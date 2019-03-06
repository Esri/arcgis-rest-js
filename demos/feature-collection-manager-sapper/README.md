# Web map checker

This app demonstrates the user of ArcGIS REST JS with [sapper](https://sapper.svelte.technology/) a cutting edge web framework. [sapper is built on the [svelte](https://svelte.technology) component library and is a universal app framework that supports both client and sererside rendering.

You may want to use a universal framework in your for a few reasons:

1. Better SEO, because the app is rendered on the server search engines like Google can read the content for index your pages
2. Very fast performance. Because the app is rendered on the server browsers will render the initial HTML on the page providing a very fast experience, then JavaScript loads making hte app interactive.
3. Server based sign in experiences can have longer sessions with less logins.
4. You might want access to a users token on teh server side to perform background tasks like monitoring or data processing
5. Increased security. In this example a users token is never stored on the client. Instead a a secure cookie is used on the client pairs with an encrypted session store on the server.

Since ArcGIS REST JS works on both the client and the server it is ideal for use in universal frameworks.

Sapper is still in alpha and should not be used for production. However there are other universal app frameworks like [Nuxt](https://nuxtjs.org/) (Vue SJ) and Next](https://nextjs.org/) (React)

## App Overview

Sapper works by starting up an [Express JS](https://expressjs.com/) web server and creating a route for each of the files in `src/routes`. Files ending in `.js` are API endpoints and files ending in `.html` are rendered as Svelte components.

The app has 4 API endpoints

* `src/routes/auth/authorize` - starts the oAuth 2.0 process to sign in a user.
* `src/routes/auth/post-sign-in` - competes the oAuth 2.0 process
* `src/routes/auth/exchange-token` - provides a fresh token based on the secure session when the current token expires
* `src/routes/auth/sign-out` - signs the user out, destroying the saved session on the server and the session cookie

and 3 Svelte endpoints:

* `src/routes/index.html` - renders the main page for signed out users which shows a sign in buttons.
* `src/routes/webmaps/index.html` - renders a list of the users webmaps
* `src/routes/webmaps//[webmapId].html` - renders a detailed view for a webmap. The brackets indicate that will be replaced by an actual URL like `/webmaps/`


The `server.js` file defines the server and sets up [`express-session`](https://www.npmjs.com/package/express-session) with [`session-file-store`](https://www.npmjs.com/package/session-file-store) as well as defining the server side Svelte `Store` used to power the server side rendering.

`client.js` consumes the server side Svelte `Store` and uses it to hydrate the client side `Store`.

Once the app boots subsequent naviation by the user are handled client side by the app for better performance.



https://github.com/sveltejs/sapper-template
