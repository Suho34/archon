export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  route?: string;
  method?: string;
  status?: number;
  durationMs?: number;
  userId?: string;
  metadata?: Record<string, unknown>;
  error?: {
    name?: string;
    message: string;
    stack?: string;
  };
}

export interface AiClarificationLogParams {
  projectId: string;
  model: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  ambiguitiesCount?: number;
  fallbackUsed?: boolean;
  status: "success" | "failure" | "fallback";
  error?: string;
}

class StructuredLogger {
  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  private emit(entry: LogEntry) {
    const formatted = this.formatLog(entry);
    switch (entry.level) {
      case "error":
        console.error(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "debug":
        console.debug(formatted);
        break;
      case "info":
      default:
        console.log(formatted);
        break;
    }
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.emit({
      timestamp: new Date().toISOString(),
      level: "info",
      message,
      metadata,
    });
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.emit({
      timestamp: new Date().toISOString(),
      level: "warn",
      message,
      metadata,
    });
  }

  error(message: string, metadata?: Record<string, unknown>, err?: unknown) {
    let errorDetails: LogEntry["error"] | undefined;
    if (err instanceof Error) {
      errorDetails = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
    } else if (err) {
      errorDetails = {
        message: String(err),
      };
    }

    this.emit({
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      metadata,
      error: errorDetails,
    });
  }

  apiRoute(params: {
    route: string;
    method: string;
    status: number;
    durationMs: number;
    userId?: string;
    metadata?: Record<string, unknown>;
    error?: unknown;
  }) {
    const level: LogLevel =
      params.status >= 500 ? "error" : params.status >= 400 ? "warn" : "info";

    let errorDetails: LogEntry["error"] | undefined;
    if (params.error instanceof Error) {
      errorDetails = {
        name: params.error.name,
        message: params.error.message,
        stack: params.error.stack,
      };
    } else if (params.error) {
      errorDetails = { message: String(params.error) };
    }

    this.emit({
      timestamp: new Date().toISOString(),
      level,
      message: `API ${params.method} ${params.route} responded with ${params.status} (${params.durationMs}ms)`,
      route: params.route,
      method: params.method,
      status: params.status,
      durationMs: params.durationMs,
      userId: params.userId,
      metadata: params.metadata,
      error: errorDetails,
    });
  }

  aiClarification(params: AiClarificationLogParams) {
    const level: LogLevel =
      params.status === "failure" ? "error" : params.status === "fallback" ? "warn" : "info";

    this.emit({
      timestamp: new Date().toISOString(),
      level,
      message: `AI Clarification [${params.model}] ${params.status} in ${params.latencyMs}ms (Tokens: ${params.totalTokens ?? "N/A"})`,
      metadata: {
        category: "ai_telemetry",
        action: "clarification",
        projectId: params.projectId,
        model: params.model,
        latencyMs: params.latencyMs,
        promptTokens: params.promptTokens,
        completionTokens: params.completionTokens,
        totalTokens: params.totalTokens,
        ambiguitiesCount: params.ambiguitiesCount,
        fallbackUsed: params.fallbackUsed ?? false,
        status: params.status,
        error: params.error,
      },
    });
  }
}

export const logger = new StructuredLogger();
