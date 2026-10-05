import { useState } from "react";
import { api, isDemo } from "../services/api";
import {
  Button,
  Card,
  Heading,
  Field,
  AsyncForm,
  tones,
  useLoad,
  LoadState,
} from "../components/UI";
export function Dashboard({ navigate }) {
  return (
    <>
      <Heading eyebrow="YOUR SPACE" title="What’s been on your mind?">
        Talk, reflect or explore when you are ready.
      </Heading>
      <div className="split">
        <section>
          <button
            className="tile mint full"
            onClick={() => navigate("checkin")}
          >
            <strong>♡ How are you feeling today?</strong>
            <p>A quick check-in.</p>
          </button>
          <div className="grid three section">
            {[
              ["Talk", "MindBridge AI", "chat"],
              ["Reflect", "Put thoughts into words", "reflection"],
              ["Learn", "Explore everyday content", "resources"],
              ["Build a plan", "One manageable step", "plan"],
              ["Track", "Notice your patterns", "progress"],
            ].map(([title, copy, dest], i) => (
              <button
                className={`tile ${tones[(i + 1) % 4]}`}
                key={dest}
                onClick={() => navigate(dest)}
              >
                <strong>{title}</strong>
                <p>{copy}</p>
              </button>
            ))}
          </div>
        </section>
        <Card tone="mint">
          <h2>Continue your journey</h2>
          <div className="stack">
            {[
              ["Recent check-in", "checkin"],
              ["Active plan", "plan"],
              ["Explore professional support", "consultation"],
              ["Request status", "request-status"],
            ].map(([t, d]) => (
              <button key={d} onClick={() => navigate(d)}>
                {t} →
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
export function CheckIn() {
  return (
    <>
      <Heading eyebrow="ONE MINUTE CHECK-IN" title="How is today going?">
        Use a 1–5 scale for each area.
      </Heading>
      <div className="split">
        <AsyncForm
          onSubmit={(data) =>
            api("saveCheckin", {
              ...data,
              ...Object.fromEntries(
                ["mood", "stress", "energy", "sleep", "anxiety"].map((k) => [
                  k,
                  Number(data[k]),
                ]),
              ),
            })
          }
          submit="Save check-in →"
        >
          {["Mood", "Stress", "Energy", "Sleep", "Anxiety"].map((t, i) => (
            <fieldset className={`scale ${tones[i % 4]}`} key={t}>
              <legend>{t}</legend>
              <div>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n}>
                    <input
                      type="radio"
                      name={t.toLowerCase()}
                      value={n}
                      defaultChecked={n === 3}
                      required
                    />
                    <span>{n}</span>
                  </label>
                ))}
              </div>
              <small>
                {["Stress", "Anxiety"].includes(t)
                  ? "1 = low · 5 = high"
                  : "1 = low/poor · 5 = high/good"}
              </small>
            </fieldset>
          ))}
          <Field
            name="note"
            label="What affected your mood? (optional)"
            placeholder="A short note, if you wish"
          />
        </AsyncForm>
        <Card tone="lavender">
          <h2>About this check-in</h2>
          <p>
            Your responses help you notice patterns over time. They are not a
            diagnosis.
          </p>
        </Card>
      </div>
    </>
  );
}
const questions = [
  "What happened?",
  "What were you feeling?",
  "What contributed?",
  "How is it affecting you?",
  "What might help?",
];
export function Reflection() {
  const [step, setStep] = useState(0),
    [answers, setAnswers] = useState(Array(5).fill("")),
    [review, setReview] = useState(false),
    [saved, setSaved] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <>
      <Heading
        eyebrow={
          review ? "REFLECTION SUMMARY" : `GUIDED REFLECTION ${step + 1} OF 5`
        }
        title={review ? "Does this sound right?" : "Take a moment to reflect."}
      >
        You can edit, save or discard.
      </Heading>
      <div className="split">
        <section>
          {review ? (
            <div className="stack">
              {questions.map((q, i) => (
                <Card tone={tones[i % 4]} key={q}>
                  <h3>{q}</h3>
                  <p>{answers[i] || "No response added."}</p>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <Card tone="mint">
                <h3>{questions[step]}</h3>
                <p>A moment or situation on your mind.</p>
              </Card>
              <label className="field section">
                <span>Your reflection</span>
                <textarea
                  value={answers[step]}
                  onChange={(e) =>
                    setAnswers((a) =>
                      a.map((v, i) => (i === step ? e.target.value : v)),
                    )
                  }
                  rows={7}
                  placeholder="Write here…"
                />
              </label>
            </>
          )}
          {error && <p role="alert">{error}</p>}
          {saved && <p role="status">Reflection saved.</p>}
          <div className="actions">
            {review ? (
              <>
                <Button
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      await api("saveReflection", {
                        answers: questions.map((question, i) => ({
                          question,
                          answer: answers[i],
                        })),
                      });
                      setSaved(true);
                    } catch (e) {
                      setError(e.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {busy ? "Saving…" : "Save reflection"}
                </Button>
                <Button
                  secondary
                  onClick={() => {
                    setReview(false);
                    setSaved(false);
                  }}
                >
                  Edit summary
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() =>
                    step === 4 ? setReview(true) : setStep(step + 1)
                  }
                >
                  Continue →
                </Button>
                {step > 0 && (
                  <Button secondary onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}
              </>
            )}
          </div>
        </section>
        <Card tone="mint">
          <h2>What comes next</h2>
          <p>What were you feeling?</p>
          <p>What contributed?</p>
          <p>How is it affecting you?</p>
          <p>What might help?</p>
        </Card>
      </div>
    </>
  );
}
export function Chat() {
  const [messages, setMessages] = useState([]),
    [draft, setDraft] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [failed, setFailed] = useState("");
  async function send(text, retry = false) {
    if (!text.trim() || busy) return;
    setDraft("");
    if (!retry)
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "user", content: text },
      ]);
    setBusy(true);
    setError("");
    try {
      const reply = await api("chat", { message: text });
      setMessages((m) => [...m, reply]);
      setFailed("");
    } catch (e) {
      setError(e.message);
      setFailed(text);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading eyebrow="AI SUPPORT COMPANION" title="Let’s talk.">
        A place to organise your thoughts. You can start with a small thought.
      </Heading>
      <div className="split">
        <Card>
          <strong>✦ MindBridge · AI support companion</strong>
          <div className="chat-messages" aria-live="polite">
            {!messages.length &&
              [
                "What’s been bothering you lately?",
                "What’s making things feel difficult right now?",
                "Do you want to talk about what happened?",
                "Want to get something off your chest?",
              ].map((t, i) => (
                <button
                  className={`tile ${tones[i % 2]}`}
                  key={t}
                  onClick={() => send(t)}
                >
                  {t}
                </button>
              ))}
            {messages.map((m) => (
              <p
                key={m.id}
                className={`bubble ${m.role === "user" ? "user" : "assistant"}`}
              >
                {m.content}
              </p>
            ))}
            {busy && (
              <p role="status" className="tile lavender">
                MindBridge is replying…
              </p>
            )}
            {error && (
              <div role="alert" className="tile peach">
                <p>Could not get a reply.</p>
                <Button secondary onClick={() => send(failed, true)}>
                  Try again
                </Button>
              </div>
            )}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input
              aria-label="Your message"
              placeholder="Write a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              required
            />
            <Button disabled={busy || !draft.trim()}>Send →</Button>
          </form>
          {isDemo && (
            <small>
              Demo replies only. Type /error to preview the retry state.
            </small>
          )}
        </Card>
        <Card tone="mint">
          <h2>Your choices</h2>
          <p>
            This space is for reflection and support guidance. It does not
            provide a diagnosis.
          </p>
          <p>You choose what to share.</p>
        </Card>
      </div>
    </>
  );
}
export function Resources({ navigate }) {
  const state = useLoad(() => api("resources"));
  return (
    <>
      <Heading eyebrow="RESOURCES" title="Explore what helps." />
      <LoadState state={state}>
        <div className="grid two">
          {state.data?.map((r, i) => (
            <button
              className={`tile ${tones[i % 4]}`}
              key={r.id}
              onClick={() => navigate(`resource:${r.id}`)}
            >
              <h2>{r.title}</h2>
              <p>{r.description}</p>
            </button>
          ))}
        </div>
      </LoadState>
    </>
  );
}
export function ResourceDetail({ id, navigate }) {
  const state = useLoad(() => api("resource", { id }), [id]);
  return (
    <LoadState state={state}>
      {state.data ? (
        <>
          <Heading eyebrow="ARTICLE / GUIDE" title={state.data.title}>
            {state.data.reviewStatus}
          </Heading>
          <div className="split">
            <section>
              <Card tone="mint">
                <h2>Take a minute.</h2>
                <p>A small, manageable beginning.</p>
              </Card>
              <h3>Try a smaller starting point</h3>
              <p>{state.data.body}</p>
              <Button onClick={() => navigate("plan")}>
                Make this part of a plan →
              </Button>
            </section>
            <Card tone="mint">
              <h3>Resource details</h3>
              <p>Category: {state.data.category}</p>
              <p>Reading time: 2 minutes</p>
              <p>{state.data.reviewStatus}</p>
            </Card>
          </div>
        </>
      ) : (
        <p>Resource not found.</p>
      )}
    </LoadState>
  );
}
export function Plan() {
  const state = useLoad(() => api("plans"));
  const [error, setError] = useState("");
  return (
    <>
      <Heading eyebrow="SELF-HELP PLAN" title="One manageable step.">
        Build a small plan you can return to.
      </Heading>
      <div className="split">
        <Card>
          <AsyncForm
            onSubmit={(d) => api("savePlan", d)}
            onSuccess={state.reload}
            submit="Save plan →"
          >
            <Field
              label="What would you like to work on?"
              name="goal"
              required
            />
            <Field label="One small action" name="action" required />
            <Field
              label="When will you try it?"
              name="when"
              type="date"
              required
            />
          </AsyncForm>
        </Card>
        <Card tone="mint">
          <h2>Your plan</h2>
          <LoadState state={state}>
            {!state.data?.length ? (
              <p>No plan saved yet. Start with one small action.</p>
            ) : (
              state.data.map((p) => (
                <div key={p.id} className="plan-item">
                  <h3>{p.goal}</h3>
                  <p>{p.action}</p>
                  <p>{p.when}</p>
                  <label>
                    <input
                      type="checkbox"
                      checked={p.completed}
                      onChange={async (e) => {
                        try {
                          await api("updatePlan", {
                            id: p.id,
                            completed: e.target.checked,
                          });
                          state.reload();
                        } catch (e) {
                          setError(e.message);
                        }
                      }}
                    />{" "}
                    Completed
                  </label>
                </div>
              ))
            )}
          </LoadState>
          {error && <p role="alert">{error}</p>}
        </Card>
      </div>
    </>
  );
}
export function Consultation({ navigate }) {
  const [review, setReview] = useState(null),
    [draft, setDraft] = useState({});
  return (
    <>
      <Heading eyebrow="CONSULTATION REQUEST" title="Tell us what you need.">
        Review your information before submitting.
      </Heading>
      <div className="split">
        <Card>
          {review ? (
            <>
              <h2>Review your request</h2>
              <dl>
                {[
                  ["Reason", review.reason],
                  ["Experience", review.experience],
                  ["Duration", review.duration],
                  ["Already tried", review.tried || "Not provided"],
                  ["Share check-ins", review.shareCheckins ? "Yes" : "No"],
                  ["Share history", review.shareHistory ? "Yes" : "No"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <AsyncForm
                onSubmit={() => api("saveRequest", review)}
                onSuccess={() => navigate("request-status")}
                submit="Submit request →"
              />
              <Button secondary onClick={() => setReview(null)}>
                Edit request
              </Button>
            </>
          ) : (
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                const d = Object.fromEntries(new FormData(e.currentTarget));
                setDraft(d);
                setReview({
                  ...d,
                  shareCheckins: d.shareCheckins === "on",
                  shareHistory: d.shareHistory === "on",
                });
              }}
            >
              <Field
                label="Why are you seeking support?"
                name="reason"
                defaultValue={draft.reason}
                required
              />
              <Field
                label="What have you been experiencing?"
                name="experience"
                defaultValue={draft.experience}
                textarea
                required
              />
              <Field
                label="How long has this been going on?"
                name="duration"
                defaultValue={draft.duration || ""}
                required
              >
                <option value="">Select a timeframe</option>
                {[
                  "Several days",
                  "Several weeks",
                  "Several months",
                  "I’m not sure",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Field>
              <Field
                label="What have you tried? (optional)"
                name="tried"
                defaultValue={draft.tried}
                textarea
              />
              <label>
                <input
                  type="checkbox"
                  name="shareCheckins"
                  defaultChecked={draft.shareCheckins === "on"}
                />{" "}
                Share relevant check-ins
              </label>
              <label>
                <input
                  type="checkbox"
                  name="shareHistory"
                  defaultChecked={draft.shareHistory === "on"}
                />{" "}
                Share selected support history
              </label>
              <Button>Review request →</Button>
            </form>
          )}
        </Card>
        <Card tone="lavender">
          <h2>Sharing review</h2>
          <p>
            Add what you choose to share and anything else you’d like the
            reviewer to know.
          </p>
          <p>Only the selected information should be shared.</p>
        </Card>
      </div>
    </>
  );
}
export function RequestStatus({ navigate }) {
  const state = useLoad(() => api("requests"));
  const request = state.data?.at(-1);
  const labels = {
    pending: "Pending review",
    approved: "Approved",
    more_information: "More information requested",
    declined: "Declined",
  };
  return (
    <>
      <Heading eyebrow="YOUR REQUEST" title="You’ve taken a step.">
        {request ? `Request ID: ${request.id}` : "Your consultation requests"}
      </Heading>
      <LoadState state={state}>
        {request ? (
          <div className="split">
            <section>
              <Card tone="mint">
                <h2>{labels[request.status]}</h2>
                <p>
                  {request.status === "pending"
                    ? "Your request is in the review queue."
                    : "Your request has an update."}
                </p>
              </Card>
              <Card className="section">
                <h3>Professional review</h3>
                <p>You will see an update here.</p>
              </Card>
              <Card tone="lavender" className="section">
                <h3>More information may be needed</h3>
                <p>We will explain what to provide.</p>
              </Card>
              {request.updates?.map((u, i) => (
                <Card key={i} className="section">
                  <h3>{labels[u.status]}</h3>
                  <p>{u.explanation}</p>
                </Card>
              ))}
              <div className="actions">
                <Button onClick={() => navigate("resources")}>
                  Explore resources →
                </Button>
                <Button secondary onClick={state.reload}>
                  Refresh status
                </Button>
              </div>
            </section>
            <Card tone="mint">
              <h2>Status timeline</h2>
              <ol>
                <li>Submitted</li>
                <li>{labels[request.status]}</li>
                <li>Decision and next step</li>
                <li>Updated in your account</li>
              </ol>
            </Card>
          </div>
        ) : (
          <Card>
            <p>You haven’t submitted a request yet.</p>
            <Button onClick={() => navigate("consultation")}>
              Request support
            </Button>
          </Card>
        )}
      </LoadState>
    </>
  );
}
export function Notifications({ navigate }) {
  const state = useLoad(() => api("notifications"));
  return (
    <>
      <Heading eyebrow="GENTLE REMINDERS" title="At your pace." />
      <LoadState state={state}>
        <div className="stack narrow">
          {state.data?.map((n, i) => (
            <button
              className={`tile ${tones[i % 4]}`}
              key={n.id}
              onClick={() => navigate(n.destination)}
            >
              <strong>{n.title}</strong>
              <p>{n.message}</p>
            </button>
          ))}
        </div>
      </LoadState>
    </>
  );
}
export function Profile({ user, navigate }) {
  return (
    <>
      <Heading eyebrow="YOUR ACCOUNT" title="Your profile." />
      <Card>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>Account role: {user.role}</p>
        <Button onClick={() => navigate("privacy")}>
          Your privacy matters
        </Button>
        <Button secondary onClick={() => navigate("onboarding")}>
          Explore your goals
        </Button>
      </Card>
    </>
  );
}
