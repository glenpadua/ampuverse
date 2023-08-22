import { Document } from "langchain/document";

import { readFile } from "fs/promises";
import { BaseDocumentLoader } from "langchain/document_loaders/base";

export class WhatsAppChatLoader extends BaseDocumentLoader {
  constructor(public filePath: string) {
    super();
  }

  // Helper function to combine message information in a readable format.
  private concatenateRows(date: string, sender: string, text: string): string {
    return `${sender} on ${date}: ${text}\n\n`;
  }

  public async load(): Promise<Document[]> {
    // Read the file content as a string
    const content: string = await readFile(this.filePath, "utf8");

    // Regular expression pattern to match WhatsApp chat messages
    const messageLineRegex: RegExp = new RegExp(
      "\\[?" +
        "(\\d{1,4}[\\/.]\\d{1,2}[\\/.]\\d{1,4},\\s\\d{1,2}:\\d{2}(?::\\d{2})?(?:[\\s_](?:AM|PM))?)" +
        "\\]?[\\s-]*" +
        "([~\\w\\s]+)" +
        "[:]+\\s" +
        "(.+)",
      "gi"
    );

    // Lines that should be ignored from the WhatsApp chat
    const ignoreLines: string[] = [
      "This message was deleted",
      "<Media omitted>",
    ];
    let textContent: string = "";

    // Splitting the content into lines
    const lines = content.split("\n");

    // Iterating over each line and matching against the regex
    for (const line of lines) {
      const result: RegExpExecArray | null = messageLineRegex.exec(line.trim());
      if (result) {
        const date: string = result[1];
        const sender: string = result[2];
        const text: string = result[3];
        if (!ignoreLines.includes(text)) {
          textContent += this.concatenateRows(date, sender, text);
        }
      }
    }

    const metadata: { source: string } = { source: this.filePath };

    // Return the processed chat content as a Document
    return [new Document({ pageContent: textContent, metadata })];
  }
}
