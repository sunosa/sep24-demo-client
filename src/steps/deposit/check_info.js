const Config = require("src/config");
const get = require("src/util/get");
const prop = require("lodash.get");

module.exports = {
  instruction: "Check /info endpoint to see if we need to authenticate",
  action: "GET /info (SEP-0006)",
  execute: async function(state, { log, instruction, expect }) {
    const BRIDGE_URL = Config.get("BRIDGE_URL");
    log("GET /info");
    const result = await get(`${BRIDGE_URL}/info`);
    log("GET /info response");
    log(result);
    expect(
      prop(result, ["deposit", Config.get("ASSET_CODE"), "enabled"]),
      `${Config.get("ASSET_CODE")} is not enabled for deposit`
    );
    instruction(
      "Deposit is enabled, and requires authentication so we should go through SEP-0010"
    );
    state.interactive_url = Config.get("BRIDGE_URL") + result.url;
  }
};
