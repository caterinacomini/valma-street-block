import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    title,
    editionNumber,
    tagline,
    heroImage,
    eventDate,
    rainDate,
    location,
    intro,
    registrationUrl,
    registrationOpen,
    registrationLabel,
    registrationClosedLabel,
    instagramUrl,
    facebookUrl,
    contactEmail
  }
`);

export const programItemsQuery = defineQuery(`
  *[_type == "programItem"] | order(order asc, time asc){
    _id,
    title,
    time,
    endTime,
    description,
    location,
    category
  }
`);

export const sponsorsQuery = defineQuery(`
  *[_type == "sponsor"] | order(tier asc, order asc){
    _id,
    name,
    logo,
    url,
    tier
  }
`);

export const pastEditionsQuery = defineQuery(`
  *[_type == "pastEdition"] | order(year desc){
    _id,
    year,
    editionNumber,
    coverImage,
    gallery,
    highlights,
    participantsCount
  }
`);

export const regulationQuery = defineQuery(`
  *[_type == "regulation"][0]{
    title,
    faq[]{
      title,
      items[]{ question, answer }
    },
    "pdfUrl": pdfFile.asset->url,
    updatedAt
  }
`);

export const howToArriveQuery = defineQuery(`
  *[_type == "howToArrive"][0]{
    intro,
    address,
    carInfo,
    publicTransportInfo,
    mapEmbedUrl
  }
`);

export const mapPointsQuery = defineQuery(`
  *[_type == "mapPoint"] | order(order asc){
    _id,
    label,
    type,
    description,
    x,
    y
  }
`);
