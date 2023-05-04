const prompts = require("prompts");
const chalk = require("chalk");
const { ArcGISIdentityManager } = require("@esri/arcgis-rest-request");
const {
  searchItems,
  removeItem,
  SearchQueryBuilder
} = require("@esri/arcgis-rest-portal");

// 1. Prompt the user for sign in. Create a `ArcGISIdentityManager`
authenticate()
  .then((session) => {
    console.log(session);
    console.log(chalk.blue(`Signed in as ${session.username}`));
    // once the user is signed in search for items
    return searchForItems(session);
  })
  .then(({ response, session }) => {
    console.log(chalk.blue(`Found ${response.results.length} items\n`));
    // take the items that were found and prompt the user if they want to delete them
    return deleteItems(response.results, session);
  })
  .then(() => {
    console.log(chalk.blue(`Done!`));
  });

// Prompt the user for a `username` and `password` return a `ArcGISIdentityManager`
// This function will run again on any error so it will retry until it works
function authenticate() {
  const authPrompts = [
    {
      type: "text",
      name: "username",
      message: "Username"
    },
    {
      type: "password",
      name: "password",
      message: "Password"
    }
  ];

  let session;

  // prompts returns a `Promise` that resolves with the users input
  return prompts(authPrompts)
    .then(({ username, password }) => {
      return ArcGISIdentityManager.signIn({
        username,
        password
      });
    })
    .catch((error) => {
      // in case of an `ArcGISRequestError` assume the `username` and `password`
      // are incorrect run the `authenticate` function again
      if (error.name === "ArcGISRequestError") {
        console.log(
          chalk.bold.red("Incorrect username and/or password please try again")
        );
        return authenticate();
      }

      // if this is a different error just log the error message and exit
      console.log(
        `${chalk.bold.red(error.name)} ${chalk.bold.red(error.message)}`
      );
    });
}

// given a `ArcGISIdentityManager` prompt the user for some search params and search for items
function searchForItems(session) {
  const searchPrompts = [
    {
      type: "text",
      name: "searchText",
      message: "Search Query"
    },
    {
      type: "list",
      name: "itemTypes",
      message: "Item Types"
    },
    {
      type: "list",
      name: "itemTags",
      message: "Tags"
    },
    {
      type: "number",
      name: "number",
      message: "How Many?"
    }
  ];

  // prompts returns a `Promise` that resolves with the users input
  return prompts(searchPrompts).then(
    //use ES2015 destructuring so we don't make any extra variables
    ({ searchText, itemTypes, itemTags, number }) => {
      const query = new SearchQueryBuilder()
        .match(session.username)
        .in("owner");

      // format the search query for item types
      const types = itemTypes.filter((type) => type.length);

      // format the search query for item types
      if (types.length) {
        query.and().startGroup();
        types.forEach((type, index, types) => {
          query.match(type).in("type");
          if (index !== types.length - 1) {
            query.or();
          }
        });
        query.endGroup();
      }

      // format the search query for item tags
      const tags = itemTags.filter((tag) => tag.length);

      if (tags.length) {
        query.and().startGroup();
        tags.forEach((tag, index, tags) => {
          query.match(tag).in("tags");
          if (index !== tags.length - 1) {
            query.or();
          }
        });
        query.endGroup();
      }

      // format the search query for the search text
      if (searchText.length) {
        query.and().match(searchText);
      }

      console.log(chalk.blue(`Searching ArcGIS Online: ${query.toParam()}`));

      return searchItems({
        authentication: session,
        q: query,
        num: number
      })
        .then((response) => {
          return { response, session };
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  );
}

// this give a list of `items` and a `ArcGISIdentityManager` this will ask us 1 at a time
// if we want to delte this item. This uses the new async iteration syntax with
// `Symbol.asyncIterator` to perform an async function in a loop
async function deleteItems(items, session) {
  // create our iterator which should return a `Promise`
  const asyncIterable = {
    [Symbol.asyncIterator]: () => ({
      // every time we ask for a new item
      next: function () {
        // remove the next item from the array
        const item = items.pop();

        // we are done if there is no item
        if (!item) {
          return Promise.resolve({ done: true });
        }

        // prompt to delete this item.
        return deleteItem(item, session);
      }
    })
  };

  // lets get our `next` function so we can itterate over it
  const { next } = asyncIterable[Symbol.asyncIterator]();

  for (
    let { done, deleted, item } = await next(); // start condition, call next and wait for the `Promise` to resolve, results are destructed.
    !done; // end condition,
    { done, deleted, item } = await next() // action on every loop, sets up the next round of checks
  ) {
    if (deleted) {
      console.log(chalk.green(`${item.title} deleted successfuly\n`));
    } else {
      console.log(chalk.gray(`${item.title} skipped\n`));
    }
  }

  // since this is inside an async function code execution is stopped at the loop
  // this will return an empty resolved `Promise` when the loop is done.
  return Promise.resolve();
}

function deleteItem(item, session) {
  console.log(`Title:    ${chalk.bold.green(item.title)}`);
  console.log(`Tags:     ${item.tags.join(", ")}`);
  console.log(`Type:     ${item.type}`);
  console.log(`ID:       ${item.id}`);
  console.log(`Owner:    ${item.owner}`);
  console.log(`Created:  ${new Date(item.created).toLocaleDateString("en")}`);
  console.log(`Modified: ${new Date(item.modified).toLocaleDateString("en")}`);

  const deleteQuestions = [
    {
      type: "toggle",
      name: "del",
      message: "Delete this item?",
      initial: false,
      active: "yes",
      inactive: "no"
    }
  ];

  return prompts(deleteQuestions).then(({ del }) => {
    if (del) {
      console.log(chalk.red.bold(`Deleting ${item.title}`));
      return removeItem({
        id: item.id,
        authentication: session
      }).then(() => {
        return Promise.resolve({ done: false, deleted: del, item });
      });
    }

    return Promise.resolve({ done: false, deleted: del, item });
  });
}
