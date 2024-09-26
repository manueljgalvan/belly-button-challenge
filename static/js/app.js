const dataUrl = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to display metadata panel
function displayMetadata(sampleId) {
  d3.json(dataUrl).then((data) => {

    // Extract the metadata section from the data
    const meta = data.metadata;

    // Filter the metadata for the matching sample id
    const filteredMetadata = meta.filter(item => item.id == sampleId);
    const selectedSample = filteredMetadata[0];

    // Select the panel with id `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");

    // Clear the panel contents
    metadataPanel.html("");
    
    // Loop through each key-value pair in the selected sample metadata
    Object.entries(selectedSample).forEach(([key, value]) => {
      metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}
  
// Function to generate the charts
function generateCharts(sampleId) {
  d3.json(dataUrl).then((data) => {

    // Retrieve the samples array from the data
    const sampleData = data.samples;

    // Filter the sample data for the given sample id
    const filteredSamples = sampleData.filter(item => item.id == sampleId);
    const sampleDetails = filteredSamples[0];

    // Extract the necessary fields for the charts
    const otuIds = sampleDetails.otu_ids;
    const otuLabels = sampleDetails.otu_labels;
    const sampleValues = sampleDetails.sample_values;

    // Bubble chart configuration
    const bubbleChart = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    }];
    const bubbleLayout = {
      title: { 
        text: "Bacteria Cultures Per Sample",
        x: 0.05 // Align title to the left
      },
      margin: { t: 30, l: 60 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Bacteria Count" },
      autosize: true, // Responsive sizing
      font: { family: "Arial" } // Changed font
    };
    // Render the Bubble chart
    Plotly.newPlot("bubble", bubbleChart, bubbleLayout);

    // Bar chart configuration for top 10 OTUs
    const yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const barChart = [{
      y: yticks,
      x: sampleValues.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    const barLayout = {
      title: {
        text: "Top 10 Bacteria Cultures Found",
        x: 0.05 // Align title to the left
      },
      margin: { t: 30, l: 60 },
      xaxis: { 
        title: "Bacteria Quantity", // Changed title for x-axis
        automargin: true,
        tickfont: { family: 'Arial' } // Changed font for ticks
      },
      yaxis: { automargin: true },
      font: { family: 'Arial' } // Changed font style
    };
    // Render the Bar chart
    Plotly.newPlot("bar", barChart, barLayout);
  });
}

// Function to initialize the dashboard
function initializeDashboard() {
  const dropdown = d3.select("#selDataset");
  d3.json(dataUrl).then((data) => {

    // Populate dropdown with sample names
    const sampleNames = data.names;
    sampleNames.forEach((sample) => {
      dropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Load the first sample on the list
    const initialSample = sampleNames[0];
    generateCharts(initialSample);
    displayMetadata(initialSample);
  });
}
    
// Function to update the dashboard when a new sample is selected
function handleSampleChange(newSample) {
  generateCharts(newSample);
  displayMetadata(newSample);
}

// Initialize the dashboard on page load
initializeDashboard();
