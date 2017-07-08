
const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes() {
  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = import('containers/HomePage');

        const renderRoute = loadModule(cb);

        importModules.then((component) => (
          renderRoute(component)
        ));

        importModules.catch(errorLoading);
      },
    }, {
      path: '/settings',
      name: 'settings',
      getComponent(nextState, cb) {
        import('containers/FeaturePage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
