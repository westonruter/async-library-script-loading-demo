(async function (lib) {
  const componentDeferrals = {};

  // Logging for demo.
  const logElement = document.getElementById("log");
  logElement.textContent = "";
  lib.log = (message) => {
    logElement.textContent += `${message}\n`;
  };
  lib.log("Runtime loaded");

  // lib.uponComponentsLoaded = (...componentSlugs) => {
  //   const promises = [];
  //   for (const slug of componentSlugs) {
  //     if (!slug in componentPromises) {
  //       componentPromises[slug] = new Promise();
  //     }
  //   }
  //   return promises;
  // };
  

  const getComponentDeferrals = (deps) => {
    const deferrals = [];
    for (const dep of deps) {
      if (!componentDeferrals[dep]) {
        let resolve, reject;
        let promise = new Promise((res, rej) => {
          [resolve, reject] = [res, rej];
        });
        deferrals[dep] = { promise, resolve, reject };
      }
      deferrals.push(componentDeferrals[dep]);
    }
    return deferrals;
  };

  const init = async(slug, component, deps = []) => {
    const [ deferral ] = getComponentDeferrals( [ slug ] );
    
    const depDeferrals = getComponentDeferrals(deps);
    console.info(ps)

    //await Promise.all(ps);

    // TODO: Wait for the deps to load.
    component(lib);
    
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
