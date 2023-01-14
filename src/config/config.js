import Compress from "compress.js";

const compress = new Compress();

export function getUrl() {
  return process.env.NODE_ENV === "production"
    ? "https://doctolink-v2.herokuapp.com"
    : "http://localhost:5000";
}

export async function compressImage(file) {
  const res = await compress.compress([file], {
    size: 0.5, // the max size in MB, defaults to 2MB
    quality: 0.8, // the quality of the image, max is 1,
    maxWidth: 150, // the max width of the output image, defaults to 1920px
    maxHeight: 150, // the max height of the output image, defaults to 1920px
    resize: true, // defaults to true, set false if you do not want to resize the image width and height
  });
  return `data:image/webp;base64,${res[0].data}`;
}
