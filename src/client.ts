import {
  AstruxError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ValidationError,
  ServerError,
} from "./errors";
import type { PredictResponse } from "./types";

const DEFAULT_BASE = "https://www.astrux.io/api"; 

function mapHttpError(status: number, bodyText: string, payload?: unknown): never {
  const message = (typeof payload === "object" && payload && (payload as any).detail) || bodyText || `HTTP ${status}`;

  if (status === 401) throw new AuthenticationError(String(message), { status, payload });
  if (status === 404) throw new NotFoundError(String(message), { status, payload });
  if (status === 429) throw new RateLimitError(String(message), { status, payload });
  if (status === 400 || status === 422) throw new ValidationError(String(message), { status, payload });
  if (status >= 500) throw new ServerError(String(message), { status, payload });
  throw new AstruxError(String(message), { status, payload });
}

function withTimeout(ms: number) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(`Request timed out after ${ms}ms`), ms);
  return { signal: ctrl.signal, done: () => clearTimeout(id) };
}

class ModelsClient {
  private apiKey: string;
  private timeout: number;
  constructor(apiKey: string, timeout: number) {
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  async predict(args: {
    model: string;
    input: Record<string, unknown>;
    version?: number | null;
  }): Promise<PredictResponse> {
    const { model, input, version } = args || ({} as any);
    if (!model) throw new ValidationError("`model` is required");
    if (typeof input !== "object" || input === null) throw new ValidationError("`input` must be an object");

    const url = `${DEFAULT_BASE}/predict`;
    const { signal, done } = withTimeout(this.timeout);

    try {
      const resp = await fetch(url, {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "User-Agent": "astrux-js/0.1.1",
        },
        body: JSON.stringify({ model, input, ...(version != null ? { version } : {}) }),
      });

      const rawText = await resp.text();
      let payload: any = undefined;
      try { payload = rawText ? JSON.parse(rawText) : undefined; } catch {}

      if (!resp.ok) {
        mapHttpError(resp.status, rawText, payload);
      }

      const data = (payload ?? {}) as Record<string, unknown>;
      if ("class" in data && !("class_" in data)) {
        (data as any).class_ = (data as any).class;
        delete (data as any).class;
      }
      return data as PredictResponse;
    } catch (err: any) {
      if (err?.name === "AbortError") {
        throw new AstruxError(String(err?.message || "Request aborted"));
      }
      throw err;
    } finally {
      done();
    }
  }
}

export class Astrux {
  private apiKey: string;
  private timeout: number;
  public models: ModelsClient;

  constructor(opts: { apiKey?: string; timeout?: number } = {}) {
    const key = opts.apiKey || process.env.ASTRUX_API_KEY;
    if (!key) {
      throw new AuthenticationError("Missing API key. Pass `apiKey` or set ASTRUX_API_KEY");
    }
    this.apiKey = key;
    this.timeout = typeof opts.timeout === "number" ? opts.timeout : 30000;
    this.models = new ModelsClient(this.apiKey, this.timeout);
  }
}
