import type { SchemaTypeDefinition } from "sanity";

import { siteSettings } from "./siteSettings";
import { programItem } from "./programItem";
import { sponsor } from "./sponsor";
import { pastEdition } from "./pastEdition";
import { regulation } from "./regulation";
import { mapPoint, howToArrive } from "./mapPoint";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettings,
    programItem,
    sponsor,
    pastEdition,
    regulation,
    howToArrive,
    mapPoint,
  ],
};
