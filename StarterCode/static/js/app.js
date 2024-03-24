// initialize the dashboard
function dashboard() {

    // using the D3 to create a dropdown
    let dropdown = d3.select("#selDataset");

    // using D3 to read JSON from URL
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        
        // setting names from url 
        let names = data.names;

        names.forEach((id) => {

            console.log(id);

            dropdown.append("option")
            .text(id)
            .property("value",id);
        });

        let name_one = names[0];

        //logging the result of the first index
        console.log(name_one);

        //making the charts based on the first index result 
        buildCharts(name_one);
        Demographics(name_one);

    });
};

// builing a function to create a bar chart that displays the top 10 OTUs found in that individual based on drop down menu response

function buildCharts(sample) {
    // getting JSON data from url
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
        
        // setting variables based on JSON resu;ts 
        var samples = data.samples;
        var metadata = data.metadata;

        var sampleData = samples.find(sampleData => sampleData.id === sample);
        // selecting the top ten samples values, IDs and labels 
        var top10_samples = sampleData.sample_values.slice(0, 10).reverse();
        var top10_otu_ids = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        var top10_otu_labels = sampleData.otu_labels.slice(0, 10).reverse();

        var barGraph = {
            x: top10_samples,
            y: top10_otu_ids,
            text: top10_otu_labels,
            type: "bar",
            orientation: "h"
        };
        // adding the labels for the bar chart 
        var barSettings = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Values" }
        };

        // using Plotly to graph results 
        Plotly.newPlot("bar", [barGraph], barSettings);

        //creating bubble graph based on response
        // setting variables to make bubble graph 
        var bubbleGraph = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Viridis"
            }
        };

        var bubbleSettings = {
            title: "OTU IDs vs Sample Values",
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bubble", [bubbleGraph], bubbleSettings);

    })
    .catch(function(error) {
        console.log("Error fetching data:", error);
    });
}

// creaying a function  to display demographics info
function Demographics(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
        // setting  metadata
        var metadata = data.metadata;
        // getting metadata for selected ID
        var sampleMetadata = metadata.filter(result => result.id == sample);
        console.log(sampleMetadata)
        // adding the metadata if found
        var demographicsDisplay = d3.select("#sample-metadata");
        demographicsDisplay.html("");
        if (sampleMetadata.length > 0) { // Check if metadata is found
            // Since filter returns an array, we need to iterate over it
            sampleMetadata.forEach((metadataObj) => {
                Object.entries(metadataObj).forEach(([key, value]) => {
                    demographicsDisplay.append("p").text(`${key}: ${value}`);
                });
            });
        } else {
            demographicsDisplay.append("p").text("No metadata found for this sample.");
        }
    })
    .catch(function(error) {
        console.log("Error fetching data:", error);
    });
}
// creating to update charts and metadata
function optionChanged(sampleId) {
    buildCharts(sampleId);
    Demographics(sampleId);
}

dashboard();