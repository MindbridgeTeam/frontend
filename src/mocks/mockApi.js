// In-memory demo database. Refresh resets it. Never persist passwords or health data here.
export const demoAccounts = {
  user: { email: "user@mindbridge.demo", password: "MindBridge123!" },
  professional: {
    email: "professional@mindbridge.demo",
    password: "MindBridge123!",
  },
};
export function createMockApi() {
  let user = null;
  const accounts = [
    {
      id: "u-demo",
      name: "Demo User",
      email: demoAccounts.user.email,
      password: demoAccounts.user.password,
      role: "user",
    },
    {
      id: "p-demo",
      name: "Amina Okon",
      email: demoAccounts.professional.email,
      password: demoAccounts.professional.password,
      role: "professional",
    },
  ];
  let checkins = [];
  const requests = [
    {
      id: "MH-1048",
      userId: "u-demo",
      professionalId: "p-demo",
      reason: "Support with study pressure",
      experience:
        "I have been finding it difficult to switch off after studying.",
      duration: "Several weeks",
      tried: "Taking breaks",
      status: "pending",
      createdAt: new Date().toISOString(),
      shareCheckins: true,
      shareHistory: false,
      updates: [],
    },
  ];
  const reflections = [],
    plans = [],
    enquiries = [];
  const resources = [
    {
      id: "stress",
      title: "Stress & burnout",
      category: "Stress & burnout",
      description:
        "Feeling tired or overwhelmed? Explore simple ways to pause, reset and manage what’s weighing on you.",
      body: "Choose one task you can begin now. Break it into a manageable first part. Take a moment to notice what you need.",
      reviewStatus: "Demo content — review pending",
    },
    {
      id: "anxiety",
      title: "Anxiety & overthinking",
      category: "Anxiety & overthinking",
      description:
        "When your mind won’t slow down, these resources can help you understand what you’re feeling and find ways to settle yourself.",
      body: "Take a minute to notice your surroundings. Write down what is on your mind and one small next step.",
      reviewStatus: "Demo content — review pending",
    },
    {
      id: "loneliness",
      title: "Loneliness",
      category: "Loneliness",
      description:
        "Feeling disconnected? Here are ideas to stay connected, explore ways to reconnect, reach out and support yourself.",
      body: "Think of someone you trust. Consider a simple message or a small shared activity when you feel ready.",
      reviewStatus: "Demo content — review pending",
    },
    {
      id: "school",
      title: "School pressure",
      category: "School pressure",
      description:
        "Assignments, exams and expectations can become a lot. Find practical ways to manage pressure without ignoring how you’re feeling.",
      body: "List what needs doing, then choose one manageable task. Make space for rest alongside study.",
      reviewStatus: "Demo content — review pending",
    },
  ];
  const consultations = [
    {
      id: "c-1",
      requestId: "MH-1048",
      professionalId: "p-demo",
      time: "10:30",
      date: new Date().toISOString().slice(0, 10),
      status: "upcoming",
      notes: "Demo consultation; no real appointment booked.",
    },
    {
      id: "c-2",
      requestId: "MH-1049",
      professionalId: "p-demo",
      time: "14:00",
      date: new Date().toISOString().slice(0, 10),
      status: "upcoming",
      notes: "Demo consultation.",
    },
  ];
  const profile = {
    name: "Amina Okon",
    speciality: "Mental health professional",
    verification: "Demo profile",
    availability: "Mon–Fri, 09:00–17:00",
    notifications: true,
  };
  const clean = (a) => {
    const { password, ...safe } = a;
    return safe;
  };
  const requireUser = () => {
    if (!user) throw Error("Please sign in to continue.");
  };
  const requirePro = () => {
    requireUser();
    if (user.role !== "professional")
      throw Error("Professional access required.");
  };
  return async function mock(operation, payload = {}) {
    await new Promise((r) => setTimeout(r, 150));
    switch (operation) {
      case "session":
        return user;
      case "login": {
        const a = accounts.find(
          (a) =>
            a.email === payload.email.toLowerCase().trim() &&
            a.password === payload.password,
        );
        if (!a) throw Error("Email or password is incorrect.");
        user = clean(a);
        return user;
      }
      case "signup": {
        if (
          accounts.some((a) => a.email === payload.email.toLowerCase().trim())
        )
          throw Error("This email is already registered.");
        if (payload.password.length < 8)
          throw Error("Use at least eight characters.");
        const a = {
          id: crypto.randomUUID(),
          email: payload.email.toLowerCase().trim(),
          name: payload.name || "MindBridge user",
          password: payload.password,
          role: "user",
        };
        accounts.push(a);
        user = clean(a);
        return user;
      }
      case "logout":
        user = null;
        return null;
      case "resources":
        requireUser();
        return resources;
      case "resource":
        requireUser();
        return resources.find((r) => r.id === payload.id);
      case "checkins":
        requireUser();
        return checkins.filter((c) => c.userId === user.id);
      case "saveCheckin":
        requireUser();
        {
          const c = {
            ...payload,
            id: crypto.randomUUID(),
            userId: user.id,
            createdAt: new Date().toISOString(),
          };
          checkins.push(c);
          return c;
        }
      case "saveReflection":
        requireUser();
        {
          const r = {
            ...payload,
            id: crypto.randomUUID(),
            userId: user.id,
            createdAt: new Date().toISOString(),
          };
          reflections.push(r);
          return r;
        }
      case "plans":
        requireUser();
        return plans.filter((p) => p.userId === user.id);
      case "savePlan":
        requireUser();
        {
          const p = {
            ...payload,
            id: crypto.randomUUID(),
            userId: user.id,
            completed: false,
          };
          plans.push(p);
          return p;
        }
      case "updatePlan":
        requireUser();
        {
          const p = plans.find(
            (p) => p.id === payload.id && p.userId === user.id,
          );
          if (!p) throw Error("Plan not found.");
          p.completed = payload.completed;
          return { ...p };
        }
      case "requests":
        requireUser();
        return requests.filter((r) =>
          user.role === "professional"
            ? r.professionalId === user.id
            : r.userId === user.id,
        );
      case "saveRequest":
        requireUser();
        {
          const r = {
            ...payload,
            id: `MH-${Date.now()}`,
            userId: user.id,
            professionalId: "p-demo",
            status: "pending",
            createdAt: new Date().toISOString(),
            updates: [],
          };
          requests.push(r);
          return r;
        }
      case "reviewRequest":
        requirePro();
        {
          const r = requests.find(
            (r) => r.id === payload.id && r.professionalId === user.id,
          );
          if (!r) throw Error("Assigned request not found.");
          if (
            !["approved", "more_information", "declined"].includes(
              payload.status,
            )
          )
            throw Error("Invalid status.");
          if (payload.status !== "approved" && !payload.explanation?.trim())
            throw Error("An explanation is required.");
          r.status = payload.status;
          r.updates.push({
            status: payload.status,
            explanation: payload.explanation || "",
            createdAt: new Date().toISOString(),
          });
          return { ...r };
        }
      case "requestContext":
        requirePro();
        {
          const r = requests.find(
            (r) => r.id === payload.id && r.professionalId === user.id,
          );
          if (!r) throw Error("Assigned request not found.");
          return {
            checkins: r.shareCheckins
              ? checkins.filter((c) => c.userId === r.userId)
              : [],
            history: r.shareHistory
              ? plans.filter((p) => p.userId === r.userId)
              : [],
          };
        }
      case "consultations":
        requirePro();
        return consultations.filter((c) => c.professionalId === user.id);
      case "professionalProfile":
        requirePro();
        return { ...profile };
      case "saveProfessionalProfile":
        requirePro();
        Object.assign(profile, payload);
        return { ...profile };
      case "notifications":
        requireUser();
        return [
          {
            id: "n1",
            title: "Gentle check-in",
            message: "How are you feeling today?",
            destination: "checkin",
          },
          {
            id: "n2",
            title: "Support reminder",
            message:
              "If you’ve got a lot going on, Talk or Reflect when you can.",
            destination: "chat",
          },
          {
            id: "n3",
            title: "Resource reminder",
            message:
              "Need a quiet reset? There’s a resource you can try when you’re ready.",
            destination: "resources",
          },
          {
            id: "n4",
            title: "Return reminder",
            message: "Whenever you need to talk, we’re here.",
            destination: "dashboard",
          },
        ];
      case "enquiry": {
        const e = { ...payload, id: crypto.randomUUID() };
        enquiries.push(e);
        return e;
      }
      case "chat":
        requireUser();
        if (payload.message.toLowerCase() === "/error")
          throw Error("Could not get a reply.");
        return {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "This is a demo reply, not an AI service. Would you like to put your thoughts into words or choose one small next step?",
        };
      default:
        throw Error(`Unknown operation: ${operation}`);
    }
  };
}
export const mockApi = createMockApi();
