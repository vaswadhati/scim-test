const chai = require('chai');
const http = require('chai-http');
const helpers = require('./helpers');

// const jwt = require('jsonwebtoken');
// const snapshot = require('snap-shot-it');

const client_id = process.env.SCIM_CLIENT_ID;
const client_secret = process.env.SCIM_CLIENT_SECRET;

// FIX ME! use let's encrypt
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// TODO: switch to modules when NodeJS supports ESM
const expect = chai.expect;
chai.use(http);

// TODO: fix me!
const scimServer = 'https://kl/identity/restv1/scim/v2';
const authServer = 'https://kl/oxauth/restv1';
const errorLocation = 'https://kl/identity/error';

// NOTE: scimServer is a closure and should be defined by this point
const scimApi = () => chai.request(scimServer);

describe('SCIM API', () => {
  before((done) => {
    // console.log(`SCIM server is at ${scimServer}`);
    // console.log(`client-id    : ${client_id}`);
    // console.log(`client-secret: ${client_secret}`);
    done();
  });

  after((done) => {
    console.log('Bye bye!');
    done();
  });

  context('Non-functional requirements', () => {
    it('Use fake data to test', async () => {
      const user = helpers.fakeUserProfile();
      expect(user).to.not.be.empty;

      // FIX ME! add checks to ensure compliance
    });
  });

  context('When not authenticated', () => {
    it('scim access should redirect', async () => {
      const response = await scimApi().options('/Users');
      expect(response).to.redirectTo(errorLocation);

      // Technically, should this not be forbidden and not a redirect?
    });
  });

  context('When authenticated', () => {
    let token = undefined,
      token_type = undefined,
      token_expires = undefined;

    const scimAgent = chai.request.agent(scimServer);

    before('get token', async () => {
      const authAgent = chai.request.agent(authServer);

      const res = await authAgent
        .post('/token')
        .auth(client_id, client_secret)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          grant_type: 'client_credentials'
        });

      token = res.body.access_token;
      token_type = res.body.token_type;
      token_expires = res.body.expires_in;

      expect(token).to.be.not.null;
      expect(token_type).to.equal('bearer');
      expect(token_expires).to.be.not.null;
    });

    after('release token', async () => {
      token = undefined;
    });

    it('should be able to list users', async () => {
      const res = await scimAgent
        .get('/Users')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/scim+json');

      expect(res).to.have.status(200);

      // FIX ME! add more expects
    });

    it('should be able to create user', async () => {
      const user = helpers.fakeUserProfile();
      // console.log(JSON.stringify(user));

      const res = await scimAgent
        .post('/Users')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/scim+json')
        .send(JSON.stringify(user));

      // await console.log(res.body);
      expect(res).to.have.status(201);

      // FIX ME! add more expects
    });
  });
});
