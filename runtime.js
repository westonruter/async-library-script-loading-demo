(async function (lib) {
  const componentDeferrals = {};

  // Logging for demo.
  const logElement = document.getElementById("log");
  logElement.textContent = "";
  lib.log = (message) => {
    logElement.textContent += `${message}\n`;
  };
  lib.log("Runtime loaded");

  /**
   * Get deferrals for the provided components.
   */
  const getComponentDeferrals = (slugs) => {
    const deferrals = [];
    for (const slug of slugs) {
      if (!componentDeferrals[slug]) {
        let resolve, reject;
        let promise = new Promise((res, rej) => {
          [resolve, reject] = [res, rej];
        });
        componentDeferrals[slug] = { promise, resolve, reject };
      }
      deferrals.push(componentDeferrals[slug]);
    }
    return deferrals;
  };

  const init = async(slug, component, deps = []) => {
    const [ deferral ] = getComponentDeferrals( [ slug ] );
    
    const dependencies = getComponentDeferrals(deps);
    console.log(dependencies.map( ( deferral ) => deferral.promise ))
    await Promise.all( dependencies.map( ( deferral ) => deferral.promise ) );
    

    //await Promise.all(ps);

    // TODO: Wait for the deps to load.
    component(lib);
    
    console.info(deferral)
    deferral.resolve( component );
  };

  // Execute any components that have been previously registered.
  while (lib.length) {
    const [slug, component, deps] = lib.shift();
    init(slug, component, deps);
  }

  // When any subsequent components are registered, execute immediately.
  lib.push = ([slug, component, deps]) => {
    init(slug, component, deps);
  };
})((self.MyAsyncLib = self.MyAsyncLib || []));
