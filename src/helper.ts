import { Element } from "hast";

  
/** Creates a title element */
export function createTitleElement(
    title: string,
    className = "rehype-code-title"
): Element {
    return {
        type: "element",
        tagName: "div",
        properties: { className: [className] },
        children: [{ type: "text", value: title }],
    };
}

/** Extracts the title from the `meta` attribute of a code element */
export function extractTitle(
    codeNode?: Element
): string | undefined {
    const meta = (codeNode?.data as { meta?: string })?.meta?.trim();
    if (!meta) return;
  
    const titleMatch = meta.match(/title="([^"]+)"/);
    return titleMatch ? titleMatch[1] : undefined;
  }
