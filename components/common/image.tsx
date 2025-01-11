"use client";
import { IKImage } from "imagekitio-next";
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Image = (props: any) => {
  return <IKImage urlEndpoint={urlEndpoint} alt={props.alt || ""} {...props} />;
};

export default Image;
