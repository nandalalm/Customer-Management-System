import { NextRequest, NextResponse } from "next/server";
import { getStore } from "../data";
import type { CustomerStatus, APIResponse } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface BulkRequestBody {
  action: "delete" | "set-active" | "set-inactive";
  ids: string[];
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<APIResponse<{ count: number }> | APIResponse<null>>> {
  try {
    const body = (await request.json()) as BulkRequestBody;
    const { action, ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { data: null, message: "No customer IDs provided", success: false },
        { status: 400 }
      );
    }

    const store = getStore();
    let count = 0;

    if (action === "delete") {
      ids.forEach((id) => {
        if (store.has(id)) {
          store.delete(id);
          count++;
        }
      });
    } else if (action === "set-active" || action === "set-inactive") {
      const status: CustomerStatus = action === "set-active" ? "active" : "inactive";
      ids.forEach((id) => {
        const customer = store.get(id);
        if (customer) {
          store.set(id, { ...customer, status });
          count++;
        }
      });
    }

    const actionLabel =
      action === "delete"
        ? "deleted"
        : action === "set-active"
        ? "set to active"
        : "set to inactive";

    return NextResponse.json(
      {
        data: { count },
        message: `Successfully ${actionLabel} ${count} customer${count !== 1 ? "s" : ""}`,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { data: null, message, success: false },
      { status: 500 }
    );
  }
}
