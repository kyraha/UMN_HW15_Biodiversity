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
    var sample = samples.filter(sample => sample.id == sample_id)[0];
    if(sample != undefined) {
        zipped = sample.otu_ids.map(function(e, i) {
            return {
                otu_id: e,
                otu_value: sample.sample_values[i],
                otu_label: sample.otu_labels[i]
            };
        });
        zipped = zipped
            .sort((a,b) => b.otu_value - a.otu_value)
            .slice(0,10)
            .sort((a,b) => a.otu_value - b.otu_value)
        return zipped;
    }
    return undefined;
};

function init_plot() {
    var top10 = get10("940");
    var trace1 = {
        x: top10.map(e => e.otu_value),
        y: top10.map(e => `OTU ${e.otu_id}`),
        text: top10.map(e => e.otu_label),
        name: "Subject 940",
        type: "bar",
        orientation: 'h'
      };
      
      var data = [trace1];
      
      var layout = {
        // title: "Sample values",
        xaxis: { title: "Sample values"}
      };
      
      // Plot the chart to a div tag with id "plot"
      Plotly.newPlot("bar", data, layout);
      
};

function init_bubles() {
    var sample = samples[0];
    var trace1 = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: "markers",
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids
        }
    };
    var layout = {
        title: `Test results for subject 940`,
        xaxis: { title: "Sample values"}
    };
    Plotly.newPlot("bubble", [trace1], layout);
}

function init_metadata(subject_id) {
    var subject = metadata.filter(sample => sample.id == subject_id)[0];
    var div = d3.select("#sample-metadata");
    div.text("");

    // var tbody = div.append("table").append("tbody");
    var data = Object.entries(subject);

    div.selectAll("p")
        .data(data)
        .enter()
        .append("p")
        .text(md => md.join(": "));
};

function optionChanged(subject_id) {
    init_metadata(subject_id);

    data = get10(subject_id);
    var update = {
        x: [data.map(e => e.otu_value)],
        y: [data.map(e => `OTU ${e.otu_id}`)]
    };
    Plotly.restyle("bar", update);

    var sample = samples.filter(sample => sample.id == subject_id)[0];
    var bubbles = {
        x: [sample.otu_ids],
        y: [sample.sample_values],
        text: [sample.otu_labels],
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids
        }
    };
    Plotly.restyle("bubble", bubbles);
    Plotly.relayout("bubble", {title: `Test results for ${subject_id}`});
};

d3.json("samples.json").then(jsonData => {
    names = jsonData.names;
    metadata = jsonData.metadata;
    samples = jsonData.samples;

    d3.select("#selDataset")
        .selectAll("option")
        .data(samples)
        .enter()
        .append("option")
        .attr("value", d => d.id)
        .text(d => d.id);

    init_plot();
    init_bubles();
    init_metadata("940");
});
