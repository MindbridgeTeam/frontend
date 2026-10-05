import { test } from "node:test";
import assert from "node:assert/strict";
import { createMockApi, demoAccounts } from "./mockApi.js";
test("credentials, roles and access restrictions", async () => {
  const api = createMockApi();
  await assert.rejects(api("requests"));
  await assert.rejects(
    api("login", { email: "wrong@example.com", password: "incorrect" }),
  );
  const u = await api("login", demoAccounts.user);
  assert.equal(u.role, "user");
  assert.equal(u.password, undefined);
  await assert.rejects(
    api("reviewRequest", { id: "MH-1048", status: "approved" }),
  );
});
test("check-ins and request decisions use shared data", async () => {
  const api = createMockApi();
  await api("login", demoAccounts.user);
  await api("saveCheckin", {
    mood: 4,
    stress: 2,
    energy: 3,
    sleep: 4,
    anxiety: 2,
  });
  assert.equal((await api("checkins")).length, 1);
  const r = await api("saveRequest", {
    reason: "Test",
    experience: "Demo",
    shareCheckins: true,
    shareHistory: false,
  });
  await api("logout");
  await api("login", demoAccounts.professional);
  assert.ok((await api("requests")).some((x) => x.id === r.id));
  assert.equal((await api("requestContext", { id: r.id })).checkins.length, 1);
  await assert.rejects(
    api("reviewRequest", { id: r.id, status: "declined", explanation: "" }),
  );
  await api("reviewRequest", { id: r.id, status: "approved" });
  await api("logout");
  await api("login", demoAccounts.user);
  assert.equal(
    (await api("requests")).find((x) => x.id === r.id).status,
    "approved",
  );
});
test("signup creates a regular account and rejects duplicate email", async () => {
  const api = createMockApi();
  const u = await api("signup", {
    email: "new@example.com",
    password: "testpass123",
    role: "professional",
  });
  assert.equal(u.role, "user");
  await assert.rejects(
    api("signup", { email: "new@example.com", password: "testpass123" }),
  );
});
