import { buildServer } from "../server";

test("health", async () => {
  const app = buildServer();
  const res = await app.inject({ method: "GET", url: "/health" });
  expect(res.statusCode).toBe(200);
  expect(res.json()).toEqual({ ok: true, service: "somnia-backend" });
});
