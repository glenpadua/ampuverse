import { amputeeStoreUrls } from "@/config/url-list";

import { supabaseClient } from "@/utils/supabase-client";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { Document } from "langchain/document";

export const amputeeStoreBlogLoader = async (url: string) => {
  const loader = new CheerioWebBaseLoader(url, {
    selector: "div.article-content",
  });
  const $ = await loader.scrape();

  // Extract metadata
  const title = $("h1.article__title").text().trim();
  const datePublished = $("time").first().text().trim();
  const dateUpdated = $("time").last().text().trim();

  // Remove unwanted elements
  $(
    ".article__tags, .social-share-snippet, style, script, ul#box-anchors"
  ).remove();

  const cleanedContent = $(".rte.article-content").text().trim();
  const contentLength = cleanedContent.length;

  const metadata = {
    source: loader.webPath,
    title,
    datePublished,
    dateUpdated,
    contentLength,
  };

  return [new Document({ pageContent: cleanedContent, metadata })];
};

const urls = amputeeStoreUrls;

export const run = async () => {
  try {
    const rawDocs = [];
    for (const url of urls) {
      const documents = await amputeeStoreBlogLoader(url);
      rawDocs.push(...documents);
    }

    // console.log(rawDocs);

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log("split docs", docs);

    // Create and store the embeddings in the vector store
    console.log("creating vector store...");
    const embeddings = new OpenAIEmbeddings();

    await SupabaseVectorStore.fromDocuments(docs, embeddings, {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    });
  } catch (e) {
    console.log("error", e);
    throw new Error("Failed to ingest your data");
  }
};

(async () => {
  await run();
  console.log("ingestion complete");
})();
