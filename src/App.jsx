import { useEffect, useState } from "react";
import { api, isDemo } from "./services/api";
import { Layout } from "./components/Layout";
import {
  Landing,
  Auth,
  Support,
  SelfHelp,
  Privacy,
  NGO,
  Onboarding,
} from "./pages/Public";
import {
  Dashboard,
  CheckIn,
  Reflection,
  Chat,
  Resources,
  ResourceDetail,
  Plan,
  Consultation,
  RequestStatus,
  Notifications,
  Profile,
} from "./pages/User";
import Progress from "./pages/Progress";
import {
  ProfessionalDashboard,
  ProfessionalRequests,
  ProfessionalConsultations,
  ProfessionalSchedule,
  ProfessionalProfile,
} from "./pages/Professional";
const publicScreens = [
  "landing",
  "login",
  "signup",
  "support",
  "selfhelp",
  "privacy",
  "ngo",
];
const parseScreen = () =>
  decodeURIComponent(location.hash.slice(1)) || "landing";
export default function App() {
  const [screen, setScreen] = useState(parseScreen),
    [user, setUser] = useState(null),
    [ready, setReady] = useState(false),
    [next, setNext] = useState("dashboard"),
    [error, setError] = useState("");
  useEffect(() => {
    api("session")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
    const handler = () => setScreen(parseScreen());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  function navigate(destination) {
    if (destination === "support" && user)
      destination =
        user.role === "professional" ? "professional-requests" : "consultation";
    if (!publicScreens.includes(destination) && !user) {
      setNext(destination);
      destination = "login";
    }
    location.hash = encodeURIComponent(destination);
    setScreen(destination);
    window.scrollTo(0, 0);
  }
  async function authenticate(operation, data) {
    const account = await api(operation, data);
    setUser(account);
    const destination =
      account.role === "professional"
        ? "professional"
        : next.startsWith("professional")
          ? "dashboard"
          : next;
    location.hash = encodeURIComponent(destination);
    setScreen(destination);
    setNext("dashboard");
  }
  async function logout() {
    try {
      await api("logout");
      setUser(null);
      navigate("landing");
    } catch (e) {
      setError(e.message);
    }
  }
  if (!ready) return <p role="status">Opening MindBridge…</p>;
  const professional = screen.startsWith("professional");
  const privatePage = !publicScreens.includes(screen);
  let page;
  if (privatePage && !user)
    page = <Auth authenticate={authenticate} navigate={navigate} />;
  else if (professional && user?.role !== "professional")
    page = <p role="alert">Professional access required.</p>;
  else
    switch (screen) {
      case "landing":
        page = <Landing navigate={navigate} />;
        break;
      case "login":
      case "signup":
        page = (
          <Auth signup={screen === "signup"} {...{ authenticate, navigate }} />
        );
        break;
      case "support":
        page = <Support navigate={navigate} />;
        break;
      case "selfhelp":
        page = <SelfHelp navigate={navigate} />;
        break;
      case "privacy":
        page = <Privacy />;
        break;
      case "ngo":
        page = <NGO />;
        break;
      case "dashboard":
        page = <Dashboard navigate={navigate} />;
        break;
      case "checkin":
        page = <CheckIn />;
        break;
      case "reflection":
        page = <Reflection />;
        break;
      case "chat":
        page = <Chat />;
        break;
      case "resources":
        page = <Resources navigate={navigate} />;
        break;
      case "progress":
        page = <Progress />;
        break;
      case "plan":
        page = <Plan />;
        break;
      case "consultation":
        page = <Consultation navigate={navigate} />;
        break;
      case "request-status":
        page = <RequestStatus navigate={navigate} />;
        break;
      case "notifications":
        page = <Notifications navigate={navigate} />;
        break;
      case "profile":
        page = <Profile {...{ user, navigate }} />;
        break;
      case "onboarding":
      case "onboarding-goal":
        page = (
          <Onboarding goal={screen === "onboarding-goal"} navigate={navigate} />
        );
        break;
      case "professional":
        page = <ProfessionalDashboard navigate={navigate} />;
        break;
      case "professional-requests":
        page = <ProfessionalRequests />;
        break;
      case "professional-consultations":
        page = <ProfessionalConsultations />;
        break;
      case "professional-schedule":
        page = <ProfessionalSchedule />;
        break;
      case "professional-profile":
        page = <ProfessionalProfile />;
        break;
      default:
        page = screen.startsWith("resource:") ? (
          <ResourceDetail id={screen.split(":")[1]} navigate={navigate} />
        ) : (
          <p>
            Page not found.{" "}
            <button onClick={() => navigate("landing")}>Return home</button>
          </p>
        );
    }
  const workspace =
    privatePage &&
    !!user &&
    !["onboarding", "onboarding-goal"].includes(screen);
  return (
    <>
      <Layout {...{ screen, navigate, user, logout, workspace, professional }}>
        {error && <p role="alert">{error}</p>}
        {page}
      </Layout>
      {isDemo && (
        <div className="demo-note">
          Demo mode · Data resets on refresh · No real messages, appointments or
          enquiries are sent
        </div>
      )}
    </>
  );
}
