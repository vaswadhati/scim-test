const chai = require('chai');
const http = require('chai-http');
// const jwt = require('jsonwebtoken');
// const snapshot = require('snap-shot-it');

const client_id = process.env.SCIM_CLIENT_ID;
const client_secret = process.env.SCIM_CLIENT_SECRET;

// TODO: switch to modules when NodeJS supports ESM
const expect = chai.expect;
chai.use(http);

const scimServer = 'https://conduit.productionready.io/api';
const authServer = 'https://conduit.productionready.io/api';

// NOTE: scimServer is a closure and should be defined by this point
// const Api = () => chai.request(scimServer);

describe('SCIM API', () => {
  before((done) => {
    console.log(`SCIM server is at ${scimServer}`);
    // console.log(`client-id ${client_id}`);
    // console.log(`client-secret ${client_secret}`);
    done();
  });

  after((done) => {
    console.log('Bye bye!');
    done();
  });

  context('Non-functional requirements', () => {
    it('none at this point', async () => {
      // await () => {}
    });
  });

  context('When not authenticated', () => {
    it('TBD at this point', async () => {
      // expect(true).to.be.false; // fail here ...
    });
  });

  context('When authenticated', () => {
    before('get token', async () => {
      const authAgent = chai.request.agent(authServer);

      const res = await authAgent
        .post('/token')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          grant_type: 'client_credentials',
          client_id, client_secret
        });

      const token = res.body.access_token;
      const token_type = res.body.token_type;
      const token_expires = res.body.expires_in;

      expect(token).to.be.not.null;
      expect(token_type).to.equal('bearer');
      expect(token_expires).to.be.not.null;
    });

    after('release token', async () => {

    });

    it('should be able to create user', async () => {

    });
  });
});
