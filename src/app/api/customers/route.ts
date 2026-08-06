import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getStore } from "./data";
import { customerSchema } from "@/schemas/customer.schema";
import type {
  Customer,
  CustomerStatus,
  PaginatedResponse,
  APIResponse,
} from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<PaginatedResponse<Customer> | APIResponse<null>>> {
  try {
    const { searchParams } = request.nextUrl;

    // ── Parse query params ────────────────────────────────────────────────────
    const search = searchParams.get("search")?.toLowerCase() ?? "";
    const statusParam = searchParams.getAll("status") as CustomerStatus[];
    const companyParam = searchParams.getAll("company");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const email = searchParams.get("email")?.toLowerCase() ?? "";
    const phone = searchParams.get("phone") ?? "";
    const sortBy = (searchParams.get("sortBy") || searchParams.get("field") || "lastContactDate") as keyof Customer;
    const sortDir = searchParams.get("sortDir") || searchParams.get("direction") || "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(
      10000,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? "10", 10))
    );

    // ── Filter ────────────────────────────────────────────────────────────────
    let results = Array.from(getStore().values());

    if (search) {
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.company.toLowerCase().includes(search)
      );
    }

    if (statusParam.length > 0) {
      results = results.filter((c) => statusParam.includes(c.status));
    }

    if (companyParam.length > 0) {
      results = results.filter((c) => companyParam.includes(c.company));
    }

    if (email) {
      results = results.filter((c) => c.email.toLowerCase().includes(email));
    }

    if (phone) {
      results = results.filter((c) => c.phone.includes(phone));
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      const fromTime = fromDate.getTime();
      results = results.filter(
        (c) => new Date(c.lastContactDate).getTime() >= fromTime
      );
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      const toTime = toDate.getTime();
      results = results.filter(
        (c) => new Date(c.lastContactDate).getTime() <= toTime
      );
    }

    // ── Sort ──────────────────────────────────────────────────────────────────
    if (sortBy) {
      results.sort((a, b) => {
        const aVal = a[sortBy] ?? "";
        const bVal = b[sortBy] ?? "";

        let comparison = 0;
        if (sortBy === "lastContactDate" || sortBy === "createdAt") {
          const aTime = new Date(aVal).getTime();
          const bTime = new Date(bVal).getTime();
          comparison = aTime - bTime;
        } else if (typeof aVal === "string" && typeof bVal === "string") {
          comparison = aVal.localeCompare(bVal);
        }

        return sortDir === "desc" ? -comparison : comparison;
      });
    }

    // ── Paginate ──────────────────────────────────────────────────────────────
    const total = results.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const paginatedData = results.slice(startIndex, startIndex + pageSize);

    const response: PaginatedResponse<Customer> = {
      data: paginatedData,
      total,
      page: safePage,
      pageSize,
      totalPages,
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

export async function POST(
  request: NextRequest
): Promise<NextResponse<APIResponse<Customer> | APIResponse<null>>> {
  try {
    const body: unknown = await request.json();
    const validated = customerSchema.parse(body);

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const newCustomer: Customer = {
      id,
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      company: validated.company,
      status: validated.status,
      notes: validated.notes ?? "",
      lastContactDate: validated.lastContactDate
        ? new Date(validated.lastContactDate).toISOString()
        : now,
      createdAt: now,
    };

    getStore().set(id, newCustomer);

    const response: APIResponse<Customer> = {
      data: newCustomer,
      message: "Customer created successfully",
      success: true,
    };
    return NextResponse.json(response, { status: 201 });
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
