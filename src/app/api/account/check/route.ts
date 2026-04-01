import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { BUSINESS_COLLECTION, POCKETBASE_URL, USERS_COLLECTION } from "@/lib/pocketbase";

interface CheckAccountRequest {
  email?: string;
  password?: string;
}

interface CheckAccountResponse {
  userExists: boolean;
  businessExists: boolean;
  userId?: string;
  businessId?: string;
  userEmail?: string;
  businessEmail?: string;
  userCollection?: string;
  businessCollection?: string;
}

export async function POST(request: NextRequest) {
  const requestId = `acc-check-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const body = (await request.json()) as CheckAccountRequest;
    const email = body.email?.trim();
    const password = body.password?.trim();

    console.log(`[${requestId}] /api/account/check started`, {
      hasEmail: Boolean(email),
      email,
      hasPassword: Boolean(password),
    });

    if (!email || !password) {
      console.warn(`[${requestId}] Missing required credentials`);
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const pb = new PocketBase(POCKETBASE_URL);
    const response: CheckAccountResponse = {
      userExists: false,
      businessExists: false,
    };

    const userCollections = Array.from(new Set([USERS_COLLECTION, "User"]));
    for (const collectionName of userCollections) {
      try {
        console.log(`[${requestId}] Trying USERS auth`, {
          collection: collectionName,
          email,
        });
        const userAuth = await pb
          .collection(collectionName)
          .authWithPassword(email, password);

        if (userAuth.record?.id) {
          response.userExists = true;
          response.userId = userAuth.record.id;
          response.userEmail = userAuth.record.email || email;
          response.userCollection = collectionName;
          console.log(`[${requestId}] USERS auth success`, {
            userId: userAuth.record.id,
            collection: collectionName,
          });
          break;
        }
      } catch (error: unknown) {
        const err = error as { status?: number; message?: string; data?: unknown };
        console.warn(`[${requestId}] USERS auth failed`, {
          collection: collectionName,
          status: err?.status,
          message: err?.message,
        });
      }
    }

    const businessCollections = Array.from(new Set([BUSINESS_COLLECTION, "business"]));
    for (const collectionName of businessCollections) {
      try {
        console.log(`[${requestId}] Trying BUSINESS auth`, {
          collection: collectionName,
          email,
        });
        const businessAuth = await pb
          .collection(collectionName)
          .authWithPassword(email, password);

        if (businessAuth.record?.id) {
          response.businessExists = true;
          response.businessId = businessAuth.record.id;
          response.businessEmail = businessAuth.record.email || email;
          response.businessCollection = collectionName;
          console.log(`[${requestId}] BUSINESS auth success`, {
            businessId: businessAuth.record.id,
            collection: collectionName,
          });
          break;
        }
      } catch (error: unknown) {
        const err = error as { status?: number; message?: string; data?: unknown };
        console.warn(`[${requestId}] BUSINESS auth failed`, {
          collection: collectionName,
          status: err?.status,
          message: err?.message,
        });
      }
    }

    // If neither account exists
    if (!response.userExists && !response.businessExists) {
      console.warn(`[${requestId}] No matching account found for provided credentials`);
      return NextResponse.json(
        { error: "No account found with these credentials." },
        { status: 401 },
      );
    }

    pb.authStore.clear();
    console.log(`[${requestId}] Account check success`, {
      userExists: response.userExists,
      businessExists: response.businessExists,
    });

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: unknown) {
    console.error(`[${requestId}] /api/account/check unexpected error`, error);
    const message =
      error instanceof Error ? error.message.toLowerCase() : "unknown error";

    if (
      message.includes("failed to authenticate") ||
      message.includes("invalid") ||
      message.includes("400")
    ) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Failed to check account. Please try again later." },
      { status: 500 },
    );
  }
}
