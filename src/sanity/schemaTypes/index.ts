import type { SchemaTypeDefinition } from "sanity";

import { siteSettings } from "./siteSettings";
import { programItem } from "./programItem";
import { sponsor } from "./sponsor";
import { pastEdition } from "./pastEdition";
import { regulation } from "./regulation";
import { howToArrive } from "./howToArrive";
import { homeContent } from "./homeContent";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettings,
    homeContent,
    programItem,
    sponsor,
    pastEdition,
    regulation,
    howToArrive,
  ],
};
