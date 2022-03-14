const data = require('./data.json');
const TestFloydWarshall = require('./test');
const MyFloydWarshall = require('./my-floyd-warshall');

const tester = new TestFloydWarshall(data);
const solution = new MyFloydWarshall(data);

// testing with public package
console.log('Running test case with npm package:');
tester.test(solution.shortestPath());

// running sample
console.log('Running sample with input data reading from `data.json`:');
solution.shortestPath();
console.log('b -> d');
solution.getPath('a', 'c');
