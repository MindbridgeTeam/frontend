import { useEffect, useState } from "react";
export const tones = ["mint", "lavender", "yellow", "peach"];
export function Button({ children, secondary = false, ...props }) {
  return (
    <button className={secondary ? "button secondary" : "button"} {...props}>
      {children}
    </button>
  );
}
export function Card({ children, tone = "", className = "", ...props }) {
  return (
    <section className={`card ${tone} ${className}`} {...props}>
      {children}
    </section>
  );
}
export function Heading({ eyebrow, title, children }) {
  return (
    <div className="heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
export function Field({
  label,
  name,
  type = "text",
  textarea = false,
  children,
  ...props
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {textarea ? (
        <textarea name={name} rows={4} {...props} />
      ) : children ? (
        <select name={name} {...props}>
          {children}
        </select>
      ) : (
        <input name={name} type={type} {...props} />
      )}
    </label>
  );
}
export function useLoad(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: "" }));
    Promise.resolve()
      .then(loader)
      .then((data) => live && setState({ data, loading: false, error: "" }))
      .catch(
        (e) =>
          live && setState({ data: null, loading: false, error: e.message }),
      );
    return () => {
      live = false;
    };
  }, [...deps, version]);
  return { ...state, reload: () => setVersion((v) => v + 1) };
}
export function LoadState({ state, children }) {
  if (state.loading) return <p role="status">Loading…</p>;
  if (state.error)
    return (
      <Card>
        <p role="alert">{state.error}</p>
        <Button onClick={state.reload}>Try again</Button>
      </Card>
    );
  return children;
}
export function AsyncForm({ onSubmit, children, submit = "Save", onSuccess }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(false);
  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        setBusy(true);
        setError("");
        setSuccess(false);
        try {
          const result = await onSubmit(data);
          setSuccess(true);
          onSuccess?.(result);
        } catch (e) {
          setError(e.message);
        } finally {
          setBusy(false);
        }
      }}
    >
      {children}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {success && <p role="status">Saved successfully.</p>}
      <Button disabled={busy} type="submit">
        {busy ? "Please wait…" : submit}
      </Button>
    </form>
  );
}
