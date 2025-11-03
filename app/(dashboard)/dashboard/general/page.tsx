"use client";

import { deleteAccount, updateAccount } from "@/app/(login)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/db/schema";
import { customerPortalAction } from "@/lib/payments/actions";
import { Download, Loader2, Trash2 } from "lucide-react";
import { Suspense, useActionState, useState } from "react";
import { TbCrown } from "react-icons/tb";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
  const { data: user } = useSWR<User>("/api/user", fetcher);
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
  const { data: userData } = useSWR<any>("/api/user", fetcher);

  return (
    <Card className="mb-8">
      <CardHeader className="pt-6">
        <CardTitle>Your Subscription</CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium">
                Current Plan: {userData?.planName || "Free"}
              </p>
              <p className="text-sm text-muted-foreground">
                {(() => {
                  const status = userData?.subscriptionStatus;
                  if (status === "active") return "Billed monthly";
                  if (status === "trialing") return "Trial period";
                  return "No active subscription";
                })()}
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
