# SCIM-2 Mocha Driven Tests

## Introduction
This project contains a set of test cases for SCIM-2 endpoint.

In order run these tests you will need to:
- identify a SCIM provider to test
- register with the SCIM provider to obtain CLIENT_ID and CLIENT_SECRET
- set the environment variables SCIM_CLIENT_ID and SCIM_CLIENT_SECRET to the above

## Objectives
Software development has changed dramatically in the past couple of years.
This project was created as a way to illustrate the development process using
a few of the tools, methodologies and best practices. A list of what I think
is pertinent follows:
- [x] Learn git (and explore github features)
- [x] The basics: README and LICENSE
- [x] Use lint and make it specific for the project type (i.e backend vs frontend)
- [x] Remember to .gitignore
- [x] Rather than twiddle with your editor, agree on .editorconfig for all
- [ ] Use git precommit hooks
- [x] Use modern JavaScript (ES6/7)
- [x] Illustrate BDD (using Mocha+Chai)
- [x] Keep git commits to logical units of work
- [x] Commit often; you can squash before push to keep it logical
- [x] Do not let the perfect be the enemy of the good
- [x] Never store credentials in the source code; use environment variables

Some of the above objectives or lessons were met during the time of the baseline commit.
The hope is to add more and address them as the opportunities arrive.

## Install

Clone this project from github and then:
```sh
cd scim-test
npm install

SCIM_CLIENT_ID=client-id SCIM_CLIENT_SECRET=client-secret npm run test
```

## Features

- TODO: highlight salient features of BDD
- NOTE: Mocha is developer friendly bdd; cucumber/gherkin is business friendly bdd :-)

## Git Related Notes:
- To allow for password-less remote push, set remote to use git (not https) protocol
See https://stackoverflow.com/questions/16330404/how-to-remove-remote-origin-from-git-repo#16330439


## License
MIT - See LICENSE.md

