import assert from "assert/strict";
import { getToken, tokenResponse, fetchApi } from "../routes/helpers.js";

describe("Test helper functions", function () {
  it("Should returns true if user is in blackList", async function () {
    const status = await fetchApi({
      first_name: "Joaquin",
      last_name: "Guzman",
      email: "joaquin@guzman.com",
    });
    assert.equal(status, true);
  });
  it("Should returns false if user is in blackList", async function () {
    const status = await fetchApi({
      first_name: "Joaquin1",
      last_name: "Guzman1",
      email: "joaquin1@guzman.com",
    });
    assert.equal(status, false);
  });
  it("Correct format token response", function () {
    const token = getToken("joaquin@guzman.com");
    const response = tokenResponse(token);
    const expectedResponse = { token, type: "Bearer" };
    assert.deepStrictEqual(expectedResponse, response);
  });
});
