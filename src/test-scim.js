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

    const user = helpers.fakeUserProfile();
    const groupname = 'Group1';
    const group = helpers.newGroup(groupname);
    // console.log(JSON.stringify(user));
    // console.log(JSON.stringify(group));
    let userid = undefined, groupid = undefined;
    // let groupid = undefine;

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

      // await console.log(res.body)
      expect(res).to.have.status(200);
      const userCount = res.body.totalResults;
      expect(userCount).equals(res.body.Resources.length);
      expect(res.body.Resources[0].userName).to.equal('admin');
    });

    it('should be able to create user', async () => {
      const res = await scimAgent
        .post('/Users')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/scim+json')
        .send(JSON.stringify(user));

      expect(res).to.have.status(201);
      expect(res.body.userName).to.equal(user.userName);
      expect(res.body.active).to.equal(true);

      userid = res.body.id;
    });

    it('should be able to query user by Id', async () => {
      const res = await scimAgent
        .get(`/Users/${userid}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.userName).to.equal(user.userName);
      expect(res.body.active).to.equal(true);
    });

    it('should be able to update user', async () => {
      user.emails[0].display = 'modified@testmail.com';

      const res = await scimAgent
        .put(`/Users/${userid}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/scim+json')
        .send(JSON.stringify(user));

      expect(res).to.have.status(200);
      expect(res.body.emails[0].display).to.equal('modified@testmail.com');
      expect(res.body.active).to.equal(true);
    });

    it('should be able to list groups', async () => {
      const res = await scimAgent
        .get('/Groups')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/scim+json');

      // await console.log(res.body)
      expect(res).to.have.status(200);
      const userCount = res.body.totalResults;
      expect(userCount).equals(res.body.Resources.length);
    });

    it('should be able to create group', async () => {
      const res = await scimAgent
        .post('/Groups')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/scim+json')
        .send(JSON.stringify(group));

      expect(res).to.have.status(201);
      expect(res.body.displayName).to.equal(group.displayName);

      groupid = res.body.id;
    });

    it('should be able to query group by Id', async () => {
      const res = await scimAgent
        .get(`/Groups/${groupid}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.displayName).to.equal(group.displayName);
    });

    it('should be able to update Group - Add User', async () => {
      const updGroup = helpers.updateGroupAddUser(userid, groupname);
      // console.log(JSON.stringify(updGroup));
      const res = await scimAgent
        .put(`/Groups/${groupid}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/scim+json')
        .send(JSON.stringify(updGroup));

      expect(res).to.have.status(200);
      expect(res.body.id).to.equal(groupid);
      expect(res.body.members[0].value).to.equal(userid);
    });

    it('should be able to delete group', async () => {
      const res = await scimAgent
        .del(`/Groups/${groupid}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(204);
    });

    it('should be able to delete user', async () => {
      const res = await scimAgent
        .del(`/Users/${userid}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(204);
    });
  });
});
