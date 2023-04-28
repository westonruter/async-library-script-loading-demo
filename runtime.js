(function (lib) {

  var logElement = document.getElementById('log');
  logElement.innerHTML = '';
  
  lib.log = (message) => {
    
  };
  
  // Execute any components that have been previously registered.
  while ( lib.length) {
    const component = lib.shift();
    component(lib);
  }
  
  // When any subsequent components are registered, execute immediately.
  lib.push = (component) => {
    component(lib);
  };
})(self.MyAsyncLib = self.MyAsyncLib || []);
