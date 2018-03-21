const faker = require('faker');

const formatName = (name) => ({
  formatted: name,
  familyName: name,
  givenName: name
});

const formatMail = (mail_id) => [{
  operation: null,
  value: mail_id,
  display: mail_id,
  primary: true,
  reference: null,
  type: 'other'
}];

const formatPhone = (phone_num) => [{
  value: phone_num,
  type: 'work'
}];

const fakeUserProfile = (overrides = {}) => {
  const { username, email, phone } = faker.helpers.contextualCard();

  const baseUser = {
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
    active: true,
    userName: username.toLowerCase().replace(/[ |.|_|-]/g, ''),
    displayName: username,
    name: formatName(username),
    emails: formatMail(email.toLowerCase()),
    phoneNumbers: formatPhone(phone),
    // _id: faker.random.uuid(),
    ...overrides,
  };

  const password = baseUser.password || faker.internet.password();

  return {
    ...baseUser, password
  };
};

// The minimum is inclusive and the maximum is excluded
function getRandomInRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  fakeUserProfile, getRandomInRange
};
