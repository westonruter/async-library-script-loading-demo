(async function (lib) {
  const componentPromises = {};

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
      if ( ! slug in componentPromises ) {
        componentPromises[ slug ] = new Promise();
      }
    }
    return promises;
  };
  
  // Execute any components that have been previously registered.
  while ( lib.length) {
    const [ slug, component, deps ] = lib.shift();
    component(lib);
  }
  
  // When any subsequent components are registered, execute immediately.
  lib.push = ([slug, component, deps]) => {
    component(lib);
  };
})(self.MyAsyncLib = self.MyAsyncLib || []);
