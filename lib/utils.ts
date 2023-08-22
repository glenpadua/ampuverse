import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Document = {
  pageContent: string;
  metadata: {
    loc: object;
    title: string;
    source: string;
    dateUpdated: string;
    contentLength: number;
    datePublished: string;
  };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractTitlesAndSources(
  docs: Document[]
): { title: string; link: string }[] {
  // Use a Set to avoid duplicates.
  const seen = new Set<string>();

  // Filter out duplicates and map to desired structure.
  return docs
    .filter((doc) => {
      const identifier = `${doc.metadata.title}-${doc.metadata.source}`;
      if (!seen.has(identifier)) {
        seen.add(identifier);
        return true;
      }
      return false;
    })
    .map((doc) => ({
      title: doc.metadata.title,
      link: doc.metadata.source,
    }));
}
