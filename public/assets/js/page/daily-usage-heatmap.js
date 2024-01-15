import { dataElm, submitBtn, InputField, SelectField } from '../vue-components.js';
import { useFormValidation } from '../vue-validation.js';
import { useQueryData, useECharts, useOutliers, useGeneratePlaceOptions, useAutoLogout } from '../vue-composable.js';
import { useApiRequest, useFileDownloader } from '../vue-api.js';
const { ref, reactive, createApp, onMounted, watch, nextTick } = Vue;

const siteHeader = createApp({
    setup() {
        const highlight = ref("daily-usage-heatmap");
        const member_level = ref(memberLevel);
        return {
            highlight, member_level
        }
    }
});
siteHeader.mount("#siteHeader");

const setup = {
    components: {
        'input-field': InputField,
        'select-field': SelectField,
        'submit-btn': submitBtn,
        'data-elm': dataElm
    },

    mounted() {
        this.token = $("#token").val();
        this.user_id = $("#user_id").val();
    },
    setup() {
        useAutoLogout();
        const isResult = ref(0);
        const member_level = ref(memberLevel);
        const token = ref('');
        const user_id = ref('');
        const type = ref('');
        const place_id = ref('');
        const server = ref('');
        const date = ref('');
        const day = ref('');

        const placeSelect = ref(null);
        const placeOptions = ref([
            { value: '', label: '請選擇設備號碼' },
        ]);
        const typeOptions = typeOptionsData;
        const serverOptions = serverOptionsData;

        const dayOptions = reactive([
            { value: '', label: '請選擇顯示天數' },
        ]);

        const requiredFields = [
            { name: 'place_id', ref: place_id, label: '設備號碼' },
            { name: 'date', ref: date, label: '日期' },
            { name: 'day', ref: day, label: '天數' },
        ];
        const { fieldErrors, validate } = useFormValidation(requiredFields);
        const hours = reactive([]);

        // const chartHeight = ref('500');
        const total_usage = ref(0);

        const { chartInstance, drawChart, chartHeight } = useECharts('chart', 'heatmap', { hours: hours });

        const initializeSelect2 = () => {
            $('.imaems_select-select').select2({
                width: 'style'
            });
        }

        onMounted(() => {
            // 顯示天數上限40天
            for (let i = 1; i <= 40; i++) {
                dayOptions.push({ value: i, label: i });
            }

            for (let i = 0; i < 24; i++) {
                const hourString = i.toString().padStart(2, '0') + ":00";
                hours.push(hourString);
            }


            nextTick(() => {
                initializeSelect2();
            });

        });
        // 設備號碼組成 (一般會員)
        useGeneratePlaceOptions(member_level, placeOptionsData, placeOptions);

        // 建立請求參數
        const createBaseData = () => ({
            token: token.value,
            place_id: place_id.value,
            date: date.value,
            day: day.value
        });
        const otherData = {
            member_level: member_level,
        };
        const { queryData } = useQueryData(createBaseData, otherData);

        const chartData = ref([]);
        const cleanedChartData = ref([]);
        const { findAndReplaceOutliersWithTukeys } = useOutliers();


        const onSuccess = (api_response) => {
            // 在這裡定義成功後的邏輯
            isResult.value = 1;
            imaemsUI.log("api_response", api_response);

            chartData.value = api_response.data.chart.reverse();
            // 日期陣列
            const dateArr = chartData.value.map(entry => entry.data);


            // 獲取當前日期和時間
            const currentDate = new Date();
            const currentDateString = currentDate.toISOString().split('T')[0]; // 格式為 "YYYY-MM-DD"
            const currentTimeHour = currentDate.getHours(); // 當前小時
            // imaemsUI.log("currentDateString: ", currentDateString);
            // imaemsUI.log("currentTimeHour: ", currentTimeHour);

            cleanedChartData.value = chartData.value.map(entry => {
                // 判斷資料日期是否早於或等於當前日期
                if (entry.data < currentDateString || entry.data === currentDateString) {
                    const cleanedValue = findAndReplaceOutliersWithTukeys(entry.value);

                    // 如果是當前日期，僅處理到當前小時之前
                    const endIndex = entry.data === currentDateString ? currentTimeHour : cleanedValue.length;

                    // 過濾出非零值，用於計算最小值
                    const filteredData = cleanedValue.slice(0, endIndex).filter(val => val !== 0);
                    let minValue;

                    if (filteredData.length > 0) {
                        minValue = Math.min(...filteredData);
                    } else {
                        minValue = 0; // 如果過濾後沒有非零值，則設置最小值為0
                    }

                    // 用最小值替換0值，但僅處理到 endIndex
                    const replacedData = cleanedValue.map((val, idx) => (idx < endIndex && val === 0 ? minValue : val));

                    return {
                        ...entry,
                        value: replacedData,
                    };
                } else {
                    // 對於未來的日期，保持原樣
                    return entry;
                }
            });

            imaemsUI.log("cleanedChartData1: ", cleanedChartData.value);



            // 計算每天的數值總和
            const newDateArr = cleanedChartData.value.map(entry => {
                let sum = entry.value.reduce((acc, val) => acc + val, 0);
                sum = Math.round(sum * 10) / 10;
                return `${entry.data}(${sum})`;
            });
            // imaemsUI.log("newDateArr: ", newDateArr);


            // 找出每天的最大值和最小值
            const dailyMaxMin = cleanedChartData.value.map(entry => {
                // 過濾掉值為 0 的項目
                const valuesWithoutZero = entry.value.filter(val => val !== 0);

                // 如果過濾後陣列不為空，找出最大值和最小值，否則設定為 null 或其他預設值
                const max = valuesWithoutZero.length > 0 ? Math.max(...valuesWithoutZero) : null;
                const min = valuesWithoutZero.length > 0 ? Math.min(...valuesWithoutZero) : null;

                return {
                    date: entry.data,
                    max,
                    min
                };
            });
            imaemsUI.log("dailyMaxMin:", dailyMaxMin);

            // 找出最大值和最小值分別是多少及哪一天
            const max = Math.max(...dailyMaxMin.map(o => o.max));
            const min = Math.min(...dailyMaxMin.map(o => o.min));
            const maxDate = dailyMaxMin.find(o => o.max === max)?.date || '';
            const minDate = dailyMaxMin.find(o => o.min === min)?.date || '';

            const overallMaxMinInfo = { maxDate, max, minDate, min };

            // const overallMaxMinInfo = dailyMaxMin.reduce(
            //     (acc, entry) => {
            //         if (entry.max !== null && entry.max > acc.maxValue) {
            //             acc.maxValue = entry.max;
            //             acc.maxDate = entry.date;
            //         }
            //         if (entry.min !== null && entry.min < acc.minValue) {
            //             acc.minValue = entry.min;
            //             acc.minDate = entry.date;
            //         }
            //         return acc;
            //     },
            //     { maxDate: '', maxValue: 0, minDate: '', minValue: 0 }
            // );

            imaemsUI.log("overallMaxMinInfo:", overallMaxMinInfo);
            const overallMaxValue = overallMaxMinInfo.max;
            const overallMaxDate = overallMaxMinInfo.maxDate;
            const overallMinValue = overallMaxMinInfo.min;
            const overallMinDate = overallMaxMinInfo.minDate;

            // 計算所有數值的總和
            const totalSum = cleanedChartData.value.reduce((acc, entry) => {
                return acc + entry.value.reduce((sum, val) => sum + val, 0);
            }, 0);

            // 對總和進行四捨五入
            const roundedTotalSum = Math.round(totalSum * 100) / 100;
            total_usage.value = roundedTotalSum;


            // 圖表用數值陣列
            const valueArr = [];

            // [date, hour, data]
            for (let i = 0; i < dateArr.length; i++) {
                for (let j = 0; j < 24; j++) {
                    const num = parseFloat(cleanedChartData.value[i].value[j]);
                    const roundedNum = Math.round(num * 10) / 10;

                    valueArr.push([i, j, roundedNum]);
                }
            }
            imaemsUI.log("valueArr:", valueArr);

            // 繪製圖表
            drawChart({
                hours: hours,
                date: newDateArr,
                value: valueArr.map(function (item) {
                    return [item[1], item[0], item[2] || '-'];
                }),
                max: overallMaxValue,
                min: overallMinValue
            });
        };


        const onFailure = (api_response) => {
            // 在這裡定義失敗後的邏輯

        };
        const { querySubmit, isdisabled } = useApiRequest('https://api.seochibao.com/api/daily-usage-heatmap', validate, queryData, onSuccess, onFailure, member_level);
        const handleSubmit = () => {
            isResult.value = 0;
            // 觸發第一次請求
            querySubmit();
        }

        const { isdisabledDownload, downloadFileFromApi } = useFileDownloader();

        const downloadFile = async () => {

            const apiEndpoint = 'https://api.seochibao.com/api/download/daily-usage-heatmap';
            const requestData = queryData()[0];
            imaemsUI.log("requestData", requestData);

            try {
                await downloadFileFromApi(apiEndpoint, requestData);
                // const customFileName = `${place_id} - 每日用量資料.csv`;

            } catch (error) {
                // 處理錯誤
                console.error('Download failed', error);

            }
        }

        return {
            token, user_id, type, place_id, server, date, day,
            placeOptions, typeOptions, serverOptions, dayOptions, placeSelect,
            querySubmit,
            member_level,
            isResult,
            isdisabled,
            fieldErrors,
            chartHeight,
            total_usage,
            isdisabledDownload, downloadFile,
            handleSubmit
        }
    },


}

const DailyUsageHeatmapApp = createApp(setup);
DailyUsageHeatmapApp.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('module-');
}
DailyUsageHeatmapApp.mount("#DailyUsageHeatmapApp");
