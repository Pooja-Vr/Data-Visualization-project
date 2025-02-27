# Data Visualization Project

This project visualizes stock data from a CSV file using PapaParse and Chart.js. The data is displayed yearly-wise for selected indices.

## Project Structure

```
Data-Visualization-project/
│
├── Data/
│   └── dump.csv
├── index.html
├── script.js
└── README.md
```

## Prerequisites

- A web browser (Chrome, Firefox, etc.)
- Internet connection to load external libraries (PapaParse and Chart.js)

## Setup

1. **Clone the repository**:
    ```sh
    git clone <repository-url>
    cd Data-Visualization-project
    ```

2. **Ensure the CSV file is in the correct location**:
    - The `dump.csv` file should be placed inside the `Data` directory.

3. **Open the `index.html` file**:
    - Open the `index.html` file in your web browser to view the data visualization.

## File Descriptions

### index.html

This file contains the HTML structure of the project. It includes the necessary scripts for PapaParse and Chart.js.

```html
<!-- filepath: /C:/Users/dell/OneDrive/Desktop/Data-pro/Data-Visualization-project/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Visualization Project</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <ul class="list-group"></ul>
        <canvas id="stock-chart"></canvas>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### script.js

This file contains the JavaScript code to fetch, parse, and visualize the data from the CSV file.

```javascript
// filepath: /C:/Users/dell/OneDrive/Desktop/Data-pro/Data-Visualization-project/script.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('Data/dump.csv')
        .then(response => response.text())
        .then(csvData => {
            console.log('CSV Data fetched:', csvData); // Debugging line
            const parsedData = Papa.parse(csvData, { header: true }).data;
            console.log('Parsed Data:', parsedData); // Debugging line
            const indexNames = [...new Set(parsedData.map(row => row.index_name.replace('Nifty', '').trim()))]
                .filter(name => !name.includes('50') && !name.includes('100') && !name.includes('200'));
            console.log('Filtered Index Names:', indexNames); // Debugging line
            const listGroup = document.querySelector('.list-group');
            listGroup.innerHTML = ''; // Clear existing list items

            indexNames.forEach((indexName, idx) => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.setAttribute('data-index', indexName);
                listItem.textContent = indexName;
                listGroup.appendChild(listItem);
            });

            document.querySelectorAll('.list-group-item').forEach(item => {
                item.addEventListener('click', function() {
                    document.querySelectorAll('.list-group-item').forEach(li => {
                        li.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    const indexName = this.getAttribute('data-index');
                    fetchData(indexName);
                });
            });
        });
});

function fetchData(indexName) {
    fetch('Data/dump.csv')
        .then(response => response.text())
        .then(csvData => {
            console.log('CSV Data fetched for fetchData:', csvData); // Debugging line
            const parsedData = Papa.parse(csvData, { header: true }).data;
            const filteredData = parsedData.filter(row => row.index_name.replace('Nifty', '').trim() === indexName);
            console.log('Filtered Data for', indexName, ':', filteredData); // Debugging line
            
            // Group data by year
            const yearlyData = filteredData.reduce((acc, row) => {
                const year = new Date(row.index_date).getFullYear();
                if (!acc[year]) acc[year] = [];
                acc[year].push(row);
                return acc;
            }, {});

            // Prepare data for chart
            const labels = Object.keys(yearlyData);
            const values = labels.map(year => {
                const yearData = yearlyData[year];
                return yearData.reduce((sum, row) => sum + parseFloat(row.closing_index_value), 0) / yearData.length;
            });

            updateStockChart(labels, values);
        });
}

function updateStockChart(labels, values) {
    console.log('Updating chart with labels:', labels, 'and values:', values); // Debugging line
    const ctx = document.getElementById('stock-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line', // Change to the chart type you need
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Data',
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Average Closing Value'
                    }
                }
            }
        }
    });
}
```

### Data/dump.csv

This file contains the stock data to be visualized. Ensure it is correctly formatted and placed inside the `Data` directory.

## Usage

1. Open `index.html` in your web browser.
2. Click on any index name from the list to view its yearly data on the chart.

## Troubleshooting

- **Data not loading**: Check the console for errors and ensure the CSV file path is correct.
- **Chart not updating**: Ensure the `fetchData` function is correctly filtering and processing the data.

## License

This project is licensed under the MIT License.

