import React from "react";

const RecentView = async () => {
  return (
    <div className="space-y-4 w-full">
      <h3 className="font-semibold text-xl">Your recently viewed recipes</h3>
      <ul className="flex flex-wrap gap-2 w-full"></ul>
    </div>
  );
};

export default RecentView;
