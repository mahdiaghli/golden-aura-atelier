export type AuthUser = {
  name: string;
  email: string;
  password: string;
};

const USERS_KEY = "aurum-users";
const SESSION_KEY = "aurum-session";

function seedDemoUser(): AuthUser {
  const demoUser: AuthUser = {
    name: "Aurum Member",
    email: "member@aurum.com",
    password: "aurum123",
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(USERS_KEY, JSON.stringify([demoUser]));
  }

  return demoUser;
}

export function getStoredUsers(): AuthUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedUsers = window.localStorage.getItem(USERS_KEY);
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers) as AuthUser[];
      if (parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore malformed storage and fall back to the demo account.
  }

  return [seedDemoUser()];
}

export function signIn(email: string, password: string): AuthUser | null {
  const users = getStoredUsers();
  const match = users.find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password,
  );

  if (!match) {
    return null;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(match));
  }

  return match;
}

export function signUp(user: AuthUser): AuthUser {
  const users = getStoredUsers();
  const normalizedUser = {
    ...user,
    email: user.email.trim().toLowerCase(),
  };

  const alreadyExists = users.some((currentUser) => currentUser.email === normalizedUser.email);
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
    return JSON.parse(storedSession) as AuthUser;
  } catch {
    return null;
  }
}

export function signOut(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY);
  }
}
