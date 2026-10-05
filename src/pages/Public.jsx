import { useState } from "react";
import { api, isDemo } from "../services/api";
import {
  Button,
  Card,
  Heading,
  Field,
  AsyncForm,
  tones,
} from "../components/UI";
export function Landing({ navigate }) {
  return (
    <>
      <div className="two-columns hero">
        <div>
          <Heading
            eyebrow="A SPACE TO BEGIN"
            title="You don’t have to figure everything out alone."
          >
            Whatever is on your mind, you can take a moment to talk it through.
          </Heading>
          <div className="actions">
            <Button onClick={() => navigate("signup")}>Get started →</Button>
            <Button secondary onClick={() => navigate("selfhelp")}>
              How it works
            </Button>
          </div>
        </div>
        <Card tone="mint">
          <Card>
            <h2>MindBridge helps you take the next step.</h2>
            <div className="grid two">
              {[
                ["💬", "Talk", "Start a conversation.", "chat"],
                ["✦", "Reflect", "Put thoughts into words.", "reflection"],
              ].map(([icon, title, copy, dest], i) => (
                <button
                  key={dest}
                  className={`tile ${tones[i === 0 ? 1 : 3]}`}
                  onClick={() => navigate(dest)}
                >
                  <strong>
                    {icon} {title}
                  </strong>
                  <p>{copy}</p>
                </button>
              ))}
            </div>
          </Card>
        </Card>
      </div>
      <h2>Explore what MindBridge offers</h2>
      <div className="grid four">
        {[
          ["▱", "Chatbot", "Talk in your own words.", "chat"],
          ["✓", "Check-ins", "Notice how today feels.", "checkin"],
          ["▤", "Resources", "Explore everyday guidance.", "resources"],
          ["♡", "More support", "Learn about professional help.", "support"],
        ].map(([icon, title, copy, dest], i) => (
          <button
            className={`tile ${tones[(i + 1) % 4]}`}
            key={dest}
            onClick={() => navigate(dest)}
          >
            <strong>
              {icon} {title}
            </strong>
            <p>{copy}</p>
          </button>
        ))}
      </div>
      <Card className="strip">
        <div>
          {[
            ["Reflect", "reflection"],
            ["Build a plan", "plan"],
            ["Track your progress", "progress"],
            ["Your privacy matters", "privacy"],
          ].map(([label, dest]) => (
            <button key={dest} onClick={() => navigate(dest)}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={() => navigate("ngo")}>
          NGO partners · Partner with us →
        </button>
      </Card>
    </>
  );
}
export function Auth({ signup, authenticate, navigate }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <div className="two-columns auth">
      <section>
        <Heading
          eyebrow={signup ? "CREATE ACCOUNT" : "GOOD TO SEE YOU AGAIN"}
          title={signup ? "Start with the basics." : "Welcome back."}
        >
          {signup
            ? "You can choose what to share later."
            : "Pick up a conversation, continue a plan, or check in when you are ready."}
        </Heading>
        <Card>
          <form
            className="form"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));
              if (signup && data.password !== data.confirmPassword) {
                setError("Your passwords do not match.");
                return;
              }
              setBusy(true);
              setError("");
              try {
                await authenticate(signup ? "signup" : "login", {
                  email: data.email.trim(),
                  password: data.password,
                });
              } catch (e) {
                setError(e.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <Field
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
            <Field
              label="Password"
              name="password"
              type="password"
              minLength={8}
              autoComplete={signup ? "new-password" : "current-password"}
              required
            />
            {signup && (
              <Field
                label="Confirm password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            )}
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <Button disabled={busy}>
              {busy
                ? "Please wait…"
                : signup
                  ? "Create account →"
                  : "Sign in →"}
            </Button>
            <button
              type="button"
              onClick={() => navigate(signup ? "login" : "signup")}
            >
              {signup
                ? "Already registered? Sign in"
                : "Don’t have an account? Sign up"}
            </button>
          </form>
          {isDemo && (
            <details>
              <summary>Demo accounts</summary>
              <p>
                User: user@mindbridge.demo
                <br />
                Professional: professional@mindbridge.demo
                <br />
                Password for both: MindBridge123!
              </p>
              <p>New accounts work until this page is refreshed.</p>
            </details>
          )}
        </Card>
      </section>
      <Card tone="mint">
        <h2>
          {signup ? "Your space, your choices" : "Your space, at your pace"}
        </h2>
        {signup ? (
          <p>Review privacy before sharing anything personal.</p>
        ) : (
          <div className="stack">
            {["Continue a chat", "Check in", "Pick up a plan"].map((t, i) => (
              <Card key={t} tone={tones[i + 1]}>
                <strong>{t}</strong>
                <p>Come back when you are ready.</p>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
export function Support({ navigate }) {
  return (
    <>
      <div className="two-columns">
        <div>
          <Heading
            eyebrow="PROFESSIONAL SUPPORT · FREE"
            title="Need more support?"
          >
            Sometimes talking things through on your own isn’t enough. A trained
            mental health professional can give you a safe space to talk,
            understand what you’re experiencing and explore ways to cope.
          </Heading>
          <p>
            Getting professional support does not mean something is wrong with
            you. Asking for help is okay and it’s completely free.
          </p>
          <Button onClick={() => navigate("consultation")}>
            Find professional support · Free →
          </Button>
        </div>
        <Card tone="mint">
          <h2>Explore MindBridge first</h2>
          <div className="stack">
            {[
              ["Chatbot", "chat"],
              ["Check-ins", "checkin"],
              ["Resources", "resources"],
            ].map(([label, dest], i) => (
              <button
                className={`tile ${tones[i + 1]}`}
                key={dest}
                onClick={() => navigate(dest)}
              >
                {label} →
              </button>
            ))}
          </div>
        </Card>
      </div>
      <Card className="section">
        <h2>How a request works</h2>
        <p>
          Share what you need → Review what is shared → Check request status
        </p>
        <small>Availability depends on professional capacity.</small>
      </Card>
    </>
  );
}
export function SelfHelp({ navigate }) {
  return (
    <div className="narrow">
      <Heading eyebrow="SELF-HELP" title="Take a minute.">
        Put your phone down if you can. Take a slow breath in, then breathe out.
        Notice what you’re feeling without judging yourself.
      </Heading>
      <h3>Try this:</h3>
      <div className="stack">
        {[
          "Take one slow breath.",
          "Name one thing you are feeling.",
          "Notice what may have triggered it.",
          "Choose one small thing you can do next.",
          "Reach out to someone you trust if you need support.",
        ].map((s, i) => (
          <Card tone={i % 2 === 0 ? "mint" : ""} key={s}>
            {s}
          </Card>
        ))}
      </div>
      <Button secondary onClick={() => navigate("plan")}>
        Build a small plan →
      </Button>
    </div>
  );
}
export function Privacy() {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <Heading eyebrow="PRIVACY" title="Your privacy matters.">
        What you share should be handled with care. Before using the chat, we’ll
        clearly explain what information is collected, how it is used and when
        information may need to be shared for safety.
      </Heading>
      <div className="grid three section">
        {[
          ["What is collected", "Information you choose to provide."],
          ["How it is used", "To support your experience and care."],
          [
            "When it may be shared",
            "Only under the service’s agreed sharing rules.",
          ],
        ].map(([t, p], i) => (
          <Card key={t} tone={tones[i]}>
            <h3>{t}</h3>
            <p>{p}</p>
          </Card>
        ))}
      </div>
      <Button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        View privacy details
      </Button>
      {expanded && (
        <Card className="section">
          <h2>Privacy information</h2>
          <p>
            This prototype uses in-memory demo data. Refresh clears it. The team
            must supply the final privacy notice, retention periods, sharing
            rules and contact details before launch.
          </p>
          <p>
            Consultation forms let you choose whether to share check-ins and
            selected support history.
          </p>
        </Card>
      )}
    </>
  );
}
export function NGO() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="two-columns">
        <div>
          <Heading
            eyebrow="PARTNER WITH MINDBRIDGE"
            title="Help more young people access support."
          >
            MindBridge is seeking NGO funding partners to help make mental
            health resources and access to qualified professionals more
            affordable and available to young people.
          </Heading>
          <Button onClick={() => setOpen(true)} aria-expanded={open}>
            ♡ Discuss funding partnership
          </Button>
        </div>
        <Card tone="mint">
          <h2>What your funding could support.</h2>
          <h3>Affordable access</h3>
          <p>
            Help reduce the cost of connecting young people with qualified
            professionals.
          </p>
          <p>
            Support the creation and review of practical mental health content.
          </p>
          <h3>Wider reach</h3>
          <p>
            Help MindBridge introduce its services to more young people and
            communities.
          </p>
        </Card>
      </div>
      <Card className="section">
        <h2>How we would work together</h2>
        <ol className="process">
          {[
            "Discuss funding goals",
            "Agree on scope and budget",
            "Set measurable outcomes",
            "Review progress and impact",
          ].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </Card>
      {open && (
        <Card className="section narrow">
          <h2>Discuss funding partnership</h2>
          <AsyncForm
            onSubmit={(data) => api("enquiry", data)}
            submit={isDemo ? "Save demo enquiry" : "Send enquiry"}
          >
            <Field label="Your name" name="name" required />
            <Field label="Organisation" name="organisation" required />
            <Field label="Email address" name="email" type="email" required />
            <Field
              label="Your funding interests"
              name="message"
              textarea
              required
            />
          </AsyncForm>
          {isDemo && <small>Demo only. No enquiry is sent.</small>}
        </Card>
      )}
      <p className="small">
        Partnership enquiries only. No funding relationship is currently
        implied.
      </p>
    </>
  );
}
export function Onboarding({ goal, navigate }) {
  const [selected, setSelected] = useState("");
  const items = goal
    ? [
        "Talk through my thoughts",
        "Learn something useful",
        "Build a small plan",
        "Track my wellbeing",
        "Explore professional support",
      ]
    : ["School", "Stress", "Anxiety", "Relationships", "Anything else"];
  return (
    <div className="two-columns">
      <section>
        <Heading
          eyebrow={`ONBOARDING · STEP ${goal ? "2" : "1"}`}
          title={
            goal ? "What would you like to do?" : "What’s been on your mind?"
          }
        >
          Choose one, or explore later.
        </Heading>
        <div className="grid two">
          {items.map((t, i) => (
            <button
              aria-pressed={selected === t}
              className={`tile ${tones[i % 4]}`}
              key={t}
              onClick={() => setSelected(t)}
            >
              {t} {selected === t ? "✓" : ""}
            </button>
          ))}
        </div>
        <div className="actions">
          <Button
            onClick={() => navigate(goal ? "dashboard" : "onboarding-goal")}
          >
            Continue →
          </Button>
          <Button secondary onClick={() => navigate("dashboard")}>
            Skip for now
          </Button>
        </div>
      </section>
      <Card tone="mint">
        <h2>Flexible choices</h2>
        <p>
          Your interests may change. You can explore without completing these
          optional steps.
        </p>
      </Card>
    </div>
  );
}
