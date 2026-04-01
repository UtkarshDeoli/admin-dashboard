import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { BUSINESS_COLLECTION, POCKETBASE_URL, USERS_COLLECTION } from "@/lib/pocketbase";

interface DeleteAccountRequest {
  email?: string;
  password?: string;
  accountTypes?: string[]; // ["user"] or ["business"] or ["user", "business"]
}

async function authenticateAgainstCollections(
  pb: PocketBase,
  collectionNames: string[],
  email: string,
  password: string,
  requestId: string,
  label: "USER" | "BUSINESS",
) {
  for (const collectionName of collectionNames) {
    try {
      console.log(`[${requestId}] ${label} auth attempt`, {
        collection: collectionName,
        email,
      });
      const auth = await pb.collection(collectionName).authWithPassword(email, password);
      if (auth.record?.id) {
        console.log(`[${requestId}] ${label} auth success`, {
          collection: collectionName,
          id: auth.record.id,
        });
        return { auth, collectionName };
      }
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      console.warn(`[${requestId}] ${label} auth failed`, {
        collection: collectionName,
        status: err?.status,
        message: err?.message,
      });
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const requestId = `acc-del-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const body = (await request.json()) as DeleteAccountRequest;
    const email = body.email?.trim();
    const password = body.password?.trim();
    const accountTypes = body.accountTypes || [];

    console.log(`[${requestId}] /api/account/delete started`, {
      hasEmail: Boolean(email),
      email,
      hasPassword: Boolean(password),
      accountTypes,
    });

    if (!email || !password) {
      console.warn(`[${requestId}] Missing required credentials`);
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    if (accountTypes.length === 0) {
      console.warn(`[${requestId}] No accountTypes provided`);
      return NextResponse.json(
        { error: "No account type specified for deletion." },
        { status: 400 },
      );
    }

    const pb = new PocketBase(POCKETBASE_URL);
    const deletedAccounts = {
      user: false,
      business: false,
    };
    const userCollections = Array.from(new Set([USERS_COLLECTION, "User"]));
    const businessCollections = Array.from(new Set([BUSINESS_COLLECTION, "business"]));

    // Delete user account if requested
    if (accountTypes.includes("user")) {
      try {
        console.log(`[${requestId}] USER deletion requested`);
        const userMatch = await authenticateAgainstCollections(
          pb,
          userCollections,
          email,
          password,
          requestId,
          "USER",
        );

        if (!userMatch?.auth?.record?.id) {
          console.warn(`[${requestId}] USER auth failed in all configured collections`, {
            triedCollections: userCollections,
          });
          return NextResponse.json(
            { error: "Unable to validate user account." },
            { status: 401 },
          );
        }

        const userId = userMatch.auth.record.id;

        // Delete the user account
        await pb.collection(userMatch.collectionName).delete(userId);
        deletedAccounts.user = true;
        console.log(`[${requestId}] USER deletion successful`, {
          userId,
          collection: userMatch.collectionName,
        });
        pb.authStore.clear();
      } catch (error) {
        const err = error as { status?: number; message?: string; data?: unknown };
        console.warn(`[${requestId}] USER deletion/auth failed`, {
          status: err?.status,
          message: err?.message,
        });
        const message =
          error instanceof Error ? error.message.toLowerCase() : "unknown error";
        if (
          message.includes("failed to authenticate") ||
          message.includes("invalid")
        ) {
          return NextResponse.json(
            { error: "Invalid email or password for user account." },
            { status: 401 },
          );
        }
        throw error;
      }
    }

    // Delete business account if requested
    if (accountTypes.includes("business")) {
      try {
        console.log(`[${requestId}] BUSINESS deletion requested`);
        const businessMatch = await authenticateAgainstCollections(
          pb,
          businessCollections,
          email,
          password,
          requestId,
          "BUSINESS",
        );

        if (!businessMatch?.auth?.record?.id) {
          console.warn(`[${requestId}] BUSINESS auth failed in all configured collections`, {
            triedCollections: businessCollections,
          });
          return NextResponse.json(
            { error: "Unable to validate business account." },
            { status: 401 },
          );
        }

        const businessId = businessMatch.auth.record.id;

        // Delete the business account
        await pb.collection(businessMatch.collectionName).delete(businessId);
        deletedAccounts.business = true;
        console.log(`[${requestId}] BUSINESS deletion successful`, {
          businessId,
          collection: businessMatch.collectionName,
        });
        pb.authStore.clear();
      } catch (error) {
        const err = error as { status?: number; message?: string; data?: unknown };
        console.warn(`[${requestId}] BUSINESS deletion/auth failed`, {
          status: err?.status,
          message: err?.message,
        });
        const message =
          error instanceof Error ? error.message.toLowerCase() : "unknown error";
        if (
          message.includes("failed to authenticate") ||
          message.includes("invalid")
        ) {
          // If user account was deleted but business deletion fails, still return success for user
          if (deletedAccounts.user) {
            return NextResponse.json({
              success: true,
              message: "User account deleted. Business account deletion failed.",
              deleted: deletedAccounts,
              retention: "Some server logs may be retained for up to 30 days for legal/security auditing.",
            });
          }
          return NextResponse.json(
            { error: "Invalid email or password for business account." },
            { status: 401 },
          );
        }
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Your account deletion request has been completed.",
      deleted: deletedAccounts,
      retention: "Some server logs may be retained for up to 30 days for legal/security auditing.",
    });
  } catch (error: unknown) {
    console.error(`[${requestId}] /api/account/delete unexpected error`, error);
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
      { error: "Failed to delete account. Please try again later." },
      { status: 500 },
    );
  }
}
