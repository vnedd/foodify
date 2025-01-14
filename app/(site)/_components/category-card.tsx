import Image from "@/components/common/image";
import { Category } from "@prisma/client";
import React from "react";
import * as motion from "motion/react-client";
import Link from "next/link";
interface Props {
  category: Category;
}

const CategoryCard = ({ category }: Props) => {
  return (
    <Link href={`/recipes?category=${category.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.8, once: true }}
        className="aspect-5/6 relative cursor-pointer group overflow-hidden rounded-lg w-full h-full"
      >
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover rounded-lg group-hover:brightness-75 w-full h-full"
        />
        <div className="absolute bottom-2 left-2 bg-black/40 px-2 py-1">
          <p className="text-white text-sm">{category.name}</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
