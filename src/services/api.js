import { mockApi } from "../mocks/mockApi";
const mock = import.meta.env.VITE_USE_MOCK_API !== "false";
export const isDemo = mock;
const base = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
).replace(/\/$/, "");
// Proposed contract: JSON data envelopes and HttpOnly cookie sessions. See BACKEND.md.
const routes = {
  session: ["GET", "/auth/session"],
  login: ["POST", "/auth/login"],
  signup: ["POST", "/auth/signup"],
  logout: ["POST", "/auth/logout"],
  resources: ["GET", "/resources"],
  resource: ["GET", (p) => `/resources/${encodeURIComponent(p.id)}`],
  checkins: ["GET", "/check-ins"],
  saveCheckin: ["POST", "/check-ins"],
  saveReflection: ["POST", "/reflections"],
  plans: ["GET", "/plans"],
  savePlan: ["POST", "/plans"],
  updatePlan: ["PATCH", (p) => `/plans/${encodeURIComponent(p.id)}`],
  requests: ["GET", "/consultation-requests"],
  saveRequest: ["POST", "/consultation-requests"],
  reviewRequest: [
    "PATCH",
    (p) => `/professional/requests/${encodeURIComponent(p.id)}`,
  ],
  requestContext: [
    "GET",
    (p) => `/professional/requests/${encodeURIComponent(p.id)}/context`,
  ],
  consultations: ["GET", "/professional/consultations"],
  professionalProfile: ["GET", "/professional/profile"],
  saveProfessionalProfile: ["PATCH", "/professional/profile"],
  notifications: ["GET", "/notifications"],
  enquiry: ["POST", "/partnership-enquiries"],
  chat: ["POST", "/chat/messages"],
};
export async function api(operation, payload = {}) {
  if (mock) return mockApi(operation, payload);
  const [method, path] = routes[operation];
  const response = await fetch(
    base + (typeof path === "function" ? path(payload) : path),
    {
      method,
      credentials: "include",
      headers: method === "GET" ? {} : { "Content-Type": "application/json" },
      ...(method === "GET" ? {} : { body: JSON.stringify(payload) }),
    },
  );
  if (response.status === 204) return null;
  const result = await response.json().catch(() => null);
  if (!response.ok)
    throw Error(
      result?.error?.message || `Request failed (${response.status}).`,
    );
  return result?.data;
}
