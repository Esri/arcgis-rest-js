# Blork: Contributing

Contributions welcome! I'm happy to receive pull requests for new checkers (e.g. if you find you're using custom checkers for things you think should be built-in). 

This tooling workflow exists to catch simple code mistakes (we all make em!) Once you learn to code against these tools programming becomes a lot more fun!

## Pull request rules

Please follow these (pretty obvious) guidelines:

1. Code should be fully linted with ESLint (or the PR will be automatically rejected by Travis CI)
2. Test suite must pass (or the PR will be automatically rejected by Travis CI)
3. New features should include corresponding unit tests (code coverage must be 100%)
4. New features should include new documentation in README.md

## Technical introduction

Blork is written in Javascript, uses ESLint for linting, Prettier for code style, and Jest for unit testing. Blork is deployed to NPM through Travis CI whenever a new tagged release is created on GitHub. 

TravisCI automatically checks (and rejects) pull requests that fail the unit tests or are improperly linted. If the tests pass the code is deployed to [npm](https://www.npmjs.com/) with [semantic-release](https://github.com/semantic-release/semantic-release). Version numbers are automatically bumped based on commit messages following the [Conventional Commits](https://conventionalcommits.org) format.

### 1. Clone and install (Git and yarn)

```sh
git clone https://github.com/dhoulb/blork.git
cd blork
yarn install
```

Clone the repo from GitHub and install dependencies with NPM.

### 2. Code

Write any code you like. Don't worry too much about style as Prettier will standardise it. Ensure all exported functions (the outer-facing edges of the module) validate their input arguments (e.g. with Blork) so the module is hardened against mistakes/misuse.

### 2. Lint and style (ESLint and Prettier)

```sh
yarn eslint:fix
```

Blork is linted using ESLint and code formatting is done with Prettier. ESLint will fix as many issues as it can, but any leftover linting should be fixed. Configuring your editor to report linting issues as-you-type and run `eslint --fix` on save makes this all a lot easier!

All code is reformatted using Prettier, so write using whatever style you like leave Prettier to fix it.

### 3. Unit tests (Jest)

```sh
yarn test
```

Tests are written in Jest and are in the `test/` directory. Run the test suite using `yarn test` on the command line, which will lint, style, and test the code.

Code coverage must be 100% or `yarn test` will also fail (this means every file, function, and branch of your code must be covered by a unit test.)

### Commit (Git)

```sh
git add .
git commit -m "feat: My changes"
git push origin
```

All commits on the master branch are automatically versioned and deployed with [semantic-release](https://github.com/semantic-release/semantic-release) so commit messages must follow the [Conventional Commits](https://conventionalcommits.org) format. This is enforced on commit by [commitlint](https://github.com/marionebl/commitlint).

commitlint, Jest, ESLint, and Prettier are run as a precommit hook (via [Husky](https://www.npmjs.com/package/husky)) so commits will fail if these don't pass.
