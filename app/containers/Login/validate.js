const testEmail = (toTest) => {
  /* eslint-disable no-useless-escape */
  const regexp = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
  /* eslint-enable no-useless-escape */
  return regexp.test(toTest);
};

export default (values) => {
  const errors = {};
  const username = values.get('username');
  const password = values.get('password');

  if (!testEmail(username)) {
    errors.username = 'Must be email';
  }
  if (password && password.length < 8) {
    errors.password = 'Must be at least 8 characters';
  }
  return errors;
};
