const { onerror } = require("x-utils-es/umd");
try {
  /**
   * process of execution:
   * 1. process cli commands
   * 2. validate and create schema
   * 3. initiate Walle with new schema
   */

  // test executed commands
  const commands = require("./Pre-process");
  const schema = require("./Schema")(commands);

  // send valid to walle
  const Walle = require("./Walle")(commands);
  const debug = true;
  const opts = {
    strict: false, // when set will not allow any erros from schema to pass
    schema, // commands for Walle to walk
    memory: true, // memory/state, writes last cli command>state to ./memory/walle_state.json
  };
  const wlle = new Walle(opts, debug);

  /// //////// output
  /// ////////////////
  console.log(wlle.walk().print());
} catch (err) {
  onerror(err);
}
