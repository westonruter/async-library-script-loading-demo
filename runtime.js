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
   *
   * @param {string[]} slugs
   * @return {Array.<{promise: Promise, resolve: Function, reject: Function}>}
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

  /**
   * Register the component and execute it once its dependencies have been executed.
   *
   * @param {string} slug
   * @param {Function} component
   * @param {?string[]} deps
   */
  const init = async (slug, component, deps = []) => {
    const [deferral] = getComponentDeferrals([slug]);
    const dependencies = getComponentDeferrals(deps);

    await Promise.all(dependencies.map((deferral) => deferral.promise));

    component(lib);
    deferral.resolve(component);
  };

  // Execute any components that have been previously registered.
  while (lib.length) {
    const [slug, component, deps] = lib.shift();
    init(slug, component, deps);
  }

  // From now on, when any subsequent components are registered, execute immediately.
  lib.push = (args) => {
    init(...args);
  };
})((self.MyAsyncLib = self.MyAsyncLib || []));
