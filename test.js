// this function use npm package name 'floyd-warshall' to valid our solution
const FloydWarshall = require('floyd-warshall');

function TestFloydWarshall(data) {
  const self = this;
  this.solution = new FloydWarshall(data.adjMatrix);

  this.test = (result) => {
    console.log('Calculate a distance matrix with the shortest path from one node to another', self.solution.shortestPaths);

    if (result) {
      console.log('Match our result: ', JSON.stringify(self.solution.shortestPaths) === JSON.stringify(result));
    }
  }

};

module.exports = TestFloydWarshall