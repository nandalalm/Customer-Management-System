import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getStore } from "../data";
import { customerSchema } from "@/schemas/customer.schema";
import type { Customer, APIResponse } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<APIResponse<Customer> | APIResponse<null>>> {
  try {
    const { id } = await context.params;
    const customer = getStore().get(id);

    if (!customer) {
      const notFound: APIResponse<null> = {
        data: null,
        message: `Customer with id "${id}" not found`,
        success: false,
      };
      return NextResponse.json(notFound, { status: 404 });
    }

    const response: APIResponse<Customer> = {
      data: customer,
      message: "Customer retrieved successfully",
      success: true,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const errorResponse: APIResponse<null> = {
      data: null,
      message,
      success: false,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<APIResponse<Customer> | APIResponse<null>>> {
  try {
    const { id } = await context.params;
    const store = getStore();
    const existing = store.get(id);

    if (!existing) {
      const notFound: APIResponse<null> = {
        data: null,
        message: `Customer with id "${id}" not found`,
        success: false,
      };
      return NextResponse.json(notFound, { status: 404 });
    }

    const body: unknown = await request.json();
    // Partial validation: strip unknown keys but keep all fields optional so
    // callers can send only the fields they want to update.
    const validated = customerSchema.partial().parse(body);

    const updated: Customer = {
      ...existing,
      ...validated,
      notes: validated.notes ?? existing.notes,
      lastContactDate: validated.lastContactDate
        ? new Date(validated.lastContactDate).toISOString()
        : existing.lastContactDate,
      id,
    };

    store.set(id, updated);

    const response: APIResponse<Customer> = {
      data: updated,
      message: "Customer updated successfully",
      success: true,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationResponse: APIResponse<null> = {
        data: null,
        // ZodError.issues is the v4 API; .errors was removed in v4
        message: error.issues.map((i) => i.message).join("; "),
        success: false,
      };
      return NextResponse.json(validationResponse, { status: 400 });
    }

    const message =
      error instanceof Error ? error.message : "Internal server error";
    const errorResponse: APIResponse<null> = {
      data: null,
      message,
      success: false,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<APIResponse<{ id: string }> | APIResponse<null>>> {
  try {
    const { id } = await context.params;
    const store = getStore();

    if (!store.has(id)) {
      const notFound: APIResponse<null> = {
        data: null,
        message: `Customer with id "${id}" not found`,
        success: false,
      };
      return NextResponse.json(notFound, { status: 404 });
    }

    store.delete(id);

    const response: APIResponse<{ id: string }> = {
      data: { id },
      message: "Customer deleted successfully",
      success: true,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const errorResponse: APIResponse<null> = {
      data: null,
      message,
      success: false,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
