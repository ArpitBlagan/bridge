import request from "supertest";
import { app } from "../src/index";

beforeEach((): void => {
  jest.setTimeout(10000);
});
//check that jest working or not
describe("Server.ts tests", () => {
  test("Math test", () => {
    expect(2 + 2).toBe(4);
  });
});
//test the api endpoints
describe("test our routes", () => {
  test("get tokens", async () => {
    const res = await request(app).get("/api/getTokens");
    expect(res.status).toEqual(200);
  }),
    test("search api", async () => {
      const res = await request(app).get("/api/search?search=ETH");
      expect(res.status).toEqual(200);
    }),
    test("get quote endpoint", async () => {
      const res = await request(app).get(
        "/api/getQuote?srcChainId=10&srcQuoteTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&srcQuoteTokenAmount=1000000000000000000&dstChainId=56&dstQuoteTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&slippage=1",
      );
      expect(res.status).toEqual(200);
    });
});
