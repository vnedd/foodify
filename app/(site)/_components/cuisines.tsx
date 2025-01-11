import { getCuisines } from "@/app/_actions/cuisines";
import React from "react";

const Cuisines = async () => {
  const cuisines = await getCuisines();

  return (
    <div className="space-y-4 w-full">
      <h3 className="font-semibold text-xl">Cuisines</h3>
      <ul className="flex flex-wrap gap-2 w-full">
        {cuisines.map((item) => (
          <li
            key={item.id}
            className="bg-secondary dark:bg-gray-50/10 shadow-sm rounded-3xl px-3 py-1.5 text-sm font-medium cursor-pointer select-none"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cuisines;
