import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/utils/response";

export function ok<T, TMeta = Record<string, unknown>>(data: T, meta: TMeta, status = 200) {
  return NextResponse.json(successResponse(data, meta), { status });
}

export function fail(code: string, message: string, status: number, meta?: Record<string, unknown>) {
  return NextResponse.json(errorResponse(code, message, meta), { status });
}
