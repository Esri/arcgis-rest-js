# Using API Keys for Portal Functions

When an API key is created with personal scopes it returns user information in the  `portal/self` and `community/self` endpoints. This information includes the username which is used to construct various request URLs.

To run this example:

1. Create an API key with the privileges to create, read and update items.
2. Copy `config.template.ts` to `config.ts` and replace the API key with the API key from step 1.
3. Run `npm install` and `npm start`