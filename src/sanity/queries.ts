import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    title,
    editionNumber,
    heroImage,
    eventDate,
    rainDate,
    postponed,
    postponedNote,
    location,
    intro,
    registrationUrl,
    registrationOpen,
    registrationLabel,
    registrationClosedLabel,
    instagramUrl,
    facebookUrl,
    contactEmail,
    photoCredit,
    sections[]{ section, visible },
    showSponsors
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
    category,
    image
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

export const homeContentQuery = defineQuery(`
  *[_type == "homeContent"][0]{
    introHeading,
    introText,
    claim,
    claimText,
    introPhotos,
    stats[]{ value, label },
    closingHeading,
    closingText,
    closingImage
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
