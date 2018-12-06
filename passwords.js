const platform = require('connect-platform');
const bcrypt = require('bcryptjs');


platform.core.node({
  path: '/passwords/hash',
  public: false,
  method: 'GET',
  inputs: ['password'],
  outputs: ['hash'],
  controlOutputs: [],
  hints: {
    node: 'hashes given <span class="hl-blue">password</span>.',
    inputs: {
      password: 'the raw password to be hashed.',
    },

    outputs: {
      hash: 'the hash of the given <span class="hl-blue">password</span>.'
    },
    controlOutputs: {}
  }
},
  (inputs, output, control, error) => {
    bcrypt.hash(inputs.password, 10).then(hash => {
      output('hash', hash);
    }).catch(error);
  }
);

platform.core.node({
  path: '/passwords/match',
  public: false,
  method: 'GET',
  inputs: ['password', 'hash'],
  outputs: [],
  controlOutputs: ['match', 'no_match'],
  hints: {
    node: 'checks if given <span class="hl-blue">password</span> matches given <span class="hl-blue">hash</span>.',
    inputs: {
      password: 'the raw password to be checked.',
      hash: 'the hash to be checked against.'
    },
    controlOutputs: {
      match: 'the given password matches the given hash',
      no_match: 'the given password does not match the given hash.',
    }
  }
},
  (inputs, output, control, error) => {
    bcrypt.compare(inputs.password, inputs.hash).then(match => {
      if (match) control('match');
      else control('no_match');
    }).catch(error);
  }
);
