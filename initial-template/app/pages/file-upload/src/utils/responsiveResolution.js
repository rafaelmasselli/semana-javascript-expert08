export default function typeResolution(width, height) {
  if (width == 320 && height == 240) {
    return "144p";
  } else if (width == 640 && height == 480) {
    return "480p";
  } else if (width == 1280 && height == 720) {
    return "720p";
  }
}
