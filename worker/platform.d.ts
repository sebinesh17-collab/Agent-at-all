interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(columnName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success?: boolean; meta?: Record<string, unknown> }>;
  run(): Promise<{ success?: boolean; meta?: { changes?: number; [key: string]: unknown } }>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<T[]>;
}
interface R2ObjectBody { text(): Promise<string>; arrayBuffer(): Promise<ArrayBuffer>; body: ReadableStream<Uint8Array>; size: number; }
interface R2Bucket {
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: unknown): Promise<unknown>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ objects: Array<{ key: string; size: number; uploaded: Date }>; truncated?: boolean; cursor?: string }>;
}
interface Fetcher { fetch(request: Request): Promise<Response>; }
interface Queue<T = unknown> {
  send(message: T, options?: { contentType?: 'json' | 'text' | 'bytes' }): Promise<void>;
}
interface MessageBatch<T = unknown> {
  messages: Array<{ body: T; ack(): void; retry(options?: { delaySeconds?: number }): void }>;
}
interface DurableObjectNamespace {
  idFromName(name: string): unknown;
  get(id: unknown): { fetch(input: string | Request, init?: RequestInit): Promise<Response> };
}
interface DurableObjectState {
  storage: {
    put(key: string, value: unknown): Promise<void>;
    get<T = unknown>(key: string): Promise<T | undefined>;
    list<T = unknown>(): Promise<Map<string, T>>;
  };
  container?: AetherContainer;
}
interface AetherContainerProcess {
  exitCode: Promise<number>;
  output(): Promise<{ stdout: ArrayBuffer; stderr: ArrayBuffer; exitCode: number }>;
}
interface AetherContainer {
  running: boolean;
  images: { base: unknown };
  start(options: { image?: unknown; containerSnapshot?: { id: string }; enableInternet: boolean; instance?: 'lite' | 'standard-1' | 'standard-2' | 'standard-3' | 'standard-4' }): void;
  setInactivityTimeout(durationMs: number): Promise<void>;
  snapshotContainer(options: { name?: string }): Promise<{ id: string; size: number; name?: string }>;
  exec(command: string[], options?: { cwd?: string; stdin?: ReadableStream<Uint8Array>; stdout?: 'pipe' | 'ignore'; signal?: AbortSignal }): Promise<AetherContainerProcess>;
}
interface WorkflowBinding<T> {
  create(options: { id: string; params: T }): Promise<{ id: string; status(): Promise<unknown> }>;
}
declare module 'cloudflare:workers' {
  export class DurableObject<Env = unknown> {
    protected ctx: DurableObjectState & { container?: AetherContainer };
    protected env: Env;
    constructor(ctx: DurableObjectState, env: Env);
  }
  export interface WorkflowEvent<T> { payload: T; instanceId: string; timestamp: number; }
  export interface WorkflowStep {
    do<T>(name: string, callback: () => Promise<T>): Promise<T>;
    do<T>(name: string, options: { retries?: { limit?: number; delay?: string; backoff?: 'constant' | 'linear' | 'exponential' }; timeout?: string }, callback: () => Promise<T>): Promise<T>;
  }
  export abstract class WorkflowEntrypoint<Env = unknown, Params = unknown> {
    protected env: Env;
    constructor(ctx: unknown, env: Env);
    abstract run(event: WorkflowEvent<Params>, step: WorkflowStep): Promise<unknown>;
  }
}
