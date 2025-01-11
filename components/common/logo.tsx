import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"} className="block w-40 h-14 relative">
      <Image src={"/logo.svg"} className="w-20 h-10" fill alt="Recipify logo" />
    </Link>
  );
};

export default Logo;
