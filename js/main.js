let option;

// bmw
if ($('#bmw-sample').length) {
    var bmwSample = document.getElementById('bmw-sample');
    bmwSample.style.height = '380px';
    bmwSample.style.width = '100%';

    var bmwInstance = echarts.init(bmwSample);
    var awardeeData;

    fetch("./../data/awardeeFunding.json")
    .then(response => {
        return response.json();
    }).then((data) => {
        let funding = [],
            awardees = [],
            applicants = [],
            years = [];

        data.forEach((e) => {
            awardees.push(e.awardees);
            applicants.push(e.applicants);
            years.push(e.fiscalYear);
        });

        years = years.reverse();

        option = {
            legend: {
                data: ['Awardees', 'Applicants'],
                top: 0,
                textStyle: {
                    fontFamily: 'menlo, sans-serif',
                    fontSize: 12
                }
            },
            xAxis:{
                axisTick: {show: false},
                data: years,
                name: 'Fiscal Years',
                nameLocation: 'middle',
                nameTextStyle: {
                    padding: [15, 0, 0, 0],
                    fontFamily: 'menlo, sans-serif',
                    fontSize: 12
                }
            },
            grid: {
                top: 50
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Count',
                    axisLabel: {
                        formatter: (value) => {
                            var suffixes = ["", "k", "m", "b","t"];
                            var suffixNum = Math.floor((""+value).length/3);
                            var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
                            if (shortValue % 1 != 0) {
                                shortValue = shortValue.toFixed(1);
                            }
                            return shortValue+suffixes[suffixNum];
                        }
                    },
                    nameLocation: 'middle',
                    nameTextStyle: {
                        padding: [0, 0, 25, 0],
                        fontFamily: 'menlo, sans-serif',
                        fontSize: 12
                    }
                }
            ],
            series: [
                {
                    name: 'Awardees',
                    type: 'bar',
                    data: awardees,
                    color: '#254D32'
                },
                {
                    name: 'Applicants',
                    type: 'bar',
                    data: applicants,
                    color: '#69B578'
                }
            ]
        }

        bmwInstance.setOption(option);

        // filters
        if ($('.bmw-dropdown-data')) {
            const dropdown = $('.bmw-dropdown-data');
            let startYear = years[0];
            let endYear = years[20];
            let yearsFiltered = years;

            years.forEach((e) => {
                dropdown.append($('<button></button>').attr('class', 'dropdown-item').text(e));
            });

            $('#bmw-start-dropdown-data button').on('click', (e) => {
                startYear = parseInt(e.currentTarget.innerText);

                yearsFiltered = years.filter(year => year <= endYear && year >= startYear);

                if (startYear <= endYear) {
                    option.xAxis.data = yearsFiltered;
                    bmwInstance.clear();
                    bmwInstance.setOption(option);
                }

                $('#bmwStartDrop')[0].innerText = startYear;

                $('#bmw-end-dropdown-data')[0].childNodes.forEach((e) => {
                    if (parseInt(e.innerText) < startYear) {
                        e.classList.add('disabled');
                    } else {
                        e.classList.remove('disabled');
                    }
                });
                
                if (startYear !== years[0]) {
                    $('#bmwStartDrop')[0].classList.add('filtered-data');
                } else {
                    $('#bmwStartDrop')[0].classList.remove('filtered-data');
                }
            });

            $('#bmw-end-dropdown-data button').on('click', (e) => {
                endYear = parseInt(e.currentTarget.innerText);

                yearsFiltered = years.filter(year => year <= endYear && year >= startYear);

                if (startYear <= endYear) {
                    option.xAxis.data = yearsFiltered;
                    bmwInstance.clear();
                    bmwInstance.setOption(option);
                }

                $('#bmwEndDrop')[0].innerText = endYear;

                $('#bmw-start-dropdown-data')[0].childNodes.forEach((e) => {
                    if (parseInt(e.innerText) > endYear) {
                        e.classList.add('disabled');
                    } else {
                        e.classList.remove('disabled');
                    }
                });

                if (endYear !== years[20]) {
                    $('#bmwEndDrop')[0].classList.add('filtered-data');
                } else {
                    $('#bmwEndDrop')[0].classList.remove('filtered-data');
                }
            });
        }

        // table build
        if ($('#bmwTable')) {
            let bmwTable = $('#bmwTable');
            let bmwBody = $('#bmwTable tbody');
            let tr;
            let rows = [];

            bmwTable.prepend(`<thead><th>Fiscal Year</th><th>Applicants, n</th><th>Awardees, n</th></thead>`);
    
            data.forEach((e) => {
                tr = `<tr><td data-label="Fiscal Year">${e.fiscalYear}</td><td data-label="Applicants">${e.applicants}</td><td data-label="Awardees">${e.awardees}</td></tr>`;
                rows.push(tr);
            });
            bmwBody.append(rows);
        }
    });

    var disconnectLineGraph = document.getElementById('disconnectedLineGraph');
    var heightLineGraph = '380px';
    var widthLineGraph = '32%'
    var displayLineGraph = 'inline-block';

    if (window.innerWidth < 768) {
        widthLineGraph = '100%'
    }

    disconnectLineGraph.style.height = heightLineGraph;
    disconnectLineGraph.style.width = widthLineGraph;
    disconnectLineGraph.style.display = displayLineGraph;

    var disconnectLineInstance = echarts.init(disconnectLineGraph);

    option = {
        legend: {
            data: ['Black, Green, Red, Orange']
        },
        title: {
            text: 'With Gaps',
            textAlign: 'center',
            left: '120',
            textStyle: {
                fontFamily: 'menlo, sans-serif',
                fontSize: 16
            }
        },
        grid: {
            left: 50
        },
        xAxis: {type: 'category'},
        yAxis: {},
        series: [
            {
                name: 'Black',
                type: 'line',
                color: '#000',
                lineStyle: {
                    width: 3
                },
                data: [0, 120, 50, undefined, 100, 90, 230, 210]
            }
        ]
    }

    disconnectLineInstance.setOption(option);


    var autoConnectGraph = document.getElementById('autoConnectedLineGraph');
    autoConnectGraph.style.height = heightLineGraph;
    autoConnectGraph.style.width = widthLineGraph;
    autoConnectGraph.style.display = displayLineGraph;

    var autoConnectInstance = echarts.init(autoConnectGraph);

    option.series = [
        {
            name: 'Black',
            type: 'line',
            connectNulls: true,
            color: '#000',
            lineStyle: {
                width: 3
            },
            data: [0, 120, 50, undefined, 100, 90, 230, 210]
        }
    ]

    option.title.text = "Connected Nulls"

    autoConnectInstance.setOption(option);

    var solutionLineGraph = document.getElementById('solutionLineGraph');
    solutionLineGraph.style.height = heightLineGraph;
    solutionLineGraph.style.width = widthLineGraph;
    solutionLineGraph.style.display = displayLineGraph;

    solutionLineInstance = echarts.init(solutionLineGraph);

    option.series = [
        {
            name: 'Black',
            type: 'line',
            color: '#aaa',
            connectNulls: true,
            lineStyle: {
                width: 2,
                type: 'dashed'
            },
            data: [0, 120, 50, undefined, 100, 90, 230, 210]
        },
        {
            name: 'Black',
            type: 'line',
            color: '#000',
            lineStyle: {
                width: 3
            },
            data: [0, 120, 50, undefined, 100, 90, 230, 210]
        }
    ]

    option.title.text = "My Solution"

    solutionLineInstance.setOption(option);

    window.onresize = () => {
        // bmwSample.style.width = '100%';
        if (window.innerWidth < 768) {
            widthLineGraph = '100%'
            heightLineGraph = '250px';
        } else {
            widthLineGraph = '32%';
        }

        disconnectLineGraph.style.height = heightLineGraph;
        autoConnectGraph.style.height = heightLineGraph;
        solutionLineGraph.style.height = heightLineGraph;

        disconnectLineGraph.style.width = widthLineGraph;
        autoConnectGraph.style.width = widthLineGraph;
        solutionLineGraph.style.width = widthLineGraph;

        disconnectLineInstance.resize();
        autoConnectInstance.resize();
        solutionLineInstance.resize();
        bmwInstance.resize();
    }
}

if ($('#bmwFlipper').on('click', (e) => {
    if (e.currentTarget.parentNode.childNodes[1].childNodes[1].classList.value.includes('flipped')) {
        e.currentTarget.parentNode.childNodes[1].childNodes[1].classList.remove('flipped')
    } else {
        e.currentTarget.parentNode.childNodes[1].childNodes[1].classList.add('flipped')
    }
    
}));

// scroll to top
if ($('#backToTop')) {
    $('#backToTop').on('click', () => {
        $("html, body").animate({scrollTop: 0}, 600);
    });
}