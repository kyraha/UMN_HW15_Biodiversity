/*
samples -- array of objects:
{
  id: "940"
  ​otu_ids: Array(80) [ 1167, 2859, 482, … ]
  ​otu_labels: Array(80) [ "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Peptoniphilus", "Bacteria", … ]
  ​sample_values: Array(80) [ 163, 126, 113, … ]
}
*/

var samples = [];

function get10(sample_id) {
    var sample = undefined;
    for(var i = 0; i < samples.length; i++) {
        if(samples[i].id == sample_id) {
            sample = samples[i];
            break;
        }
    }

    if(sample != undefined) {
        zipped = sample.otu_ids.map(function(e, i) {
            return {
                otu_id: e,
                otu_value: sample.sample_values[i]
            };
        });
        zipped = zipped
            .sort((a,b) => b.otu_value - a.otu_value)
            .slice(0,10)
            .sort((a,b) => a.otu_value - b.otu_value)
        return zipped;
    }
}

function init_plot() {
    var top10 = get10("940");
    var trace1 = {
        x: top10.map(e => e.otu_value),
        y: top10.map(e => `OTU ${e.otu_id}`),
        name: "Sample values",
        type: "bar",
        orientation: 'h'
      };
      
      var data = [trace1];
      
      var layout = {
        title: "Sample values"
        // yaxis: { title: "Sample values"}
      };
      
      // Plot the chart to a div tag with id "plot"
      Plotly.newPlot("bar", data, layout);
      
}

d3.json("samples.json").then(jsonData => {
    names = jsonData.names;
    metadata = jsonData.metadata;
    samples = jsonData.samples;
    // console.log(names);
    // console.log(metadata);

    d3.select("#selDataset")
        .selectAll("option")
        .data(samples)
        .enter()
        .append("option")
        .attr("value", d => d.id)
        .text(d => d.id);

    init_plot();
})

function optionChanged(subject_id) {
    data = get10(subject_id);
    console.log("Updating with", data);
    var update = {
        x: [data.map(e => e.otu_value)],
        y: [data.map(e => `OTU ${e.otu_id}`)]
    };
    Plotly.restyle("bar", update);
}
