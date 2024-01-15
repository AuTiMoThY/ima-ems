const { ref, watch, onMounted, onUnmounted } = Vue;
export function useQueryData(createBaseData, data) {
    const queryData = () => {
        const baseDataArr = [];
        // if (data.member_level.value == 0) {
        //     baseDataArr.push({ ...createBaseData(), server: "db2.ima-ems.com" });
        //     baseDataArr.push({ ...createBaseData(), server: "db4.ima-ems.com" });
        // } else if (data.member_level.value == 1) {
        //     baseDataArr.push({ ...createBaseData() });
        // }
        baseDataArr.push({ ...createBaseData() });
        return baseDataArr;
    };

    return { queryData };
}

// 計時器
export function useTimer(initialTime, countdownIntervalId) {

    const next_update = ref(initialTime);
    const runTimer = () => {

        if (countdownIntervalId) {
            clearInterval(countdownIntervalId);
        }
        // 幾秒後更新的訊息
        next_update.value = initialTime;
        countdownIntervalId = setInterval(() => {
            next_update.value--;
        }, 1000);
    }

    return { next_update, runTimer };
}

// 自動請求
export function useAutoRefresh(querySubmit, interval) {
    const autoRefreshEnabled = ref(false);
    let apiIntervalId = ref(null);

    imaemsUI.log(autoRefreshEnabled.value);
    watch(autoRefreshEnabled, (isEnabled) => {
        if (apiIntervalId.value) {
            clearInterval(apiIntervalId.value);
        }

        if (isEnabled) {
            apiIntervalId.value = setInterval(() => {
                imaemsUI.log("auto refresh");
                querySubmit();
            }, interval);
        }
    });

    const toggleAutoRefresh = () => {
        autoRefreshEnabled.value = !autoRefreshEnabled.value;
    };

    return {
        autoRefreshEnabled,
        toggleAutoRefresh
    };
}

const generateInitChartOptions = (chartType, chartOtherData) => {
    let options;
    switch (chartType) {
        case 'line':
            options = {
                dataset: { source: [] },
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                textStyle: {
                    color: '#fff'
                },
                grid: {
                    // width: '90%',
                    left: '100px',
                    right: '100px'
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100

                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                ],
                xAxis: {
                    type: 'category'
                },

                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        showSymbol: false,
                        // splitLine: {
                        //     lineStyle: {
                        //         color: 'rgba(128, 128, 128, 0.5)'
                        //     }
                        // },
                    }
                ],
                series: [
                    {
                        type: 'line',
                        // areaStyle: {},
                        // itemStyle: {
                        //     color: 'rgba(3, 13, 38, 0.8)'
                        // },
                    }
                ]
            };
            break;
        case 'heatmap':
            options = {
                textStyle: {
                    color: '#fff'
                },
                tooltip: {
                    position: 'top',
                },
                grid: {
                    // width: '80%',
                    // height: '70%',
                    top: '60px',
                    left: '200px',
                    right: '50px',
                    borderColor: '#fff'
                },
                xAxis: {
                    type: 'category',
                    data: chartOtherData.hours,
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    // data: days,
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
                        }
                    },
                    nameTextStyle: {
                        align: 'left',
                    }
                },
                visualMap: {
                    // type: 'piecewise',
                    splitNumber: 10,
                    min: 0,
                    max: 10,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    top: '0',
                    textStyle: {
                        color: '#fff'
                    },
                    inRange: {
                        color: [
                            "#33B400",
                            "#66B400",
                            "#99B400",
                            "#EBE100",
                            "#FFE100",
                            "#FFCC00",
                            "#FF9900",
                            "#FF6600",
                            "#FF3300",
                            "#FF0000"
                        ]
                    },
                    outOfRange: {
                        color: ["#fff"]
                    }
                },
                series: [
                    {
                        type: 'heatmap',
                        name: '用量',
                        // data: data,
                        label: {
                            normal: {
                                show: true,
                                formatter: function (params) {
                                    // params.value[2] 是熱力圖的數據值
                                    let fontSize = '10'; // 預設字體大小
                                    let value = params.value[2];

                                    // 根據值的大小動態調整字體大小
                                    if (value > 10) {
                                        fontSize = '6';
                                    }

                                    // 返回帶有字體大小樣式的字串
                                    return `{a|${value}}`;
                                },
                                rich: {
                                    fontSize: {
                                        // 由於 fontSize 在這裡是一個屬性名，你需要在上面的返回字串中指定具體的大小
                                        // 這裡需要一個預設值，或者你可以基於條件動態生成整個 rich 物件
                                        fontSize: 10
                                    }
                                }
                            }
                        },
                        emphasis: {
                            // label: {
                            //     show: true,
                            //     formatter: function (param) {
                            //         imaemsUI.log(param);
                            //         return param;
                            //     }
                            // },
                            itemStyle: {
                                borderColor: '#333',
                                borderWidth: 2,
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        itemStyle: {
                            borderColor: '#fff'
                        }
                    }
                ]
            };
            break;
        case 'multi-line':

            options = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [],
                    textStyle: {
                        color: '#fff'
                    },
                    itemGap: 20
                },
                grid: {
                    left: '150px',
                    right: '100px'
                },
                textStyle: {
                    color: '#fff'
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100

                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                ],
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        // splitLine: {
                        //     lineStyle: {
                        //         color: 'rgba(255, 255, 255, 0.5)'
                        //     }
                        // },
                    }
                ],
                series: []
            };
            break;
        case 'scatter':
            options = {
                // dataset: [
                //     {
                //         id: 'dataset_raw',
                //         source: []
                //     }
                // ],
                grid: {
                    left: '150px',
                    right: '150px'
                },
                // tooltip: {
                //     trigger: 'axis'
                // },
                textStyle: {
                    color: '#fff'
                },
                // dataZoom: [
                //     {
                //         show: true,
                //         realtime: true,
                //         start: 0,
                //         end: 10

                //     },
                //     {
                //         type: 'inside',
                //         realtime: true,
                //         start: 0,
                //         end: 10
                //     }
                // ],
                xAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                series: [
                    {
                        type: 'scatter'
                    }
                ]
            };
            break;
        default:
            console.warn('Unsupported chart type');
            return;
    }

    return options;
}

// 圖表
export function useECharts(chartId, chartType, chartOtherData) {
    const chartInstance = ref(null);
    const chartHeight = ref('500');
    let options;

    onMounted(() => {
        try {
            imaemsUI.log("init chart");
            const chart = echarts.init(document.getElementById(chartId));
            chart.setOption(generateInitChartOptions(chartType, chartOtherData));
            chartInstance.value = chart;
        } catch (error) {
            console.error("Error initializing chart:", error);
        }

    });

    const drawChart = (data) => {
        if (!chartInstance.value) return;
        imaemsUI.log("drawChart");
        imaemsUI.log('Drawing chart with data:', data);

        const container = document.getElementById(chartId);
        let chart, drawOptions, headers, seriesCount, series;
        const colors = ['#0ADEFF', '#FF6680', '#38F567', '#FFF82B', '#FF9A3B'];
        // let multiLineData = {xAxisData, seriesData, legendData};

        switch (chartType) {
            case 'line':
                chart = echarts.getInstanceByDom(container);
                drawOptions = {
                    dataset: { source: data.value },
                    // Make gradient line here
                    visualMap: [
                        {
                            show: false,
                            type: 'continuous',
                            min: data.min,
                            max: data.max,
                            // inRange: {
                            //     color: [
                            //         "#33B400",
                            //         "#66B400",
                            //         "#99B400",
                            //         "#EBE100",
                            //         "#FFE100",
                            //         "#FFCC00",
                            //         "#FF9900",
                            //         "#FF6600",
                            //         "#FF3300",
                            //         "#FF0000"
                            //     ]
                            // },
                        }
                    ],
                };
                break;
            case 'heatmap':
                const days = data.date.length;
                const spacing = 70;

                if (days < 5) {
                    chartHeight.value = (100 * days) + spacing;
                }
                else if (5 <= days && days < 10) {
                    chartHeight.value = (80 * days) + spacing;
                }
                else if (10 <= days && days < 21) {
                    chartHeight.value = (30 * days) + spacing;
                }
                else {
                    chartHeight.value = (20 * days) + spacing;
                }
                container.style.height = `${chartHeight.value}px`;

                chart = echarts.getInstanceByDom(container);

                drawOptions = {
                    xAxis: { data: data.hours },
                    yAxis: { data: data.date },
                    visualMap: {
                        min: data.min,
                        max: data.max,
                    },
                    series: [{ data: data.value }],
                };
                break;
            case 'multi-line':
                chart = echarts.getInstanceByDom(container);

                const parameterList = [...data.parameterList];


                /*
                // 不重複的參數
                const uniqueParameter = Array.from(new Set(parameterList)).find(param => parameterList.indexOf(param) === parameterList.lastIndexOf(param));
                imaemsUI.log(uniqueParameter)

                // 出現次數最多的參數
                const sortedParameterList = [...parameterList]; // 建立副本，以免影響到外面
                var mostFrequentParameter = parameterList.sort((a, b) =>
                    parameterList.filter(v => v === a).length
                    - parameterList.filter(v => v === b).length
                ).pop();
                */

                // ---
                // // 獲取所有不重複的參數
                // const uniqueParameters = Array.from(new Set(parameterList));
                // imaemsUI.log("uniqueParameters:", uniqueParameters);

                // 動態生成yAxis
                const yAxisArray = [];
                const yAxisMapping = {}; // 用於保存參數和yAxis索引的映射
                let yAxisIndex = 0;

                parameterList.forEach((param, index) => {
                    const color = colors[yAxisIndex];

                    yAxisArray.push({
                        type: 'value',
                        name: param,
                        nameTextStyle: {
                            color: colors[index]
                        },
                        nameRotate: 90,
                        nameLocation: 'center',
                        nameGap: 30,
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.2)'
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: color,
                                width: 2
                            }
                        },
                        axisTick: {
                            lineStyle: {
                                color: color,
                            }
                        },
                        axisLabel: {
                            rotate: 30,
                            color: color,
                        },
                        position: yAxisIndex === 0 ? 'left' : 'right',
                        offset: (yAxisIndex === 0 || yAxisIndex === 1) ? 0 : (yAxisIndex - 1) * 50,

                    });
                    yAxisMapping[param] = yAxisIndex;
                    yAxisIndex++;
                });

                // 對每個唯一參數的數據點進行分組
                const parameterDataPoints = {};

                data.dataArr.forEach((item, index) => {
                    const parameter = data.parameterList[index];
                    if (!parameterDataPoints[parameter]) {
                        parameterDataPoints[parameter] = [];
                    }
                    parameterDataPoints[parameter] = parameterDataPoints[parameter].concat(
                        item.map(item => parseFloat(item[1])).slice(1)
                    );
                });

                // 計算每個唯一參數的最大和最小值，並設置對應的 yAxis 的最大和最小值
                yAxisArray.forEach((yAxis, index) => {
                    imaemsUI.log("yAxis:", yAxis);
                    const parameter = parameterList[index];
                    const dataPoints = parameterDataPoints[parameter];
                    if (dataPoints && dataPoints.length > 0) {
                        const maxValue = Math.max(...dataPoints);
                        const minValue = Math.min(...dataPoints);
                        const yAxisMax = maxValue + (maxValue * 0.1);  // 增加 10% 作為上限
                        const yAxisMin = minValue - (minValue * 0.1);  // 減少 10% 作為下限
                        yAxisArray[index].max = Math.round(parseFloat(yAxisMax) * 100) / 100;
                        yAxisArray[index].min = Math.round(parseFloat(yAxisMin) * 100) / 100;

                        
                    }
                });
                /*
                const yAxisArray = uniqueParameters.map((param, index) => {
                    return {
                        type: 'value',
                        name: param,
                        id: index,
                        // axisLine: {
                        //     lineStyle: {
                        //         color: colors[index]  // 根據 colors 數組設置顏色
                        //     }
                        // },
                        splitLine: {
                            lineStyle: {
                                color: colors[index]
                            }
                        },
                        offset: index * 50,  // 調整每個 yAxis 的偏移量以避免名稱重疊
                        nameLocation: 'end',  // 將名稱放在 yAxis 的開始位置
                        nameTextStyle: {
                            color: colors[index]
                        }
                    };
                });
                */
                // ---

                imaemsUI.log("yAxisArray", yAxisArray);
                imaemsUI.log("yAxisIndex", yAxisIndex);
                /*
                // 找到所有線條的最大和最小值
                let allDataPoints = [];
                data.dataArr.forEach(item => {
                    allDataPoints = allDataPoints.concat(item.map(item => parseFloat(item[1])).slice(1));
                    // parseFloat(item[1]) 轉換為數字以確保正確的比較 
                    // slice(1) 跳過頭部
                });

                const maxValue = Math.max(...allDataPoints);
                const minValue = Math.min(...allDataPoints);

                imaemsUI.log(maxValue, minValue);

                // 根據最大和最小值設置 Y 軸範圍
                const yAxisMax = maxValue + (maxValue * 0.1);  // 增加 10% 作為上限
                const yAxisMin = minValue - (minValue * 0.1);  // 減少 10% 作為下限

                imaemsUI.log(yAxisMax, yAxisMin);

                // ---
                // 更新yAxis的最大和最小值
                yAxisArray.forEach(yAxis => {
                    yAxis.max = yAxisMax;
                    yAxis.min = yAxisMin;
                });
                // ---
                */

                const legendData = data.dataArr.map(item => item[0][1]);
                const xAxisData = data.dataArr[0].map(item => item[0].replace(' ', '\n')).slice(1); // Remove the header
                const gridRight = `${100 + (50 * yAxisIndex)}px`;
                const seriesArray = data.dataArr.map((item, index) => {
                    const parameter = data.parameterList[index];
                    return {
                        name: item[0][1],
                        type: 'line',
                        showSymbol: false,
                        itemStyle: {
                            color: colors[index],
                        },
                        yAxisIndex: yAxisMapping[parameter],
                        // yAxisIndex: uniqueParameters.indexOf(data.parameterList[index]), // 根據參數設置yAxisIndex
                        // yAxisIndex: data.parameterList[index] === uniqueParameter ? 1 : 0,
                        data: item.map(item => item[1]).slice(1) // Remove the header
                    };
                });

                drawOptions = {
                    legend: {
                        data: legendData,
                    },
                    grid: {
                        right: gridRight
                    },
                    xAxis: {
                        data: xAxisData
                    },
                    yAxis: yAxisArray,
                    series: seriesArray
                };
                break;
            case 'scatter':
                chart = echarts.getInstanceByDom(container);
                echarts.registerTransform(ecStat.transform.regression);

                const rawData = data.dataArr;
                const [data1, data2] = rawData;
                const names = rawData.map(data => data[0][1]);

                // 移除 header 部分
                data1.shift();
                data2.shift();

                // 轉換數據格式
                const scatterData = data1.map((entry1, index) => {
                    const entry2 = data2[index];
                    return {
                        value: [
                            parseFloat(entry1[1]),  // X 值
                            parseFloat(entry2[1])   // Y 值
                        ],
                        time: entry1[0]  // 時間
                    };
                }).filter(Boolean);
                // 轉換數據格式以適應 ecStat
                const ecStatData = scatterData.map(point => point.value);

                imaemsUI.log("scatterData: ", scatterData);

                // 提取所有的 X 值和 Y 值
                const allX = scatterData.map(point => point.value[0]);
                const allY = scatterData.map(point => point.value[1]);

                // 計算最大和最小值
                const maxX = Math.max(...allX);
                const minX = Math.min(...allX);
                const maxY = Math.max(...allY);
                const minY = Math.min(...allY);

                drawOptions = {
                    dataset: [
                        {
                            source: ecStatData
                        },
                        {
                            transform: {
                                type: 'ecStat:regression',
                                config: {
                                    method: 'exponential'
                                    // 'end' by default
                                    // formulaOn: 'start'
                                }
                            }
                        }
                    ],
                    xAxis: {
                        name: names[0],
                        min: minX,
                        max: maxX
                    },
                    yAxis: {
                        name: names[1],
                        min: minY,
                        max: maxY
                    },
                    tooltip: {
                        trigger: 'item',  // 觸發方式：數據項
                        formatter: function (params) {
                            // 自定義顯示格式
                            return `時間：${params.data.time}<br/>
                                    X：${params.data.value[0]}<br/>
                                    Y：${params.data.value[1]}`;
                        }
                    },
                    series: [{
                        type: 'scatter',
                        datasetIndex: 0,
                        data: scatterData,
                        symbolSize: 5,
                        itemStyle: {
                            color: colors[0]
                        }
                    }, {
                        name: 'line',
                        type: 'line',
                        smooth: true,
                        datasetIndex: 1,
                        symbolSize: 0.1,
                        symbol: 'circle',
                        label: { show: true, fontSize: 16 },
                        labelLayout: { dx: -20 },
                        encode: { label: 2, tooltip: 1 }
                    }]
                };
                break;
            case 'scatter_bak':
                chart = echarts.getInstanceByDom(container);

                /*
                headers = data.dataArr[0];

                // Remove the first element ('time') and get the length of the remaining array
                seriesCount = headers.slice(1).length;

                // Generate the 'series' array
                series = Array.from({ length: seriesCount }, () => ({
                    type: 'scatter'
                }));
                */

                const inputArray = data.dataArr;

                const resultArray = [];

                // Initialize the header row
                const headerRow = inputArray.map(subArray => subArray[0][1]);
                headerRow.unshift("time");
                resultArray.push(headerRow);

                const seriesCount = headerRow.slice(1).length;

                // Loop through each array to merge, starting from index 1 to skip the header
                for (let i = 1; i < inputArray[0].length; i++) {
                    const newRow = [];

                    for (let j = 0; j < inputArray.length; j++) {
                        newRow.push(inputArray[j][i][1]);
                    }

                    newRow.unshift(inputArray[0][i][0]);
                    resultArray.push(newRow);
                }
                // Generate the 'series' array
                series = Array.from({ length: seriesCount }, () => ({
                    type: 'scatter'
                }));

                console.log(resultArray);

                let maxVal = Number.NEGATIVE_INFINITY;
                let minVal = Number.POSITIVE_INFINITY;

                // Skip the header row by starting from index 1
                for (let i = 1; i < resultArray.length; i++) {
                    for (let j = 1; j < resultArray[i].length; j++) {
                        // Convert the value to a number
                        const num = parseFloat(resultArray[i][j]);

                        // Update max and min
                        if (num > maxVal) {
                            maxVal = num;
                        }
                        if (num < minVal) {
                            minVal = num;
                        }
                    }
                }

                console.log("Max Value:", maxVal);
                console.log("Min Value:", minVal);

                drawOptions = {
                    dataset: { source: resultArray },
                    series: series,
                    yAxis: [
                        {
                            max: maxVal,
                            min: minVal
                        }
                    ],
                };
                break;
            default:
                console.warn('Unsupported chart type');
                return;
        }


        chart.clear();
        chart.setOption(generateInitChartOptions(chartType, chartOtherData));
        chart.setOption(drawOptions);
        chart.resize();
        window.onresize = function () {
            chart.resize();
        };

        chartInstance.value = chart;

    };

    // onUnmounted(() => {
    //     if (chartInstance.value) {
    //         chartInstance.value.dispose();
    //     }
    //     window.onresize = null;
    // });

    return { chartInstance, drawChart, chartHeight };
}

/*
// 監控計量(type)變化，並更新設備列表(placeOptions)
export function useTypeWatcher(type, member_level, placeOptions, place_id, placeOptionsData) {
    watch(type, (newValue, oldValue) => {
        if (member_level.value == 0) {
            // 根據新的 type 值更新 placeOptions
            if (newValue) {
                if (placeOptionsData[newValue] && placeOptionsData[newValue].length > 0) {
                    placeOptions.value = [
                        { value: '', label: '請選擇設備號碼' },
                        ...placeOptionsData[newValue].map(option => ({ value: option.id, label: `${option.name}(${option.id})` }))
                    ];
                } else {
                    // 當選項為空時，顯示 "查無設備"
                    placeOptions.value = [
                        { value: '', label: '查無設備' }
                    ];

                    alert("查無設備");
                }
            } else {
                placeOptions.value = [
                    { value: '', label: '請選擇設備號碼' }
                ];
            }
        } else if (member_level.value == 1) {
            // 清空 place_id
            place_id.value = '';
        }
    });
}
*/

// 處理異常值
export function useOutliers() {

    const findAndReplaceOutliers = (originalData) => {
        // 轉換為數字型態
        const numericData = originalData.map(Number);

        // 計算平均數和標準差
        const mean = numericData.reduce((acc, val) => acc + val, 0) / numericData.length;
        const stdDev = Math.sqrt(numericData.map(x => Math.pow(x - mean, 2)).reduce((acc, val) => acc + val, 0) / numericData.length);

        // 使用 Z-score 找出異常值並替換
        return numericData.map((x) => {
            const zScore = (x - mean) / stdDev;
            if (Math.abs(zScore) > 2) {
                return mean;
            }
            return x;
        });
    };

    //Tukey's Fences 使用四分位數來檢測異常值
    // const findAndReplaceOutliersWithTukeys = (data) => {
    //     // const numericData = data.map(Number);
    //     const numericData = data.map(val => Math.round(parseFloat(val) * 100) / 100);
    //     const values = [...numericData].sort((a, b) => a - b);
    //     const q1 = values[Math.floor((values.length / 4))];
    //     const q3 = values[Math.ceil((3 * values.length) / 4)];
    //     const iqr = q3 - q1;
    //     const lowerBound = q1 - 1.5 * iqr;
    //     const upperBound = q3 + 1.5 * iqr;

    //     return numericData.map(value => {
    //         if (value < lowerBound || value > upperBound) {
    //             return (q3 + q1) / 2; // 使用四分位數的中值替換
    //         }
    //         return value;
    //     });
    // }
    const findAndReplaceOutliersWithTukeys = (data) => {
        // 過濾掉所有的 0 值，只在計算四分位數時排除它們
        const nonZeroValues = data.filter(val => parseFloat(val) !== 0).map(val => Math.round(parseFloat(val) * 10) / 10);
        // 如果 nonZeroValues 非空，則繼續計算，否則直接返回原始資料
        if (nonZeroValues.length > 0) {
            const values = [...nonZeroValues].sort((a, b) => a - b);
            const q1 = values[Math.floor((values.length / 4))];
            const q3 = values[Math.ceil((3 * values.length) / 4)];
            const iqr = q3 - q1;
            const lowerBound = q1 - 3 * iqr;
            const upperBound = q3 + 3 * iqr;

            return data.map(val => {
                // 取小數點第一位
                const value = Math.round(parseFloat(val) * 10) / 10;
                if (value !== 0 && (value < lowerBound || value > upperBound)) {
                    return (q3 + q1) / 2; // 使用非零值的四分位數中值替換
                }
                return value;
            });
        } else {
            // 如果 nonZeroValues 為空，意味著所有值都是 0，不需要替換
            return data.map(val => Math.round(parseFloat(val) * 10) / 10);
        }
    }

    const findAndReplaceOutliersWithAverage = (values) => {
        // 轉換為數字並排序
        const nums = values.map(val => Math.round(parseFloat(val) * 10) / 10).sort((a, b) => a - b);

        // 計算四分位數
        const q1 = nums[Math.floor(nums.length / 4)];
        const q3 = nums[Math.floor(3 * nums.length / 4)];
        const iqr = q3 - q1;

        // 設定異常值閾值
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        // 修正異常值
        return values.map((val, index, arr) => {
            const num = parseFloat(val);
            if (num < lowerBound || num > upperBound) {
                // 計算相鄰值的平均數
                const prev = parseFloat(arr[index - 1] || arr[index]);
                const next = parseFloat(arr[index + 1] || arr[index]);
                return (prev + next) / 2;
            }
            return num;
        });
    };

    return {
        findAndReplaceOutliersWithTukeys
    };
}

// 設備號碼組成 (一般會員)
export function useGeneratePlaceOptions(member_level, placeOptionsData, placeOptions) {
    onMounted(() => {
        if (member_level.value == 0) {
            Object.keys(placeOptionsData).forEach(key => {
                const itemsWithKey = placeOptionsData[key].map(item => ({
                    value: item.id,
                    label: `${item.name}(${item.id})`,
                    category: key
                }));
                placeOptions.value = placeOptions.value.concat(itemsWithKey);
            });

            console.log(placeOptions.value);
        }

    });

}

export function useAutoLogout(maxIdleTime = 10 * 60 * 1000) {
    const idleTime = ref(0);

    // Reset the idle time to 0
    const resetIdleTime = () => {
        idleTime.value = 0;
    };

    // Check the idle time and log out if necessary
    const checkIdleTime = () => {
        idleTime.value += 1000;
        if (idleTime.value >= maxIdleTime) {
            // Log out the user, e.g., by redirecting to a logout route
            window.location.href = '/logout';
        }
    };

    // Set up the interval and event listeners
    let intervalId;
    onMounted(() => {
        // Reset idle time whenever user interacts
        document.addEventListener('mousemove', resetIdleTime);
        document.addEventListener('keypress', resetIdleTime);
        // Increment the idle time every second
        intervalId = setInterval(checkIdleTime, 1000);
    });

    // Clean up the interval and event listeners
    onUnmounted(() => {
        document.removeEventListener('mousemove', resetIdleTime);
        document.removeEventListener('keypress', resetIdleTime);
        clearInterval(intervalId);
    });

    // Expose any properties or methods that the consuming component might need
    return {
        resetIdleTime
    };
}


