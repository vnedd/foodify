import React, { Suspense } from "react";
import { ProfileForm } from "./_components/profile-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
  <div className="space-y-4">
    <Skeleton className="w-full h-28" />
    <Skeleton className="w-full h-28" />
    <Skeleton className="w-full h-28" />
  </div>
);

const ProfilePage = () => {
  return (
    <Card className="max-w-5xl w-full mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-bold">Your Profile</h1>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Loading />}>
          <ProfileForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
