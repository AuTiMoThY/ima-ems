import { submitBtn, InputField, SelectField, NumberField } from '../vue-components.js';
import { useQueryData, useECharts, useOutliers, useGeneratePlaceOptions, useAutoLogout } from '../vue-composable.js';
import { useApiRequest, useFileDownloader } from '../vue-api.js';
const { ref, reactive, createApp, onMounted, watch, nextTick, toRefs } = Vue;

const siteHeader = createApp({
    setup() {
        const highlight = ref("analysis");
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
        'number-field': NumberField,
        'select-field': SelectField,
        'submit-btn': submitBtn
    },

    mounted() {
        this.token = $("#token").val();
        this.user_id = $("#user_id").val();
    },
    setup() {
        useAutoLogout();
        const isResult = ref(0);
        const isShowMultiLine = ref(0);
        const isShowScatter = ref(0);


        const member_level = ref(memberLevel);
        const token = ref('');
        const user_id = ref('');

        const date = ref('');
        const day = ref('');

        const placeSelect = ref(null);
        const dayOptions = reactive([
            { value: '', label: '請選擇顯示天數' },
        ]);
        const typeOptions = typeOptionsData;

        const parameterOptions = ref([]);
        const placeOptions = ref([]);

        // const defaultDataListArgs = {
        //     type: '', place_id: '', parameter: '', parameterOptions: [], max_outliers: null, min_outliers: null
        // }
        const generateDefaultData = () => {
            return reactive({
                place_id: '',
                parameterOptions: [{ value: '', label: '請選擇參數' }],
                parameter: '',
                max_outliers: null,
                min_outliers: null
            });
        };

        // 數據區塊列表
        const dataList = ref([]);

        const requiredFields = [
            { name: 'date', ref: date, label: '日期' },
            { name: 'day', ref: day, label: '天數' }
        ];

        const fieldErrors = reactive({
            date: '',
            day: '',
            dynamicBlocks: [] // 這個陣列會包含每個動態新增區塊的錯誤信息
        });

        // 表單驗證
        const validate = () => {
            fieldErrors.date = '';
            fieldErrors.day = '';
            fieldErrors.dynamicBlocks = [];

            // 驗證固定欄位
            requiredFields.forEach((field) => {
                const value = field.ref.value.trim();
                if (value === '') {
                    fieldErrors[field.name] = `${field.label} 是必填項目`;
                }
            });

            // 驗證動態新增的數據區塊
            dataList.value.forEach((dataBlock, index) => {
                const errors = {};
                if (!dataBlock.place_id) {
                    errors.place_id = '設備號碼 是必填項目';
                }
                if (!dataBlock.parameter) {
                    errors.parameter = '參數 是必填項目';
                }
                if (Object.keys(errors).length > 0) {
                    fieldErrors.dynamicBlocks[index] = errors;
                }
            });

            return ['date', 'day'].every(key => !Object.keys(fieldErrors[key]).length) && !fieldErrors.dynamicBlocks.length;
        };


        const initializeSelect2 = () => {
            $('.imaems_select-select').select2({
                width: 'style'
            });
        }
        onMounted(() => {
            // 顯示天數上限7天
            for (let i = 1; i <= 7; i++) {
                dayOptions.push({ value: i, label: i });
            }


            const newData = generateDefaultData();
            dataList.value.push(newData);

            watchPlaceId(newData, dataList.value.length - 1);


            nextTick(() => {
                initializeSelect2();
            });

        });

        const watchPlaceId = (data, index) => {
            console.log(Vue.isReactive(data));
            watch(() => data.place_id, (newPlaceId, oldPlaceId) => {
                imaemsUI.log("newPlaceId", newPlaceId);
                // 清空 parameter 和重置 parameterOptions
                data.parameter = '';
                data.parameterOptions = [{ value: '', label: '請選擇參數' }];

                // 偵測 place_id 末兩碼並更新 parameterOptions
                if (newPlaceId) {
                    const getType = newPlaceId.slice(-2).toLowerCase();
                    if (parameterOptionsData.hasOwnProperty(getType)) {
                        data.parameterOptions = [
                            { value: '', label: '請選擇參數' },
                            ...parameterOptionsData[getType],
                        ];
                    }
                }
                nextTick(() => {
                    $(`#parameter-${index}`).select2().trigger('change');
                });
            }, { deep: true });
        }

        // 新增數據區塊
        const addDataBlock = () => {
            const newData = generateDefaultData();
            dataList.value.push(newData);

            watchPlaceId(newData, dataList.value.length - 1);

        }


        // 刪除數據區塊
        const removeDataBlock = (index) => {
            dataList.value.splice(index, 1);
        }

        // 設備號碼下拉選單
        useGeneratePlaceOptions(member_level, placeOptionsData, placeOptions);

        // 建立請求參數
        const createBaseData = () => ({
            token: token.value,
            date: date.value,
            day: day.value,
            data: dataList.value.map(item => ({
                place_id: item.place_id,
                parameter: item.parameter,
            }))
        });
        const otherData = {
            member_level: member_level,
            // server: server
        };
        const { queryData } = useQueryData(createBaseData, otherData);

        const { drawChart: drawMultiLineChart } = useECharts('chart', 'multi-line');
        const { drawChart: drawScatterChart } = useECharts('chart2', 'scatter');

        const chartData = ref({});
        const cleanedChartData = ref([]);
        const { findAndReplaceOutliersWithTukeys } = useOutliers();

        const mainYAxis = ref('');
        const subYAxis = ref('');
        const mainYAxisOptions = ref([]);
        const subYAxisOptions = ref([]);


        // 處理數據
        const processAPIData = (apiData, dataList) => {
            apiData.forEach((data, index) => {
                // 移除第一個元素（即標題）
                const values = data.slice(1).map(item => parseFloat(item[1]));

                // 獲取 max_outliers 和 min_outliers
                const maxOutliers = dataList[index].max_outliers;
                const minOutliers = dataList[index].min_outliers;

                // 找出所有在異常值範圍之外的數據點
                let normalValues = values.filter(val =>
                    (maxOutliers === null || val <= maxOutliers) &&
                    (minOutliers === null || val >= minOutliers)
                );

                // 當 min_outliers 為 0 時，排除數據為 0 的點
                if (minOutliers === 0) {
                    normalValues = normalValues.filter(val => val !== 0);
                }

                // 計算這些數據點的平均值
                let avg = normalValues.reduce((acc, val) => acc + val, 0) / normalValues.length;
                avg = Math.round(avg * 10) / 10

                // 替換在異常值範圍內的數據點
                data.slice(1).forEach((item, i) => {
                    const val = parseFloat(item[1]);
                    if ((maxOutliers !== null && val > maxOutliers) ||
                        (minOutliers !== null && val < minOutliers) ||
                        (minOutliers === 0 && val === 0)) {
                        item[1] = avg.toString();
                    }
                });
            });
        }

        // 繪製折線圖
        const onSuccess = (api_response) => {
            // 在這裡定義成功後的邏輯
            console.log('Success:', api_response);

            isResult.value = 1;
            isShowScatter.value = 0;
            isShowMultiLine.value = 1;

            const apiData = api_response.data.data;
            // 深度複製 apiData
            const copiedApiData = JSON.parse(JSON.stringify(apiData));
            processAPIData(copiedApiData, dataList.value);

            chartData.value = {
                dataArr: copiedApiData,
                parameterList: dataList.value.map(data => data.parameter),
            };

            // 繪製圖表
            drawMultiLineChart(chartData.value);

        };

        // 繪製散佈圖
        const onSuccess2 = (api_response) => {
            // 在這裡定義成功後的邏輯
            console.log('Success2:', api_response);

            isResult.value = 1;
            isShowScatter.value = 1;
            isShowMultiLine.value = 0;

            const apiData = api_response.data.data;
            // 深度複製 apiData
            const copiedApiData = JSON.parse(JSON.stringify(apiData));
            processAPIData(copiedApiData, dataList.value);

            chartData.value = {
                dataArr: copiedApiData,
                parameterList: dataList.value.map(data => data.parameter)
            };

            imaemsUI.log("chartData.value", chartData.value);

            // 繪製圖表
            drawScatterChart(chartData.value);

        };

        const onFailure = (api_response) => {
            // 在這裡定義失敗後的邏輯
            console.log('Failure:', api_response);
        };
        const { querySubmit: queryMultiLine, isdisabled: isMultiLineDisabled } = useApiRequest('https://api.seochibao.com/api/analysis', validate, queryData, onSuccess, onFailure, member_level);
        const { querySubmit: queryScatter, isdisabled: isScatterDisabled } = useApiRequest('https://api.seochibao.com/api/analysis', validate, queryData, onSuccess2, onFailure, member_level);


        // 繪製折線圖
        const sendMultiLine = async () => {
            isResult.value = 0;
            isShowMultiLine.value = 0;
            isShowScatter.value = 0;
            // imaemsUI.log("dataList.value:", dataList.value);
            queryMultiLine();
        }
        // 繪製散佈圖
        const sendScatter = async () => {
            isResult.value = 0;
            isShowMultiLine.value = 0;
            isShowScatter.value = 0;
            queryScatter();
        }

        // 下載表格資料
        const { isdisabledDownload, downloadFileFromApi } = useFileDownloader();
        const downloadData = async (data) => {

            const requestData = {
                "token": token.value,
                "date": date.value,
                "day": day.value,
                "place_id": data.place_id,
                "parameter": data.parameter
            };

            const apiEndpoint = 'https://api.seochibao.com/api/download/analysis';
            imaemsUI.log("requestData", requestData);

            if (validate()) {

                try {
                    await downloadFileFromApi(apiEndpoint, requestData);

                    // const customFileName = `${place_id} - 每日用量資料.csv`;
    
                } catch (error) {
                    // 處理錯誤
                    console.error('Download failed', error);

                }
            }
        }



        return {
            token, user_id, date, day,
            placeOptions, typeOptions, dayOptions, placeSelect, parameterOptions,
            dataList,
            sendMultiLine, sendScatter,
            member_level,
            isResult, isShowMultiLine, isShowScatter,
            isMultiLineDisabled, isScatterDisabled,
            fieldErrors,
            // chartHeight,
            addDataBlock, removeDataBlock,
            mainYAxis, subYAxis, mainYAxisOptions, subYAxisOptions,
            isdisabledDownload, downloadData
        }
    },


}

const Analysis = createApp(setup);
Analysis.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('module-');
}
Analysis.mount("#Analysis");
