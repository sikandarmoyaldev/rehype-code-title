import { visit } from "unist-util-visit";
import type {
    Root,
    Element
} from "hast";

import {
    extractTitle,
    createTitleElement
} from "./helper";


/**
 * rehype-code-title: A rehype plugin to extract titles from code blocks
 * and insert them as a `<div>` element before the `<pre>` element.
 */
export default function rehypeCodeTitle() {
    return (tree: Root) => {
        // Track processed nodes to prevent infinite loops
        const preNodes: Set<Element> = new Set();

        visit(tree, "element", (node, index, parent) => {
            // Ensure node is a <pre> element and not already processed
            if (!parent || node.tagName !== "pre" || preNodes.has(node)) return;

            // Find the <code> element inside the <pre>
            const codeNode = node.children.find(
                (child): child is Element =>
                    child && typeof child === "object" && "type" in child &&
                    child.type === "element" && child.tagName === "code"
            );

            // Extract the title from the <code> element's metadata (if available)
            const title = extractTitle(codeNode);

            // Skip processing if no title is found
            if (!title) return;

            // Mark this <pre> as processed
            preNodes.add(node);

            // Create the title element
            const titleElement = createTitleElement(title, "rehype-code-title");

            // Insert the title <div> *before* the <pre> element in the parent node's children array
            if (typeof index === "number" && parent) {
                parent.children.splice(index, 0, titleElement);
            }
        });
    };
}
