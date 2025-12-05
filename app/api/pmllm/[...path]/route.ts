import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.PMLLM_BACKEND_URL ?? "http://localhost:8000";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const normalizeTargetUrl = (request: NextRequest, segments: string[] = []) => {
  const targetPath = segments.join("/");
  const url = new URL(BACKEND_BASE_URL);
  const pathPrefix = url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname;
  const joinedPath = [pathPrefix, targetPath].filter(Boolean).join("/");
  url.pathname = `/${joinedPath}`.replace(/\/+/, "/");
  url.search = request.nextUrl.search;
  return url.toString();
};

const buildRequestInit = async (request: NextRequest) => {
  const headers = new Headers(request.headers);
  headers.delete("host");

  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD") {
    return { method, headers } satisfies RequestInit;
  }

  const body = await request.arrayBuffer();
  return {
    method,
    headers,
    body,
  } satisfies RequestInit;
};

const forwardRequest = async (request: NextRequest, segments: string[] = []) => {
  if (!BACKEND_BASE_URL) {
    return NextResponse.json(
      { message: "Missing PMLLM_BACKEND_URL environment variable" },
      { status: 500 },
    );
  }

  const targetUrl = normalizeTargetUrl(request, segments);
  const init = await buildRequestInit(request);
  const response = await fetch(targetUrl, {
    ...init,
    redirect: "manual",
  });

  const bufferedBody = await response.arrayBuffer();
  const nextResponse = new NextResponse(bufferedBody, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  Object.entries(corsHeaders).forEach(([key, value]) => {
    nextResponse.headers.set(key, value);
  });

  return nextResponse;
};

const handleOptions = () => {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
};

type RouteContext = { params: { path?: string[] } } | { params: Promise<{ path?: string[] }> };

const createHandler = (method?: string) => {
  return async (request: NextRequest, context: RouteContext) => {
    if (method === "OPTIONS") {
      return handleOptions();
    }

    const params = "then" in context.params ? await context.params : context.params;
    const segments = params?.path ?? [];
    return forwardRequest(request, segments);
  };
};

export const GET = createHandler("GET");
export const POST = createHandler("POST");
export const PUT = createHandler("PUT");
export const PATCH = createHandler("PATCH");
export const DELETE = createHandler("DELETE");
export const HEAD = createHandler("HEAD");
export const OPTIONS = createHandler("OPTIONS");
