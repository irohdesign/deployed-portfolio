let option;

if ($('#bmw-sample')) {
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
                top: 0
            },
            xAxis:{
                axisTick: {show: false},
                data: years,
                name: 'Fiscal Years',
                nameLocation: 'middle',
                nameTextStyle: {
                    padding: [15, 0, 0, 0]
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
                        padding: [0, 0, 25, 0]
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
            let tr;
            let rows = [];
    
            data.forEach((e) => {
                tr = `<tr><td data-label="Fiscal Year">${e.fiscalYear}</td><td data-label="Applicants">${e.applicants}</td><td data-label="Awardees">${e.awardees}</td></tr>`;
                rows.push(tr);
            });

            bmwTable.append(`<tr><thead><th>Fiscal Year</th><th>Applicants, n</th><th>Awardees, n</th></thead></tr>`);
            bmwTable.append(rows);
        }
    });

    window.onresize = () => bmwInstance.resize();
}


if ($('#bmwFlipper').on('click', (e) => {
    if (e.currentTarget.parentNode.childNodes[1].childNodes[1].classList.value.includes('flipped')) {
        e.currentTarget.parentNode.childNodes[1].childNodes[1].classList.remove('flipped')
    } else {
        e.currentTarget.parentNode.childNodes[1].childNodes[1].classList.add('flipped')
    }
    
}));