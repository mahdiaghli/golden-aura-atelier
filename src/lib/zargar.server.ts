// Server-only client for the Zargar accounting "Web Interface" (رابط وب) API.
// Auth: GET {base}/services/login/?username=..&password=..  -> Result.UserKey
// Data: GET {base}/Services/MadeGold/List/?userkey=..&BusinessId=..&PageIndex=..&PageCount=..

export type ZargarItem = {
  code: string;
  images: string[];
  quantity: number;
  isExists: boolean;
  title?: string;
  location?: string;
};

export type ZargarInventory = Record<string, ZargarItem>;

type Cache = { at: number; data: ZargarInventory; error?: string };

const TTL_MS = 10 * 60 * 1000;
const PAGE_COUNT = 500;
const MAX_PAGES = 40;
const REQUEST_TIMEOUT_MS = 15_000;

let cache: Cache | undefined;
let inflight: Promise<Cache> | undefined;

export function zargarConfig() {
  return {
    baseUrl: (process.env["ZARGAR_BASE_URL"] ?? "").replace(/\/+$/, ""),
    username: process.env["ZARGAR_USERNAME"] ?? "Service",
    password: process.env["ZARGAR_PASSWORD"] ?? "",
    businessId: process.env["ZARGAR_BUSINESS_ID"] ?? "1",
  };
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Zargar API responded ${response.status}`);
  return response.json();
}

async function login(): Promise<string> {
  const { baseUrl, username, password } = zargarConfig();
  const url = `${baseUrl}/services/login/?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
  const payload = (await getJson(url)) as { Status?: string; Result?: { UserKey?: string } };
  const userKey = payload?.Result?.UserKey;
  if (!userKey) throw new Error("Zargar login did not return a UserKey");
  return userKey;
}

type RawRow = Record<string, unknown>;

function str(value: unknown): string {
  return value == null ? "" : String(value).trim();
}

function normalizeRow(row: RawRow): ZargarItem | null {
  const code = str(row["ProductCode"]) || str(row["OfficeCode"]) || str(row["OldCode"]);
  if (!code) return null;

  const images = [1, 2, 3, 4, 5, 6]
    .map((n) => str(row[`ImageURL${n}`]))
    .filter((value) => value.length > 0);

  const isExists = str(row["IsExists"]) === "1" || row["IsExists"] === true;
  const reserved = str(row["IsReserved"]) === "1" || row["IsReserved"] === true;

  return {
    code: code.toUpperCase(),
    images,
    quantity: isExists && !reserved ? 1 : 0,
    isExists,
    title: str(row["ProductTitle"]) || undefined,
    location: str(row["LocationTitle"]) || undefined,
  };
}

async function loadInventory(): Promise<Cache> {
  const { baseUrl, businessId } = zargarConfig();
  if (!baseUrl) return { at: Date.now(), data: {}, error: "ZARGAR_BASE_URL is not configured" };

  try {
    const userKey = await login();
    const data: ZargarInventory = {};

    for (let pageIndex = 1; pageIndex <= MAX_PAGES; pageIndex++) {
      const url =
        `${baseUrl}/Services/MadeGold/List/?userkey=${encodeURIComponent(userKey)}` +
        `&BusinessId=${encodeURIComponent(businessId)}&PageIndex=${pageIndex}&PageCount=${PAGE_COUNT}`;
      const payload = (await getJson(url)) as { Result?: RawRow[] };
      const rows = Array.isArray(payload?.Result) ? payload.Result : [];
      for (const row of rows) {
        const item = normalizeRow(row);
        if (item) data[item.code] = item;
      }
      if (rows.length < PAGE_COUNT) break;
    }

    return { at: Date.now(), data };
  } catch (error) {
    return {
      at: Date.now(),
      data: {},
      error: error instanceof Error ? error.message : "Unknown Zargar API error",
    };
  }
}

export async function getInventory(): Promise<Cache> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache;
  if (!inflight) {
    inflight = loadInventory().then((result) => {
      cache = result;
      inflight = undefined;
      return result;
    });
  }
  return inflight;
}

export function isAllowedImageUrl(raw: string): boolean {
  const { baseUrl } = zargarConfig();
  if (!baseUrl) return false;
  try {
    return new URL(raw).host === new URL(baseUrl).host;
  } catch {
    return false;
  }
}
