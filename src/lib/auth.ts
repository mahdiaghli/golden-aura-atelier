import { recordAdminEvent } from "./admin-events";

export type UserRole = "user" | "admin";

export type AuthUser = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
};

const USERS_KEY = "aurum-users";
const SESSION_KEY = "aurum-session";
const PHONE_CODES_KEY = "aurum-phone-codes";
const VERIFIED_PHONES_KEY = "aurum-verified-phones";

/** فقط همین ۲ نفر ادمین هستند */
const ADMIN_EMAILS = ["admin@aurum.com", "manager@aurum.com"] as const;
const DEMO_PHONE_CODE = "111111";
const DEMO_USERS: AuthUser[] = [
  {
    name: "Aurum Member",
    email: "member@aurum.com",
    password: "aurum123",
    phone: "09153145726",
    role: "user",
  },
  {
    name: "Aurum Admin",
    email: "admin@aurum.com",
    password: "admin123",
    phone: "09150000001",
    role: "admin",
  },
  {
    name: "Store Manager",
    email: "manager@aurum.com",
    password: "manager123",
    phone: "09150000002",
    role: "admin",
  },
];

function seedDemoUsers(): AuthUser[] {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS));
    window.dispatchEvent(new CustomEvent(`${USERS_KEY}:changed`));
  }

  return DEMO_USERS;
}

function normalizePhone(raw: string | undefined): string {
  return (raw ?? "").replace(/\D/g, "");
}

function mergeDemoUsers(users: AuthUser[]): AuthUser[] {
  const byEmail = new Map(users.map((user) => [user.email, normalizeUser(user)]));
  DEMO_USERS.forEach((demoUser) => {
    if (!byEmail.has(demoUser.email)) {
      byEmail.set(demoUser.email, normalizeUser(demoUser));
    }
  });
  return Array.from(byEmail.values());
}

function normalizeUser(raw: Partial<AuthUser>): AuthUser {
  const email = (raw.email ?? "").trim().toLowerCase();
  const isAdminEmail = (ADMIN_EMAILS as readonly string[]).includes(email);

  return {
    name: raw.name ?? "",
    email,
    password: raw.password ?? "",
    phone: normalizePhone(raw.phone),
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
        const merged = mergeDemoUsers(parsed.map(normalizeUser));
        window.localStorage.setItem(USERS_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch {
    // Ignore malformed storage and fall back to seed.
  }

  return seedDemoUsers();
}

export function signIn(email: string, password: string): AuthUser | null {
  const users = getStoredUsers();
  const normalizedInput = email.trim().toLowerCase();
  const match = users.find(
    (user) =>
      user.email === normalizedInput && user.password === password,
  );

  if (!match) {
    return null;
  }

  const normalized = normalizeUser(match);

  persistSession(normalized);

  recordAdminEvent({
    type: "user_signed_in",
    title: "ورود کاربر",
    entityType: "user",
    entityId: normalized.email,
    details: {
      name: normalized.name,
      phone: normalized.phone ?? "",
      method: "password",
    },
  });

  return normalized;
}

export function signUp(user: {
  name: string;
  email?: string;
  password?: string;
  phone?: string;
}): AuthUser {
  const users = getStoredUsers();
  const normalizedPhone = normalizePhone(user.phone);
  const email = (user.email?.trim().toLowerCase() || `phone-${normalizedPhone}@aghli.local`).trim();

  // جلوگیری از ثبت‌نام با ایمیل‌های ادمین
  if ((ADMIN_EMAILS as readonly string[]).includes(email)) {
    throw new Error("This email is reserved.");
  }

  const normalizedUser: AuthUser = {
    name: user.name.trim(),
    email,
    password: user.password ?? "",
    phone: normalizedPhone,
    role: "user",
  };

  if (!normalizedUser.phone || normalizedUser.phone.length < 10) {
    throw new Error("شماره موبایل معتبر نیست.");
  }

  const alreadyExists = users.some((u) => u.email === normalizedUser.email);
  const phoneExists = users.some((u) => normalizePhone(u.phone) === normalizedUser.phone);
  if (alreadyExists || phoneExists) {
    throw new Error("An account already exists with that email.");
  }

  const nextUsers = [...users, normalizedUser];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    window.dispatchEvent(new CustomEvent(`${USERS_KEY}:changed`));
  }

  persistSession(normalizedUser);
  clearPhoneVerification(normalizedUser.phone);
  recordAdminEvent({
    type: "user_signed_up",
    title: "ثبت‌نام کاربر",
    entityType: "user",
    entityId: normalizedUser.email,
    details: {
      name: normalizedUser.name,
      phone: normalizedUser.phone ?? "",
    },
  });

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

function readPhoneCodes(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PHONE_CODES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writePhoneCodes(codes: Record<string, string>) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PHONE_CODES_KEY, JSON.stringify(codes));
    window.dispatchEvent(new CustomEvent(`${PHONE_CODES_KEY}:changed`));
  }
}

function readVerifiedPhones(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(VERIFIED_PHONES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeVerifiedPhones(phones: Record<string, string>) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(VERIFIED_PHONES_KEY, JSON.stringify(phones));
  }
}

function persistSession(user: AuthUser) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}

export function findUserByPhone(phone: string): AuthUser | null {
  const normalizedPhone = normalizePhone(phone);
  return getStoredUsers().find((user) => normalizePhone(user.phone) === normalizedPhone) ?? null;
}

export function requestPhoneCode(phone: string): { phone: string; code: string } {
  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length < 10) {
    throw new Error("شماره موبایل معتبر نیست.");
  }

  const nextCodes = { ...readPhoneCodes(), [normalizedPhone]: DEMO_PHONE_CODE };
  writePhoneCodes(nextCodes);
  recordAdminEvent({
    type: "phone_code_requested",
    title: "درخواست کد ورود",
    entityType: "user",
    details: { phone: normalizedPhone },
  });
  return { phone: normalizedPhone, code: DEMO_PHONE_CODE };
}

export function verifyPhoneCode(phone: string, code: string): boolean {
  const normalizedPhone = normalizePhone(phone);
  const trimmedCode = code.trim();
  const storedCode = readPhoneCodes()[normalizedPhone];

  if (!storedCode || storedCode !== trimmedCode) {
    return false;
  }

  const nextCodes = readPhoneCodes();
  delete nextCodes[normalizedPhone];
  writePhoneCodes(nextCodes);

  writeVerifiedPhones({
    ...readVerifiedPhones(),
    [normalizedPhone]: new Date().toISOString(),
  });

  return true;
}

export function isPhoneVerified(phone: string): boolean {
  const normalizedPhone = normalizePhone(phone);
  return Boolean(readVerifiedPhones()[normalizedPhone]);
}

export function clearPhoneVerification(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  const verifiedPhones = readVerifiedPhones();
  delete verifiedPhones[normalizedPhone];
  writeVerifiedPhones(verifiedPhones);
}

export function signInWithPhone(phone: string): AuthUser | null {
  if (!isPhoneVerified(phone)) {
    return null;
  }

  const existingUser = findUserByPhone(phone);
  if (!existingUser) {
    return null;
  }

  persistSession(existingUser);
  recordAdminEvent({
    type: "user_signed_in",
    title: "ورود کاربر",
    entityType: "user",
    entityId: existingUser.email,
    details: {
      name: existingUser.name,
      phone: existingUser.phone ?? "",
      method: "phone",
    },
  });
  clearPhoneVerification(phone);
  return existingUser;
}
