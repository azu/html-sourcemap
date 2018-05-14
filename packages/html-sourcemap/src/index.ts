const unified = require("unified");
const remarkParse = require("remark-parse");
const remark = unified().use(remarkParse);
const rehype = require('rehype');
const vfile = require('to-vfile');
const he = require('he');
const visit = require('unist-util-visit-parents');
// const NeologdNormalizer = require("neologd-normalizer").default;
const processor = rehype()
    .data('settings', { fragment: true });
type Markdown_NODE = {
    type: string,
    value?: string;
    children: [HTML_NODE],
    position: object
}
type HTML_NODE = {
    type: string,
    tagName: string,
    properties: object,
    children: [HTML_NODE],
    value: string;
    position: object
}
const normalizeHTMLText = (text: string): string => {
    return he.decode(text).replace(/\s+/, " ").trim();
};
const normalizeSourceText = (text: string): string => {
    return text.replace(/\s+/, " ").trim();
};
const isSKip = (node: any) => {
    return !node.value || node.value.length === 0 || node.value === "{{book.console}}";
};
const mapAST = (renderedAST: any, sourceAST: any) => {
    let currentIndex = 0;
    const sourceNodes: Markdown_NODE[] = [];
    visit(sourceAST, (node: Markdown_NODE) => {
        if (!isSKip(node)) {
            sourceNodes.push(node);
        }
    });
    const renderedTextNodes: HTML_NODE[] = [];
    const renderedNodeMap = new Map();
    visit(renderedAST, (node: HTML_NODE, parents: HTML_NODE[]) => {
        if (node.type !== "text") {
            return;
        }
        // FIXME: pre code is often transformed from source to rendered html with custom preprocess.
        // For example, Syntax Highlighting create very fragments of texts.
        // It cause false-positive
        const isPreCode = parents.some((node) => {
            return node.tagName === "pre";
        });
        if (isPreCode) {
            return;
        }
        renderedTextNodes.push(node);
        renderedNodeMap.set(node, parents);
    });

    function findIndex(allNodes: Markdown_NODE[], startIndex: number, targetNode: HTML_NODE) {
        if (!targetNode) {
            return -1;
        }
        const nodes = allNodes.slice(startIndex);
        const matchIndex = nodes.findIndex((node) => {
            if (!node.value || !targetNode.value) {
                return false;
            }
            const htmlText = normalizeHTMLText(node.value);
            const sourceText = normalizeSourceText(targetNode.value);
            // console.log("INPUT: " + htmlText);
            // console.log("<->");
            // console.log("OUTPUT:" + sourceText);
            // console.log("Result: " + (htmlText === sourceText));
            return htmlText === sourceText;
        });
        if (matchIndex === -1) {
            return -1;
        }
        return startIndex + matchIndex
    }

    renderedTextNodes.forEach((textNode, textNodeIndex) => {
        const nextTextNode = renderedTextNodes[textNodeIndex + 1];
        const matchSourceNodeIndex = findIndex(sourceNodes, currentIndex, textNode);
        // avoid to false-positive found text
        // Found "TEXT", but the text is not near position.
        const nextSourceNodeIndex = findIndex(sourceNodes, currentIndex, nextTextNode);
        // Is this false-positive found result? far result from current
        if (nextSourceNodeIndex !== -1 && Math.abs(nextSourceNodeIndex - matchSourceNodeIndex) > 10) {
            console.log("This match result is false-positive, because next text node found near than current text node", textNode);
            return;
        } else if (Math.abs(currentIndex - matchSourceNodeIndex) > 100) {
            console.log("This match result is false-positive, because the match index is far from current index", textNode);
            return;
        }
        console.log("matchSourceNodeIndex", currentIndex);
        console.log("nextSourceNodeIndex", nextSourceNodeIndex);
        if (matchSourceNodeIndex === -1) {
            return;
        }
        const matchSourceNode = sourceNodes[matchSourceNodeIndex];
        const parents = renderedNodeMap.get(textNode);
        if (!parents) {
            return;
        }
        const renderedTextWrapperNode = parents[parents.length - 1];
        const indexOfTextNode = renderedTextWrapperNode.children.indexOf(textNode);
        renderedTextWrapperNode.children[indexOfTextNode] = {
            type: 'element',
            tagName: 'span',
            properties: {
                "data-position": JSON.stringify(matchSourceNode.position)
            },
            children: [textNode],
        };
        currentIndex = matchSourceNodeIndex;
    });
};


export const embedPositionToHTML = (htmlString: string, markdownString: string) => {
    const HTML_AST = processor.parse(vfile({ contents: htmlString }));
    const Markdown_AST = remark.parse(vfile({ contents: markdownString }));
    mapAST(HTML_AST, Markdown_AST);
    return String(rehype.stringify(HTML_AST));
};
