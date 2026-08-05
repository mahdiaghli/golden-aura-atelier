export type UserRole = "user" | "admin";

export type AuthUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const USERS_KEY = "aurum-users";
const SESSION_KEY = "aurum-session";

/** فقط همین ۲ نفر ادمین هستند */
const ADMIN_EMAILS = ["admin@aurum.com", "manager@aurum.com"] as const;

function seedDemoUsers(): AuthUser[] {
  const users: AuthUser[] = [
    {
      name: "Aurum Member",
      email: "member@aurum.com",
      password: "aurum123",
      role: "user",
    },
    {
      name: "Aurum Admin",
      email: "admin@aurum.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Store Manager",
      email: "manager@aurum.com",
      password: "manager123",
      role: "admin",
    },
  ];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  return users;
}

function normalizeUser(raw: Partial<AuthUser>): AuthUser {
  const email = (raw.email ?? "").trim().toLowerCase();
  const isAdminEmail = (ADMIN_EMAILS as readonly string[]).includes(email);

  return {
    name: raw.name ?? "",
    email,
    password: raw.password ?? "",
    // فقط همان ۲ ایمیل ادمین؛ بقیه همیشه user
    role: isAdminEmail ? "admin" : "user",
  };
}

export function getStoredUsers(): AuthUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedUsers = window.localStorage.getItem(USERS_KEY);
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers) as Partial<AuthUser>[];
      if (parsed.length > 0) {
        return parsed.map(normalizeUser);
      }
    }
  } catch {
    // Ignore malformed storage and fall back to seed.
  }

  return seedDemoUsers();
}

export function signIn(email: string, password: string): AuthUser | null {
  const users = getStoredUsers();
  const match = users.find(
    (user) =>
      user.email === email.trim().toLowerCase() && user.password === password,
  );

  if (!match) {
    return null;
  }

  const normalized = normalizeUser(match);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

export function signUp(user: {
  name: string;
  email: string;
  password: string;
}): AuthUser {
  const users = getStoredUsers();
  const email = user.email.trim().toLowerCase();

  // جلوگیری از ثبت‌نام با ایمیل‌های ادمین
  if ((ADMIN_EMAILS as readonly string[]).includes(email)) {
    throw new Error("This email is reserved.");
  }

  const normalizedUser: AuthUser = {
    name: user.name.trim(),
    email,
    password: user.password,
    role: "user",
  };

  const alreadyExists = users.some((u) => u.email === normalizedUser.email);
  if (alreadyExists) {
    throw new Error("An account already exists with that email.");
  }

  const nextUsers = [...users, normalizedUser];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(normalizedUser));
  }

  return normalizedUser;
}

export function getSessionUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedSession = window.localStorage.getItem(SESSION_KEY);
  if (!storedSession) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(storedSession) as Partial<AuthUser>);
  } catch {
    return null;
  }
}

export function isAdmin(user: AuthUser | null | undefined): boolean {
  return user?.role === "admin";
}

export function signOut(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY);
  }
}