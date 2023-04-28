(function (lib) {
  lib.promises = {};

  // Logging for demo.
  const logElement = document.getElementById('log');
  logElement.textContent = '';
  lib.log = (message) => {
    logElement.textContent += `${message}\n`;
  };
  lib.log( 'Runtime loaded' );

  lib.uponComponentsLoaded = (...componentSlugs) => {
    const promises = [];
    for ( const slug of componentSlugs ) {
      if ( ! slug in lib.promises ) {
        lib.promises[ slug ] = new Promise();
      }
    }
  };
  
  // Execute any components that have been previously registered.
  while ( lib.length) {
    const [ slug, init ] = lib.shift();
    lib.components[ slug ] = init;
    init(lib);
  }
  
  // When any subsequent components are registered, execute immediately.
  lib.push = (component) => {
    component(lib);
  };
})(self.MyAsyncLib = self.MyAsyncLib || []);
