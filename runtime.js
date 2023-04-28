(async function (lib) {
  const componentPromises = {};

  // Logging for demo.
  const logElement = document.getElementById("log");
  logElement.textContent = "";
  lib.log = (message) => {
    logElement.textContent += `${message}\n`;
  };
  lib.log("Runtime loaded");

  lib.uponComponentsLoaded = (...componentSlugs) => {
    const promises = [];
    for (const slug of componentSlugs) {
      if (!slug in componentPromises) {
        componentPromises[slug] = new Promise();
      }
    }
    return promises;
  };

  const getComponentPromises = async (deps) => {
    const promises = [];
    for (const dep of deps) {
      if (!componentPromises[dep]) {
        let resolve, reject;
        let promise = new Promise((res, rej) => {
          [resolve, reject] = [res, rej];
        });
        componentPromises[dep] = { promise, resolve, reject };
      }
      promises.push(componentPromises[dep]);
    }
    return promises;
  };

  const init = async(slug, component, deps = []) => {
    if (componentPromises[slug]) {
      componentPromises[slug].resolve(component);
    }

    await Promise.all(getComponentPromises(deps));

    // TODO: Wait for the deps to load.
    component(lib);
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
