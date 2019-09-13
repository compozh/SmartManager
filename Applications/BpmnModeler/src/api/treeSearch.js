/**searchs through all arrays of the tree if the for a value from a property
 * @param aTree : the tree array
 * @param fCompair : This function will receive each node. It's upon you to define which 
                     condition is necessary for the match. It must return true if the condition is matched. Example:
                        function(oNode){ if(oNode["Name"] === "AA") return true; }
 * @param fItems? = selector for items property
 * @param bGreedy? : us true to do not stop after the first match, default is false
 * @return an array with references to the nodes for which fCompair was true; In case no node was found an empty array
 *         will be returned
*/
export default function treeSearch(aTree, fCompair, fItems, bGreedy) {
  if (!fItems) {
    fItems = node => node.items;
  }
  let aInnerTree = []; // will contain the inner children
  //let oNode; // always the current node
  let aReturnNodes = []; // the nodes array which will returned

  // 1. loop through all root nodes so we don't touch the tree structure
  for (let i = 0; i < aTree.length; i++) {
    aInnerTree.push({ oNode: aTree[i], index: i });
  }
  while (aInnerTree.length > 0) {
    let { oNode, index } = aInnerTree.pop();
    // check current node
    if (fCompair(oNode, index)) {
      aReturnNodes.push({ item: oNode, index });
      if (!bGreedy) {
        return aReturnNodes;
      }
    } else {
      const items = fItems(oNode);
      if (!items) {
        continue;
      }
      for (let i = 0; i < items.length; i++) {
        aInnerTree.push({ oNode: items[i], index: i });
      }
    }
  }
  return aReturnNodes; // someone was greedy
}