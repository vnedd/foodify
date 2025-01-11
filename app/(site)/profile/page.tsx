import React, { Suspense } from "react";
import { ProfileForm } from "./_components/profile-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProfilePage = () => {
  return (
    <Card className="max-w-5xl w-full mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-bold">Your Profile</h1>
      </CardHeader>
      <CardContent>
        <Suspense fallback="loading....">
          <ProfileForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
