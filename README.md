# SCIM-2 Mocha Driven Tests

A non-exhaustive set of test cases for SCIM-2 endpoint.

In order run these tests you will need to:
- identify a SCIM provider to test
- register with the SCIM provider to obtain CLIENT_ID and CLIENT_SECRET
- set the environment variables SCIM_CLIENT_ID and SCIM_CLIENT_SECRET to the above


## Install

Clone this project from github and then:
```sh
cd scim-test
npm install

SCIM_CLIENT_ID=client-id SCIM_CLIENT_SECRET=client-secret npm run test
```

## Features

TBD

## Development

TBD


## License

MIT
