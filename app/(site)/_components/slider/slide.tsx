import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SlideData } from "./slider";
import Link from "next/link";

export interface SlideProps {
  data: SlideData;
  direction: number;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export function Slide({ data, direction }: SlideProps) {
  return (
    <motion.div
      className="grid lg:grid-cols-2 grid-cols-1 gap-8 items-center absolute w-full"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <motion.h1
            className="text-6xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {data.title}
          </motion.h1>
        </div>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {data.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href={data.path}>
            <Button variant="default">Explore now!</Button>
          </Link>
        </motion.div>
      </div>
      <motion.div
        className="relative aspect-square rounded-full overflow-hidden "
        initial={{ scale: 0.6, opacity: 0, x: 200 }}
        animate={{ scale: 1.2, opacity: 1, x: 0, y: -15 }}
        transition={{ delay: 0.3 }}
      >
        <Image
          src={data.image}
          alt="Slide image"
          fill
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
