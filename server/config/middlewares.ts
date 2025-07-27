// export default [
//   'strapi::logger',
//   'strapi::errors',
//   'strapi::security',
//   'strapi::cors',
//   'strapi::poweredBy',
//   'strapi::query',
//   'strapi::body',
//   'strapi::session',
//   'strapi::favicon',
//   'strapi::public',
// ];
// server/config/middlewares.ts
export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      // THIS IS CRUCIAL: Explicitly list your origins. NO WILDCARD '*'
      origin: ["http://localhost:1337", "http://localhost:3000"],
      // Headers that your Next.js app might send. 'Authorization' is common for tokens.
      headers: ["Content-Type", "Authorization", "Accept"], // Be explicit, or use '*' if all else fails (but avoid with credentials)
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
      // THIS IS VITAL: Tell the browser that credentials (cookies, auth headers) are allowed
      credentials: true, // MUST be true if your frontend sends credentials
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
