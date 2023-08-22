import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { supabaseClient } from "@/utils/supabase-client";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { extractTitlesAndSources } from "@/lib/utils";

/* Simple gpt powered Q/A */
// export async function POST(req: NextRequest, res: NextResponse) {
//   try {
//     const body = await req.json();
//     const { question } = body;

//     const formattedPrompt = await prompt.format({
//       question,
//     });

//     const llm = new OpenAI({
//       temperature: 0.6,
//     });

//     const result = await llm.predict(formattedPrompt);
//     return NextResponse.json({ answer: result }, { status: 200 });
//   } catch (e: any) {
//     console.error("Error processing question:", e);
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

const prompt = PromptTemplate.fromTemplate(
  `You are an AI assistant with expertise in the amputee and prosthetic industry. You have been given amputee related blog posts as context. Use that context to provide relevant answers to questions. Do NOT make up a link that is not listed below.

  If you can't find the answer in the context below and it is not related to amputees, just say "I'm sorry but I'm not configured to answer that question". Don't try to make up an answer.

  Question: {question}
  =========
  {context}
  =========
  Answer with well formatted markdown:
  `
);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { question } = body;

    const model = new OpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      streaming: true,
    });

    // Create vector store
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        client: supabaseClient,
        tableName: "documents",
        queryName: "match_documents",
      }
    );
    // // Initialize a retriever wrapper around the vector store
    const vectorStoreRetriever = vectorStore.asRetriever();

    const chain = new RetrievalQAChain({
      combineDocumentsChain: loadQAStuffChain(model, { prompt }),
      retriever: vectorStoreRetriever,
      returnSourceDocuments: true,
    });
    const result = await chain.call({
      query: question,
    });
    const sources =
      result.sourceDocuments.length > 0
        ? extractTitlesAndSources(result.sourceDocuments)
        : [];
    console.log(result.sourceDocuments);
    // const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);
    // const result = await chain.call({ query: formattedPrompt });

    // const result = await vectorStore.similaritySearch(formattedPrompt);
    return NextResponse.json({ answer: result.text, sources }, { status: 200 });
  } catch (e: any) {
    console.error("Error processing question:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
