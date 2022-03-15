// Initialize the echarts instance based on the prepared dom
var data = {};
const myChart = echarts.init(document.getElementById('main'));

$('document').ready(() => {
  loadData().then(data => {
    // Display the chart using the configuration items and data just specified.
    drawChart(data);
    $('#it').val(data.vertices.length);
  });


  // on submit event
  $('#findPath').submit(e => {
    e.preventDefault();
    const src = $('#source').val();
    const target = $('#target').val();
    const k = $('#it').val();

    if (!src || !target) {
      return alert('Please select a source and target node');
    }

    // find solution
    const solution = new MyFloydWarshall(data);
    solution.shortestPath();
    $('#cost').text(`Shortest path cost is: ${solution.getShortestPathCost(src, target, k)} (m)`); // display result
    loadData().then(data => {
      solution.getPath(src, target, k, drawPath);
      drawChart(data); // redraw chart
    });

    function drawPath(a, b) {
      data.edges.forEach((o,i) => {
        if (o.source == a && o.target == b) {
          data.edges[i] = {...o, lineStyle: { color: 'rgb(0,255,0)', width: 3, curveness: 0.2 }};
        }
      });
    }
  })
});


async function loadData() {
  return new Promise(resolve => {
    $.getJSON('../maps-1.json', (d) => {
      // generate adjacent matrix
      generateAdjMatrix(d);

      // format edges data for rendering
      data.edges = d.edges.map(e => {
        return {
          ...e,
          source: e.source,
          target: e.target,
          label: {
            show: true,
            formatter: () => e.name,
          },
          lineStyle: {
            curveness: 0.1
          }
        };
      });

      // format vertices for rendering
      data.vertices = d.vertices.map(v => {
        return {
          ...v,
          y: -v.y,
          label: {
            show: true,
            formmater: () => v.name,
          },
        };
      });

      data.adjMatrix = d.adjMatrix;
      resolve(data);
    });
  });
};

function generateAdjMatrix(data) {
  const nNodes = data.vertices.length;
  // init empty 2D-array data
  data.adjMatrix = new Array(nNodes);
  for (let i=0; i < nNodes; i++) {
    data.adjMatrix[i] = new Array(nNodes).fill(Number.MAX_SAFE_INTEGER);
    data.adjMatrix[i][i] = 0; // start = source -> cost = 0
  }

  // loop through edges information to construct data
  data.edges.forEach(e => {
    data.adjMatrix[e.source][e.target] = e.cost;
  });
};


function drawChart(data) {
  // Specify the configuration items and data for the chart
  const options = {
    title: {
      text: 'Demo Graph'
    },
    tooltip: {
      formatter: (params) => {
        if (params.data.id) {
          return `Node ID: ${params.data.id}<br>Name: ${params.data.name}`;
        } else {
          return `Path: ${params.data.name}<br> Cost: ${params.data.cost}`;
        }
      },
    },
    animationDurationUpdate: 500,
    animationEasingUpdate: 'quinticInOut',
    series: [{
      type: 'graph',
      layout: 'none',
      symbolSize: 50,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20
      },
      data: data.vertices,
      links: data.edges,
    }],
  };


  // Display the chart using the configuration items and data just specified.
  myChart.setOption(options);
};