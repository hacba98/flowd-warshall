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

    // console.log('test', this.result);
    return result;
  };


  // get path from source -> destination
  this.getPath = function(src, dest) {

    if (this.result.length === 1) { // hasn't calculate the shortest paths
      self.shortestPath();
    }

    // convert index of src & dest from name
    src = self.vertices.indexOf(src);
    dest = self.vertices.indexOf(dest);

    if (src === -1 || dest === -1) {
      throw new Error('Cannot find given vertice.');
    }

    // print the shortest path value
    console.log('Shortest path is: ', self.result[self.nodes][src][dest]);

    // print the path
    getPath(src, dest, self.nodes);

    // sub function to return path from i->j in k'th interation
    function getPath(i, j, k) {

      // base case
      if (k === 0) {
        return console.log(self.vertices[i], '->', self.vertices[j]);
      }

      // recursive case
      if (self.result[k-1][i][j] <= self.result[k][i][j]) { // nothing change
        return getPath(i, j, k-1);
      }

      if (self.result[k-1][i][j] > self.result[k][i][j]) { // distance was updated in this step
        getPath(i, k-1, k-1);
        getPath(k-1, j, k-1);
        return;
      }
    }
  };
}

module.exports = MyFloydWarshall;