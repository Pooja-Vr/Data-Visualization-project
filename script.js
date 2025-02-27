document.addEventListener('DOMContentLoaded', function() {
    // ===== fetch the dump.csv file form Data folder =========
    fetch('Data/dump.csv')
        .then(response => response.text())
        .then(csvData => {
            console.log('CSV Data fetched:', csvData); // Debugging line
            const parsedData = Papa.parse(csvData, { header: true }).data;
            console.log('Parsed Data:', parsedData); // Debugging line 
            

            // ============== add some filters ==============
            const indexNames = [...new Set(parsedData.map(row => row.index_name.replace('Nifty', '').trim()))]
                .filter(name => !name.includes('50') && !name.includes('100') && !name.includes('200'));
            console.log('Filtered Index Names:', indexNames); 
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
