
import hljs from "highlight.js"
import 'highlight.js/styles/default.css';

export default defineNuxtPlugin((nuxtApp) => {
    hljs.configure({
        languages: ["markdown"]
    })

    nuxtApp.vueApp.directive('highlight', {
        mounted (el) {
            hljs.highlightElement(el)
        }
    })

    return {
        provide: {
            // takes a target html element as input and updates its content
            // to be highlighted for markdown
            highlightContent: (element: HTMLElement): void => {
                if(element.textContent === null) return // nothing to do
                const selection = getSelection(element)

                let rawText = element.textContent

                // hack: append a new line if the cursor is at the last line
                // and the line is empty (resulting in the anchorNode being
                // the parent node)
                if (window.getSelection()?.anchorNode === element) {
                    rawText = rawText + "\n"
                }

                const highlightedContent = hljs.highlight(
                    rawText, { language: "md" }).value

                if(contentsMatch(element.innerHTML, highlightedContent))
                    return; // nothing to do

                element.innerHTML = highlightedContent

                restoreSelection(element, ...selection)
            }
        }
    }
})

// helper types

type TextSegment = {
    text: string | null,
    node: Node
}

// helper functions

// highlighted content returned from hljs has its single and double quotes escaped
function contentsMatch(existing: string, highlighted: string): boolean {
    return existing === highlighted.replaceAll("&#x27;", '\'').replaceAll("&quot;", '"')
}

function getSelection(targetElement: HTMLElement): [number, number] {
    const sel = window.getSelection();
    if (sel === null)
        return [0, 0]
    const textSegments = getTextSegments(targetElement);
    let anchorIndex = 0;
    let focusIndex = 0;
    let currentIndex = 0;
    textSegments.forEach(({text, node}) => {
        if (node === sel.anchorNode) {
            anchorIndex = currentIndex + sel.anchorOffset;
        }
        if (node === sel.focusNode) {
            focusIndex = currentIndex + sel.focusOffset;
        }
        if (text !== null) currentIndex += text.length;
    });

    // hack - when the last line gets deleted, the selection jumps
    // to the parent, and no matches are found among the text elements
    if(sel.anchorNode === targetElement ||
        sel.focusNode === targetElement) {
        return [ currentIndex, currentIndex ]
    }
    return [ anchorIndex, focusIndex ]
}

function restoreSelection(
        targetElement: HTMLElement,
        absoluteAnchorIndex: number,
        absoluteFocusIndex: number) {
    const sel = window.getSelection();
    if(sel === null) return; // cannot restore selection if window has no context
    const textSegments = getTextSegments(targetElement);
    let anchorNode = targetElement;
    let anchorIndex = 0;
    let focusNode = targetElement;
    let focusIndex = 0;
    let currentIndex = 0;
    textSegments.forEach(({text, node}) => {
        const startIndexOfNode = currentIndex;
        const endIndexOfNode = startIndexOfNode + (text !== null ? text.length : 0);
        if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
            anchorNode = node as HTMLElement;
            anchorIndex = absoluteAnchorIndex - startIndexOfNode;
        }
        if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
            focusNode = node as HTMLElement;
            focusIndex = absoluteFocusIndex - startIndexOfNode;
        }
        if(text !== null) currentIndex += text.length;
    });
    sel.setBaseAndExtent(anchorNode, anchorIndex, focusNode, focusIndex);
}

function getTextSegments(element: HTMLElement): TextSegment[] {
    const textSegments: TextSegment[] = [];
    Array.from(element.childNodes).forEach((node) => {
        switch(node.nodeType) {
            case Node.TEXT_NODE:
                textSegments.push({text: node.nodeValue, node});
                break;

            case Node.ELEMENT_NODE:
                textSegments.splice(
                    textSegments.length, 0,
                    ...(getTextSegments(node as HTMLElement)));
                break;

            default:
                throw new Error(`Unexpected node type: ${node.nodeType}`);
        }
    });
    return textSegments;
}
