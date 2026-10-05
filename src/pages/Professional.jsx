import { useState } from "react";
import { api } from "../services/api";
import {
  Card,
  Heading,
  Button,
  Field,
  AsyncForm,
  useLoad,
  LoadState,
  tones,
} from "../components/UI";
const statusLabel = {
  pending: "Pending",
  approved: "Approved",
  more_information: "More info",
  declined: "Declined",
};
export function ProfessionalDashboard({ navigate }) {
  const requests = useLoad(() => api("requests")),
    sessions = useLoad(() => api("consultations"));
  return (
    <>
      <Heading eyebrow="PROFESSIONAL WORKSPACE" title="Good afternoon.">
        Assigned work at a glance.
      </Heading>
      <LoadState state={requests}>
        <LoadState state={sessions}>
          <div className="grid three">
            {[
              [
                "Awaiting review",
                requests.data?.filter((r) => r.status === "pending").length,
                "Assigned requests",
                "professional-requests",
              ],
              [
                "Today",
                sessions.data?.filter(
                  (c) => c.date === new Date().toISOString().slice(0, 10),
                ).length,
                "Consultations",
                "professional-consultations",
              ],
              [
                "Follow-ups",
                requests.data?.filter((r) => r.status === "more_information")
                  .length,
                "Needs your response",
                "professional-requests",
              ],
            ].map(([t, n, copy, d], i) => (
              <button
                className={`tile ${tones[i]}`}
                key={t}
                onClick={() => navigate(d)}
              >
                <strong>{t}</strong>
                <span className="stat">{String(n || 0).padStart(2, "0")}</span>
                <small>{copy}</small>
              </button>
            ))}
          </div>
          <div className="split section">
            <Card>
              <h2>Today’s schedule</h2>
              {sessions.data?.map((c) => (
                <p className="schedule-row" key={c.id}>
                  <strong>{c.time}</strong> Consultation {c.requestId}
                </p>
              ))}
            </Card>
            <Card tone="mint">
              <h2>Review with context</h2>
              <p>
                Open an assigned request to see relevant intake details and
                approved shared trends.
              </p>
              <button onClick={() => navigate("professional-requests")}>
                Open Requests →
              </button>
            </Card>
          </div>
        </LoadState>
      </LoadState>
    </>
  );
}
export function ProfessionalRequests() {
  const state = useLoad(() => api("requests"));
  const [filter, setFilter] = useState("pending"),
    [selected, setSelected] = useState(null);
  if (selected)
    return (
      <Review
        id={selected}
        back={() => {
          setSelected(null);
          state.reload();
        }}
      />
    );
  const rows = (state.data || []).filter(
    (r) => filter === "all" || r.status === "pending",
  );
  return (
    <>
      <Heading eyebrow="PROFESSIONAL WORKSPACE" title="Assigned requests.">
        Review relevant intake and respond clearly.
      </Heading>
      <div className="actions">
        <Button
          secondary={filter !== "pending"}
          onClick={() => setFilter("pending")}
        >
          Awaiting review
        </Button>
        <Button secondary={filter !== "all"} onClick={() => setFilter("all")}>
          All requests
        </Button>
      </div>
      <LoadState state={state}>
        {rows.length ? (
          <div className="table-wrap section">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="badge">{statusLabel[r.status]}</span>
                    </td>
                    <td>
                      <button onClick={() => setSelected(r.id)}>
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="section">
            <p>No requests in this view.</p>
          </Card>
        )}
      </LoadState>
    </>
  );
}
function Review({ id, back }) {
  const state = useLoad(() => api("requests")),
    context = useLoad(() => api("requestContext", { id }), [id]);
  const [action, setAction] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const request = state.data?.find((r) => r.id === id);
  async function update(status, explanation = "") {
    setBusy(true);
    setError("");
    try {
      await api("reviewRequest", { id, status, explanation });
      state.reload();
      setAction("");
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button onClick={back}>← Assigned requests</button>
      <Heading eyebrow="PROFESSIONAL WORKSPACE" title={`Review ${id}`}>
        Assigned request
      </Heading>
      <LoadState state={state}>
        {request && (
          <>
            <Card>
              <h3>Reason for request</h3>
              <p>{request.reason}</p>
              <p>{request.experience}</p>
              <small>Duration: {request.duration}</small>
            </Card>
            <Card className="section">
              <h3>Relevant check-ins</h3>
              <LoadState state={context}>
                {request.shareCheckins ? (
                  context.data?.checkins.length ? (
                    context.data.checkins.map((c) => (
                      <p key={c.id}>
                        Mood {c.mood} · Stress {c.stress} · Sleep {c.sleep} ·
                        Anxiety {c.anxiety}
                      </p>
                    ))
                  ) : (
                    <p>No check-ins available.</p>
                  )
                ) : (
                  <p>Not shared by the user.</p>
                )}
              </LoadState>
            </Card>
            <Card className="section">
              <h3>Support history</h3>
              <p>{request.tried || "No previous steps provided."}</p>
              {request.shareHistory ? (
                context.data?.history.map((p) => (
                  <p key={p.id}>
                    {p.goal}: {p.action}
                  </p>
                ))
              ) : (
                <p>Plan history not shared.</p>
              )}
            </Card>
            <p>Current status: {statusLabel[request.status]}</p>
            {error && <p role="alert">{error}</p>}
            <div className="actions">
              <Button
                disabled={busy}
                onClick={() => update("approved").catch(() => {})}
              >
                ✓ Approve request
              </Button>
              <Button secondary onClick={() => setAction("more_information")}>
                Ask for more information
              </Button>
              <Button secondary onClick={() => setAction("declined")}>
                Decline with explanation
              </Button>
            </div>
            {action && (
              <Card className="section">
                <AsyncForm
                  key={action}
                  onSubmit={(d) => update(action, d.explanation)}
                  submit="Save decision"
                >
                  <Field
                    name="explanation"
                    label={
                      action === "declined"
                        ? "Explain your decision"
                        : "What information is needed?"
                    }
                    textarea
                    required
                  />
                </AsyncForm>
              </Card>
            )}
          </>
        )}
      </LoadState>
    </>
  );
}
export function ProfessionalConsultations() {
  const state = useLoad(() => api("consultations"));
  const [tab, setTab] = useState("upcoming"),
    [selected, setSelected] = useState(null);
  return (
    <>
      <Heading eyebrow="PROFESSIONAL WORKSPACE" title="Consultations">
        Upcoming and completed sessions.
      </Heading>
      <div className="actions">
        <Button
          secondary={tab !== "upcoming"}
          onClick={() => setTab("upcoming")}
        >
          Upcoming
        </Button>
        <Button secondary={tab !== "past"} onClick={() => setTab("past")}>
          Past
        </Button>
      </div>
      <LoadState state={state}>
        <div className="stack section">
          {!state.data?.filter((c) => c.status === tab).length && (
            <Card>No consultations in this view.</Card>
          )}
          {state.data
            ?.filter((c) => c.status === tab)
            .map((c) => (
              <Card key={c.id}>
                <div className="strip">
                  <strong>
                    {c.date} · {c.time}
                  </strong>
                  <div>
                    <h3>Consultation {c.requestId}</h3>
                    <small>
                      Only necessary session details are shown here.
                    </small>
                  </div>
                  <button
                    onClick={() => setSelected(selected === c.id ? null : c.id)}
                  >
                    View details
                  </button>
                </div>
                {selected === c.id && <p>{c.notes}</p>}
              </Card>
            ))}
        </div>
      </LoadState>
    </>
  );
}
export function ProfessionalSchedule() {
  const profile = useLoad(() => api("professionalProfile")),
    sessions = useLoad(() => api("consultations"));
  const [month, setMonth] = useState(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ),
    [selected, setSelected] = useState(new Date().toISOString().slice(0, 10));
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = (month.getDay() + 6) % 7;
  const key = (n) =>
    `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
  return (
    <>
      <Heading eyebrow="PROFESSIONAL WORKSPACE" title="Schedule">
        Manage your availability and booked sessions.
      </Heading>
      <div className="split">
        <Card>
          <div className="strip">
            <button
              aria-label="Previous month"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
            >
              ←
            </button>
            <h2>
              {month.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              aria-label="Next month"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
              }
            >
              →
            </button>
          </div>
          <div className="calendar">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <strong key={d}>{d}</strong>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <span key={`blank${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => i + 1).map((n) => (
              <button
                className={selected === key(n) ? "active" : ""}
                key={n}
                onClick={() => setSelected(key(n))}
              >
                {n}
              </button>
            ))}
          </div>
          <h3>{selected}</h3>
          <LoadState state={sessions}>
            {sessions.data?.filter((c) => c.date === selected).length ? (
              sessions.data
                .filter((c) => c.date === selected)
                .map((c) => (
                  <p key={c.id}>
                    {c.time} · {c.requestId}
                  </p>
                ))
            ) : (
              <p>No booked sessions for this date.</p>
            )}
          </LoadState>
        </Card>
        <Card tone="lavender">
          <h2>Availability</h2>
          <LoadState state={profile}>
            <AsyncForm
              onSubmit={(d) => api("saveProfessionalProfile", d)}
              onSuccess={profile.reload}
              submit="Save availability"
            >
              <Field
                label="Working hours"
                name="availability"
                defaultValue={profile.data?.availability}
                required
              />
            </AsyncForm>
          </LoadState>
        </Card>
      </div>
    </>
  );
}
export function ProfessionalProfile() {
  const state = useLoad(() => api("professionalProfile"));
  const [panel, setPanel] = useState("");
  return (
    <>
      <Heading eyebrow="PROFESSIONAL WORKSPACE" title="Your profile">
        Professional account, availability and preferences.
      </Heading>
      <LoadState state={state}>
        <Card tone="mint">
          <h2>{state.data?.name}</h2>
          <p>
            {state.data?.speciality} · {state.data?.verification}
          </p>
        </Card>
        <div className="grid two section">
          {[
            "Professional details",
            "Availability settings",
            "Notifications",
            "Privacy and access",
          ].map((t, i) => (
            <button
              className={`tile ${tones[i]}`}
              key={t}
              onClick={() => setPanel(t)}
            >
              <strong>{t}</strong>
              <p>View and update →</p>
            </button>
          ))}
        </div>
        {panel && (
          <Card className="section">
            <h2>{panel}</h2>
            {panel === "Privacy and access" ? (
              <p>
                Only assigned requests and user-approved shared information are
                available in this workspace. Verification is controlled by the
                backend.
              </p>
            ) : (
              <AsyncForm
                key={panel}
                onSubmit={(d) =>
                  api(
                    "saveProfessionalProfile",
                    panel === "Notifications"
                      ? { notifications: d.notifications === "on" }
                      : d,
                  )
                }
                onSuccess={state.reload}
              >
                {panel === "Professional details" ? (
                  <>
                    <Field
                      name="name"
                      label="Name"
                      defaultValue={state.data?.name}
                      required
                    />
                    <Field
                      name="speciality"
                      label="Speciality"
                      defaultValue={state.data?.speciality}
                      required
                    />
                  </>
                ) : panel === "Availability settings" ? (
                  <Field
                    name="availability"
                    label="Working hours"
                    defaultValue={state.data?.availability}
                    required
                  />
                ) : (
                  <label>
                    <input
                      type="checkbox"
                      name="notifications"
                      defaultChecked={state.data?.notifications}
                    />{" "}
                    Receive request and session reminders
                  </label>
                )}
              </AsyncForm>
            )}
          </Card>
        )}
      </LoadState>
    </>
  );
}
