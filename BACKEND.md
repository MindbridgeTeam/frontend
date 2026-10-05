# Backend handoff — proposed contract

These paths are proposals, not claims about an existing server. Agree them with the backend developer, or edit only `src/services/api.js` to map the existing API.

## Transport
Base URL: `VITE_API_BASE_URL`. JSON request bodies. Success: `{ "data": <result> }`. Failure: `{ "error": { "message": "Readable message", "code": "OPTIONAL_CODE" } }` with an appropriate non-2xx status. Logout may return 204. Use HttpOnly cookie sessions; fetch sets `credentials: 'include'`. Backend owns CORS credentials/origins, secure cookies and CSRF defenses. Session returns User or null. Login/signup return User and establish the session. Never return password hashes.

## Endpoints
| Method | Path | Body / result |
|---|---|---|
| GET | /auth/session | User or null |
| POST | /auth/login | {email,password} → User |
| POST | /auth/signup | {email,password} → User, regular role only |
| POST | /auth/logout | Clear session |
| GET | /resources | Resource[] |
| GET | /resources/:id | Resource |
| GET | /check-ins | Current user's CheckIn[] |
| POST | /check-ins | {mood,stress,energy,sleep,anxiety,note} → CheckIn |
| POST | /reflections | {answers:[{question,answer}]} → Reflection |
| GET | /plans | Current user's Plan[] |
| POST | /plans | {goal,action,when} → Plan |
| PATCH | /plans/:id | {id,completed} → Plan |
| GET | /consultation-requests | Own requests for users; assigned requests for professionals |
| POST | /consultation-requests | {reason,experience,duration,tried,shareCheckins,shareHistory} → Request |
| PATCH | /professional/requests/:id | {id,status,explanation} → Request |
| GET | /professional/requests/:id/context | {checkins:[],history:[]} filtered by consent |
| GET | /professional/consultations | Consultation[] |
| GET | /professional/profile | ProfessionalProfile |
| PATCH | /professional/profile | Editable name/speciality/availability/notifications → ProfessionalProfile |
| GET | /notifications | Notification[] |
| POST | /partnership-enquiries | {name,organisation,email,message} → {id,...} public endpoint |
| POST | /chat/messages | {message} → {id,role:'assistant',content} |

Chat is currently a single reply operation. Conversation IDs/history, streaming, appointment creation and password recovery are extension points requiring agreed backend routes; they are not silently implemented.

## Records
```js
User = { id, name, email, role: 'user' | 'professional' }
CheckIn = { id, userId, mood, stress, energy, sleep, anxiety, note, createdAt }
// All scores are integer 1..5; stress/anxiety higher means more difficulty.
Resource = { id, title, category, description, body, reviewStatus }
Plan = { id, userId, goal, action, when: 'YYYY-MM-DD', completed }
Reflection = { id, userId, answers: [{question,answer}], createdAt }
Request = {
 id, userId, professionalId, reason, experience, duration, tried,
 shareCheckins, shareHistory,
 status: 'pending' | 'approved' | 'more_information' | 'declined',
 createdAt, updates: [{status, explanation, createdAt}]
}
Consultation = { id, requestId, professionalId, time: 'HH:mm', date: 'YYYY-MM-DD', status: 'upcoming' | 'past', notes }
ProfessionalProfile = { name, speciality, verification, availability, notifications }
Notification = { id, title, message, destination }
```

Dates and IDs are server-generated. Frontend does not send userId or professionalId on new requests; server derives owner from session and controls assignment. Approval is a decision, not proof of a booked consultation. Decline/more-information require an explanation. Verification is server controlled and not an editable profile field.

## Permissions and validation
- Public signup cannot assign a professional role; professional onboarding/verification is controlled separately.
- Users read/write only their own records; professionals read/update only assigned requests and permitted context.
- Sharing is explicit and defaults off. Do not include unshared chat/reflection records in professional responses.
- Validate email, password rules, lengths, score range and enum values server-side.
- NGO enquiries need public endpoint validation and spam/rate controls, not account sign-in.
- Frontend plain text resource rendering deliberately avoids raw HTML. If rich content is supplied later, agree a sanitized format.

## Demo integration test
1. Sign in as user, save check-in, submit consultation with sharing toggles selected.
2. Sign out, sign in as professional, open Requests → All requests, review the new request.
3. Approve or ask for information with an explanation.
4. Sign out, sign in as the original user, open Request status. The update appears.
5. Do not refresh during this test: mock records are in memory.

## Scope
Screens 19/20 intentionally excluded. UI designed from supplied PNG exports, with shared responsive layouts. Demo content is clearly labelled. No third-party AI credentials in the browser. Backend production data/storage, professional account provisioning and delivery providers remain server responsibilities.
