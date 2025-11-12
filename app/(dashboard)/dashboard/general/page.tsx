"use client";

import { deleteAccount, updateAccount } from "@/app/(login)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { customerPortalAction } from "@/lib/payments/actions";
import { Download, Loader2, Trash2 } from "lucide-react";
import { Suspense, useActionState, useState } from "react";
import { TbCrown } from "react-icons/tb";

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
};

type DeleteState = {
  password?: string;
  error?: string;
  success?: string;
};

type AccountFormProps = {
  state: ActionState;
  nameValue?: string;
  emailValue?: string;
};

function AccountForm({
  state,
  nameValue = "",
  emailValue = "",
}: AccountFormProps) {
  return (
    <>
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your name"
          defaultValue={state.name || nameValue}
          required
        />
      </div>
      <div>
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          defaultValue={emailValue}
          required
        />
      </div>
    </>
  );
}

function AccountFormWithData({ state }: { state: ActionState }) {
  const { user } = useUser();
  return (
    <AccountForm
      state={state}
      nameValue={user?.name ?? ""}
      emailValue={user?.email ?? ""}
    />
  );
}

export default function GeneralPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {}
  );

  const [deleteState, deleteAction, isDeletePending] = useActionState<
    DeleteState,
    FormData
  >(deleteAccount, {});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <section className="flex-1 p-4 lg:p-8">
      {/* Subscription card moved from Profile */}
      <SubscriptionCard />

      <Card>
        <CardHeader className="pt-6">
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <form className="space-y-4" action={formAction}>
            <Suspense fallback={<AccountForm state={state} />}>
              <AccountFormWithData state={state} />
            </Suspense>
            {state.error && (
              <p className="text-red-500 text-sm">{state.error}</p>
            )}
            {state.success && (
              <p className="text-green-500 text-sm">{state.success}</p>
            )}
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <MobileNumberCard />

      <Card className="mt-6">
        <CardHeader className="pt-6">
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <p className="text-sm text-gray-500 mb-4">
            Export your data or permanently delete your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <form method="get" action="/api/user/export">
              <Button
                type="submit"
                className="bg-white border border-gray-200 text-gray-900 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </form>

            <div className="ml-0 sm:ml-auto">
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteModalOpen}
        title="Delete Account"
        description="Account deletion is non-reversible. Please enter your password to confirm."
        onClose={() => setDeleteModalOpen(false)}
      >
        <form action={deleteAction} className="space-y-4">
          <div>
            <Label htmlFor="delete-password" className="mb-2">
              Confirm Password
            </Label>
            <Input
              id="delete-password"
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={100}
              defaultValue={deleteState.password}
            />
          </div>
          {deleteState.error && (
            <p className="text-red-500 text-sm">{deleteState.error}</p>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
              disabled={isDeletePending}
            >
              {isDeletePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          </div>
        </form>
      </ConfirmDialog>
    </section>
  );
}

function SubscriptionCard() {
  return (
    <Card className="mb-8">
      <CardHeader className="pt-6">
        <CardTitle>Your Subscription</CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium">Current Plan: Free</p>
              <p className="text-sm text-muted-foreground">
                No active subscription
              </p>
            </div>
            <form action={customerPortalAction}>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              >
                <TbCrown className="h-4 w-4 text-white" />
                Upgrade
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MobileNumberCard() {
  const { user, mutate } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const isVerified = user?.mobileVerified !== null;
  const hasPhone = user?.mobileNumber && user?.mobileCountryCode;
  const displayPhone = hasPhone
    ? `${user.mobileCountryCode}${user.mobileNumber}`
    : "";

  const handleUpdatePhone = async () => {
    if (!phoneNumber) {
      setMessage({ type: "error", text: "Please enter a mobile number" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: phoneNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.error || "Failed to update mobile number",
        });
        setIsSubmitting(false);
        return;
      }

      setMessage({
        type: "success",
        text: "Verification code sent to your mobile number",
      });
      setShowVerification(true);
      setIsSubmitting(false);
      mutate();
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setMessage({ type: "error", text: "Please enter the verification code" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/mobile/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.error || "Failed to verify code",
        });
        setIsSubmitting(false);
        return;
      }

      setMessage({
        type: "success",
        text: "Mobile number verified successfully",
      });
      setShowVerification(false);
      setIsEditing(false);
      setVerificationCode("");
      setPhoneNumber("");
      setIsSubmitting(false);
      mutate();
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pt-6">
        <CardTitle>Mobile Number</CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <p className="text-sm text-gray-500 mb-4">
          Your mobile number is required for WhatsApp service access. Verify
          your number to enable full features.
        </p>

        {!isEditing && hasPhone && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{displayPhone}</p>
                <p
                  className={`text-sm ${
                    isVerified ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {isVerified ? "✓ Verified" : "⚠ Not verified"}
                </p>
              </div>
              <Button
                onClick={() => {
                  setIsEditing(true);
                  setPhoneNumber(displayPhone);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Change Number
              </Button>
            </div>
            {!isVerified && (
              <Button
                onClick={() => {
                  setShowVerification(true);
                  handleUpdatePhone();
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Verify Current Number
              </Button>
            )}
          </div>
        )}

        {(isEditing || !hasPhone) && !showVerification && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="mobile" className="mb-2">
                Mobile Number
              </Label>
              <div className="mt-1">
                <input
                  type="tel"
                  id="mobile"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Include country code (e.g., +1 for US, +351 for Portugal)
              </p>
            </div>
            {message && (
              <p
                className={`text-sm ${
                  message.type === "error" ? "text-red-500" : "text-green-500"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleUpdatePhone}
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
              {isEditing && (
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setPhoneNumber("");
                    setMessage(null);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        {showVerification && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="verificationCode" className="mb-2">
                Verification Code
              </Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the 6-digit code sent to your mobile number
              </p>
            </div>
            {message && (
              <p
                className={`text-sm ${
                  message.type === "error" ? "text-red-500" : "text-green-500"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleVerifyCode}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowVerification(false);
                  setVerificationCode("");
                  setMessage(null);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
