/**
 * This class the reimplement of the floyd-warshall algorithm
 * construct with given adjacent matrix and the out put is the shortest path from one node to another
 * also print the path from one node to another
 */
function MyFloydWarshall(data) {
  const self = this;
  this.adjMatrix = data.adjMatrix;
  this.vertices = data.vertices;
  this.edges = data.edges;

  // checking input
  if (!Array.isArray(self.adjMatrix) || self.adjMatrix.length === 0) {
    throw new Error('Adjacent matrix cannot empty');
  }

  if (self.adjMatrix.filter(o => o.length !== self.adjMatrix[0].length).length !== 0) {
    throw new Error('Adjacent matrix must be a 2D array with same length.');
  }

  // main logic
  this.result = [self.adjMatrix];
  this.nodes = self.adjMatrix[0].length;

  this.shortestPath = function() {
    let i,j,k;

    for (k=0; k < self.nodes; k++) {
      const it = JSON.parse(JSON.stringify(self.result[k])); // make a tmp array from previous loop
      for (i=0; i < self.nodes; i++) { // loop inside the tmp array to update new distance value
        for (j=0; j < self.nodes; j++) {
          it[i][j] = Math.min(it[i][j], it[i][k] + it[k][j]);
        }
      }
      this.result.push([...it]); // push tmp to result array
    }

    // checking if exists a circuit of negative length
    const result = this.result[self.nodes];
    for (k=0; k < self.nodes; k++) {
      if (result[k][k] < 0) {
        throw new Error('Exists a circuit of negative length.');
      }
    }

    return result;
  };


  // return the cost
  this.getShortestPathCost = (src, dest, k) => {
    const res = self.result[k][src][dest];

    if (res === Number.MAX_SAFE_INTEGER) {
      return 'Cannot find path';
    }

    // print the shortest path value
    console.log('Shortest path is: ', res);
    return (res / 0.095).toFixed(3); // convert to meter
  }


  // get path from source -> destination
  this.getPath = function(src, dest, it, drawPath) {
    const i = parseInt(src);
    const j = parseInt(dest);
    const k = parseInt(it);

    // base case
    if (k === 0) {
      return drawPath(i, j);
    }

    // recursive case
    if (self.result[k-1][i][j] <= self.result[k][i][j]) { // nothing change
      return self.getPath(i, j, k-1, drawPath);
    }

    if (self.result[k-1][i][j] > self.result[k][i][j]) { // distance was updated in this step
      self.getPath(i, k-1, k-1, drawPath);
      self.getPath(k-1, j, k-1, drawPath);
      return;
    }
  };
}