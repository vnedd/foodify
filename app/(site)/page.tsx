import React, { Suspense } from "react";
import Categories from "./_components/categories";
import CardSkeletons from "@/components/common/card-skeletons";
import Hero from "./_components/hero";
import Cuisines from "./_components/cuisines";
import { Skeleton } from "@/components/ui/skeleton";
import RecentView from "./_components/recent-view";
import AboutUs from "./_components/about-us";

const PlatformPage = () => {
  return (
    <div className=" max-w-6xl mx-auto w-full flex flex-col items-center gap-8">
      <Hero />
      <Suspense fallback={<CardSkeletons />}>
        <Categories />
      </Suspense>
      <Suspense
        fallback={
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-4 w-20 rounded-3xl" />
            <Skeleton className="h-4 w-20 rounded-3xl" />
            <Skeleton className="h-4 w-20 rounded-3xl" />
            <Skeleton className="h-4 w-20 rounded-3xl" />
          </div>
        }
      >
        <Cuisines />
      </Suspense>
      <Suspense fallback={<CardSkeletons />}>
        <RecentView />
      </Suspense>
      <AboutUs />
    </div>
  );
};

export default PlatformPage;
