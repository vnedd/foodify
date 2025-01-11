"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slide } from "./slide";

export interface SlideData {
  id: number;
  title: string;
  description: string;
  image: string;
  path: string;
}

export const slides: SlideData[] = [
  {
    id: 1,
    title: "Share your Recipe",
    description:
      "Share your unique and delicious recipes with others. Inspire creativity and discover new cooking ideas.",
    image: "/banner-01.png",
    path: "/profile/recipe/add",
  },
  {
    id: 2,
    title: "Random Food",
    description:
      "Discover a variety of random food ideas and explore new dishes to try for any occasion.",
    image: "/banner-02.png",
    path: "/random",
  },
  {
    id: 3,
    title: "Learn to Cook Now",
    description:
      "Start your cooking journey today with easy-to-follow recipes and tips for beginners and experts alike.",
    image: "/banner-03.png",
    path: "/recipes",
  },
];

export default function Slider() {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < slides.length) {
      setPage([newPage, newDirection]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 overflow-hidden">
      <div className="relative h-[500px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <Slide key={page} data={slides[page]} direction={direction} />
        </AnimatePresence>
        <div className="absolute bg-muted/80 w-full h-full rounded-full left-1/2" />
        <div className="absolute bottom-0 left-0 flex gap-2 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => paginate(-1)}
            disabled={page === 0}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => paginate(1)}
            disabled={page === slides.length - 1}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
