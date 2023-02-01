import { getStrapiURL } from "./api"

export function getStrapiMedia(media) {
  const mediaUrl = media.data.attributes;
  const imageUrl = getStrapiURL(mediaUrl.url);
  return imageUrl
}
