import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { BiSearch } from "react-icons/bi";
const AppSearch = () => {
  return (
    <section className="w-full">
      <div className="flex items-center gap-4 max-w-md mx-auto relative">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search by recipe or ingredients"
            className="pr-11"
          />
        </div>
        <Button className="absolute right-0" size="icon">
          <BiSearch />
        </Button>
      </div>
    </section>
  );
};

export default AppSearch;
