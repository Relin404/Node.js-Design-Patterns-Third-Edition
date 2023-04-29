const originalRequire = require;

const fs = require("fs");

function loadModule(filename, module, require) {
  const wrappedSrc = `(function(module, exports, require) {
        ${fs.readFileSync(filename, "utf8")}
    })(module, module.exports, require)`;

  /**
   * eval() compiles and executes 'string of code' in runtime
   * Once executed, it is compiled into executable code by the JS engine.
   * Thus, any syntax errors or other issues that may arise in the code
   * will be identified at runtime, and may cause the eval() function to throw an error.
   */
  const evaluateStringCode = () => eval(wrappedSrc);
  evaluateStringCode();
}

// override
require = function require(moduleName) {
  console.log(`Require invoked for module: ${moduleName}`);
  /**
   * Resolve the full path (id) of the module.
   * ID is delegated to require.resolve().
   */
  const id = require.resolve(moduleName); // (1)

  /**
   * Returns the module if it has been already loaded and is available in cache.
   */
  if (require.cache[id]) return require.cache[id].exports; // (2)

  /**
   * If the module has never been loaded before,
   * it sets up the environment for the first load.
   * This object will be populated by the code of the module
   * to export its public API.
   */
  const module = {
    // (3)
    exports: {},
    id,
  };

  // update the cache
  require.cache[id] = module; // (4)

  // load the module
  loadModule(id, module, require); // (5)

  // return exported variables
  return module.exports; // (6)
};

require.cache = {};
require.resolve = (moduleName) => {
  /* resolve a full module id from the moduleName */
  // reuse the original resolving algorithm for simplicity
  return originalRequire.resolve(moduleName);
};

// load the entry point using our homemade 'require'
require(process.argv[2]);
