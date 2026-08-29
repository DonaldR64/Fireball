const groupAndSortAdjacent = () => {

  const visited = new Set();
  const groups = [];
  const keys = Object.keys(Elements);


  // 1. Helper to find neighbors
  const getNeighbors = (current) => {
    return keys.filter(key => {
        if (key === current) return false;
        let d = Elements[key].Distance(Elements[current]);
        return d < 2;
    });
  };

  // 2. Traverse the map to find connected clusters
  for (const key of keys) {
    const label = Element[key].hexLabel;
    if (visited.has(label)) continue;

    const group = [];
    const queue = [key];
    visited.add(label);

    while (queue.length > 0) {
      const current = queue.shift();
      group.push(current);

      for (const neighbor of getNeighbors(current)) {
        const nKey = Elements[neighbor].hexLabel;
        if (!visited.has(nKey)) {
          visited.add(nKey);
          queue.push(neighbor);
        }
      }
    }
  }

  // 4. Sort the final groups by their starting element
  return groups; //will be groups of keys / ids
}