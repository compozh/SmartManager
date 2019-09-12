/**searchs through all arrays of the tree if the for a value from a property
 * @param aTree : the tree array
 * @param fCompair : This function will receive each node. It's upon you to define which 
                     condition is necessary for the match. It must return true if the condition is matched. Example:
                        function(oNode){ if(oNode["Name"] === "AA") return true; }
 * @param bGreedy? : us true to do not stop after the first match, default is false
 * @return an array with references to the nodes for which fCompair was true; In case no node was found an empty array
 *         will be returned
*/
export default function treeSearch(aTree, fCompair, bGreedy) {
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
    } else { // if (node.children && node.children.length) {
      // find other objects, 1. check all properties of the node if they are arrays
      for (let keysNode in oNode) {
        // true if the property is an array
        if (oNode[keysNode] instanceof Array) {
          // 2. push all array object to aInnerTree to search in those later
          for (let i = 0; i < oNode[keysNode].length; i++) {
            aInnerTree.push({ oNode: oNode[keysNode][i], index: i });
          }
        }
      }
    }
  }
  return aReturnNodes; // someone was greedy
}