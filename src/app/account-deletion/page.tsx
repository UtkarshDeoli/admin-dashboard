"use client";

import { FormEvent, useState } from "react";

interface CheckAccountResponse {
  userExists: boolean;
  businessExists: boolean;
  userId?: string;
  businessId?: string;
}

export default function AccountDeletionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckAccountResponse | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  // Step 1: Check which accounts exist
  const handleCheckAccounts = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/account/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        data?: CheckAccountResponse;
        error?: string;
      };

      if (!response.ok) {
        setError(result.error || "Failed to verify accounts.");
        return;
      }

      if (result.data) {
        setCheckResult(result.data);
        setShowModal(true);
        
        // Pre-select all found accounts
        const toSelect: string[] = [];
        if (result.data.userExists) toSelect.push("user");
        if (result.data.businessExists) toSelect.push("business");
        setSelectedAccounts(toSelect);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Proceed with deletion of selected accounts
  const handleConfirmDeletion = async () => {
    if (selectedAccounts.length === 0) {
      setError("Please select at least one account to delete.");
      return;
    }

    try {
      setLoading(true);
      setShowModal(false);

      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          accountTypes: selectedAccounts,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setError(result.error || "Failed to delete account(s).");
        return;
      }

      setSuccess(result.message || "Account(s) deleted successfully.");
      setEmail("");
      setPassword("");
      setCheckResult(null);
      setSelectedAccounts([]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDeletion = () => {
    setShowModal(false);
    setCheckResult(null);
    setSelectedAccounts([]);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-10">
        <h1 className="mb-2 text-2xl font-semibold text-black dark:text-white">
          CitySync Account Deletion
        </h1>
        <p className="mb-8 text-sm text-body dark:text-bodydark">
          Use this page to request permanent deletion of your CitySync account and associated data.
        </p>

        {!showModal ? (
          <form onSubmit={handleCheckAccounts} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-black dark:text-white"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="w-full rounded border border-stroke bg-transparent px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-black dark:text-white"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded border border-stroke bg-transparent px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary"
              />
            </div>

            {error && (
              <div className="rounded border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded border border-success bg-success/10 px-4 py-3 text-sm text-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded bg-primary px-6 py-3 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Continue to Deletion"}
            </button>
          </form>
        ) : null}

        {/* Warning Modal */}
        {showModal && checkResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark">
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Account Deletion Warning
              </h2>

              <p className="mb-6 text-sm text-body dark:text-bodydark">
                We found the following account(s) associated with this email:
              </p>

              <div className="mb-6 space-y-3">
                {checkResult.userExists && (
                  <label className="flex cursor-pointer items-center rounded border border-stroke p-3 transition hover:bg-gray-1 dark:border-strokedark dark:hover:bg-meta-4">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes("user")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAccounts([...selectedAccounts, "user"]);
                        } else {
                          setSelectedAccounts(selectedAccounts.filter((a) => a !== "user"));
                        }
                      }}
                      className="mr-3 cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-black dark:text-white">User Account</p>
                      <p className="text-xs text-body dark:text-bodydark">Your personal CitySync account will be permanently deleted.</p>
                    </div>
                  </label>
                )}

                {checkResult.businessExists && (
                  <label className="flex cursor-pointer items-center rounded border border-stroke p-3 transition hover:bg-gray-1 dark:border-strokedark dark:hover:bg-meta-4">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes("business")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAccounts([...selectedAccounts, "business"]);
                        } else {
                          setSelectedAccounts(selectedAccounts.filter((a) => a !== "business"));
                        }
                      }}
                      className="mr-3 cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-black dark:text-white">Business Account</p>
                      <p className="text-xs text-body dark:text-bodydark">Your business profile and all associated data will be permanently deleted.</p>
                    </div>
                  </label>
                )}
              </div>

              {error && (
                <div className="mb-4 rounded border border-danger bg-danger/10 px-3 py-2 text-xs text-danger">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDeletion}
                  disabled={loading}
                  className="flex-1 rounded border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-1 disabled:cursor-not-allowed disabled:opacity-60 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeletion}
                  disabled={loading || selectedAccounts.length === 0}
                  className="flex-1 rounded bg-danger px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Deleting..." : "Confirm Deletion"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 rounded border border-stroke bg-gray px-4 py-5 dark:border-strokedark dark:bg-meta-4">
          <h2 className="mb-3 text-base font-semibold text-black dark:text-white">
            Data Handling Details
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-body dark:text-bodydark">
            <li>Deleted: account profile, login credentials, and user-generated account data tied to your profile.</li>
            <li>Kept temporarily: limited security and audit logs.</li>
            <li>Retention period: audit/security logs may be retained for up to 30 days before automatic purge.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
