import React, { Suspense } from "react";
import CuisinesClient from "./_components/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { getCuisines } from "@/app/_actions/cuisines";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
const Cuisines = async () => {
  const cuisines = await getCuisines();
  return (
    <Card className="flex flex-col space-y-3">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Cuisines</h3>
          <Link href={"/cuisines/add"}>
            <Button size="sm">
              <IoMdAdd className="w-5 h-5" />
              Add new
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback="loading...">
          <CuisinesClient data={cuisines} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Cuisines;
