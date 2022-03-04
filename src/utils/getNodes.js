function nextNode(node) {
  if (node.hasChildNodes()) {
    return node.firstChild;
  }
  while (node && !node.nextSibling) {
    node = node.parentNode;
  }
  if (!node) {
    return null;
  }
  return node.nextSibling;
}

function getRangeSelectedNodes(range) {
  let node = range.startContainer;
  const endNode = range.endContainer;

  // Special case for a range that is contained within a single node
  if (node == endNode) {
    return [node];
  }

  // Iterate nodes until we hit the end container
  const rangeNodes = [];
  while (node && node != endNode) {
    rangeNodes.push(node = nextNode(node));
  }

  // Add partially selected nodes at the start of the range
  node = range.startContainer;
  while (node && node != range.commonAncestorContainer) {
    rangeNodes.unshift(node);
    node = node.parentNode;
  }

  return rangeNodes;
}

function getSelectedNodes() {
  if (window.getSelection) {
    const sel = window.getSelection();
    if (!sel.isCollapsed) {
      return getRangeSelectedNodes(sel.getRangeAt(0));
    }
  }
  return [];
}

export default getSelectedNodes;
