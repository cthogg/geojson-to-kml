import { z } from "zod";

export type Placemark = {
  name: string;
  description: string;
  styleUrl: string;
  Point: {
    coordinates: string;
  };
  fullName: string | undefined;
  wiki: {
    summary: string;
    url: string | undefined;
  };
};

export const WikiLinksJsonSchema = z.object({
  summary: z.string(),
  url: z.string().optional(),
});

export const WikiLinksJson = z.record(WikiLinksJsonSchema);
