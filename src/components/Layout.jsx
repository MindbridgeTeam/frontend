import { Button } from "./UI";
export function Header({ navigate, user, logout }) {
  return (
    <header className="header">
      <button
        className="brand"
        onClick={() =>
          navigate(user?.role === "professional" ? "professional" : "landing")
        }
      >
        <span className="mark">M</span>MindBridge
      </button>
      <nav aria-label="Main navigation">
        <button onClick={() => navigate("landing")}>How it works</button>
        <button onClick={() => navigate("resources")}>Resources</button>
        <button onClick={() => navigate("support")}>
          Professional support
        </button>
        <button onClick={() => navigate("ngo")}>NGO partners</button>
      </nav>
      <div className="header-account">
        {user ? (
          <>
            <button
              onClick={() => navigate("notifications")}
              aria-label="Notifications"
            >
              ♧
            </button>
            <button onClick={logout}>Sign out</button>
          </>
        ) : (
          <Button secondary onClick={() => navigate("login")}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
export function Footer({ navigate }) {
  return (
    <footer>
      <div>
        <strong>MindBridge</strong>
        <p>Support for study, work and what comes next.</p>
      </div>
      <div>
        <strong>Explore</strong>
        <p>
          <button onClick={() => navigate("landing")}>How it works</button> ·{" "}
          <button onClick={() => navigate("resources")}>Resources</button> ·{" "}
          <button onClick={() => navigate("ngo")}>NGO partners</button> ·{" "}
          <button onClick={() => navigate("privacy")}>Privacy</button>
        </p>
      </div>
      <small>© 2026 MindBridge</small>
    </footer>
  );
}
const userLinks = [
  ["⌂", "Home", "dashboard"],
  ["▱", "Chat", "chat"],
  ["▥", "Progress", "progress"],
  ["▤", "Resources", "resources"],
  ["♙", "Profile", "profile"],
];
const proLinks = [
  ["", "Dashboard", "professional"],
  ["", "Requests", "professional-requests"],
  ["", "Consultations", "professional-consultations"],
  ["", "Schedule", "professional-schedule"],
  ["", "Profile", "professional-profile"],
];
export function Sidebar({ professional, navigate, screen }) {
  return (
    <aside className="sidebar">
      {professional && <p className="eyebrow">PRO WORKSPACE</p>}
      <nav
        aria-label={
          professional ? "Professional navigation" : "Your navigation"
        }
      >
        {(professional ? proLinks : userLinks).map(([icon, label, id]) => (
          <button
            key={id}
            aria-current={screen === id ? "page" : undefined}
            className={screen === id ? "active" : ""}
            onClick={() => navigate(id)}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
      <small>MindBridge</small>
    </aside>
  );
}
export function Layout({
  children,
  screen,
  navigate,
  user,
  logout,
  workspace = false,
  professional = false,
}) {
  return (
    <div className="app">
      <Header {...{ navigate, user, logout }} />
      {workspace ? (
        <div className="workspace">
          <Sidebar {...{ navigate, screen, professional }} />
          <main className="content">{children}</main>
        </div>
      ) : (
        <>
          <main className="public-content">{children}</main>
          <Footer navigate={navigate} />
        </>
      )}
    </div>
  );
}
