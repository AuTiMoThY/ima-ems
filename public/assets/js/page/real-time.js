import { dataElm, submitBtn, InputField, SelectField } from '../vue-components.js';
import { useFormValidation } from '../vue-validation.js';
import { useQueryData, useTimer, useAutoRefresh, useECharts, useOutliers, useGeneratePlaceOptions, useAutoLogout } from '../vue-composable.js';
import { useApiRequest } from '../vue-api.js';
const { ref, reactive, createApp, onMounted, watch } = Vue;

const siteHeader = createApp({
    setup() {
        const highlight = ref("real-time");
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
        const placeSelect = ref(null);
        const placeOptions = ref([
            { value: '', label: '請選擇設備號碼' },
        ]);
        const typeOptions = typeOptionsData;
        const serverOptions = serverOptionsData;
        const detail_type = ref('se');
        const detail_data = reactive({
            now_time: "",
        });

        const requiredFields = [
            { name: 'place_id', ref: place_id, label: '設備號碼' }
        ];
        const { fieldErrors, validate } = useFormValidation(requiredFields);
        const error = ref('');

        // const { chartInstance } = useInitChart("chart", "line");
        const { chartInstance, drawChart, chartHeight } = useECharts('chart', 'line');

        onMounted(() => {

        });
        useGeneratePlaceOptions(member_level, placeOptionsData, placeOptions);





        /*
        // 更新type時，也更新placeOptions及詳細數據類型  (廢棄)
        useTypeWatcher(type, member_level, placeOptions, place_id, placeOptionsData);
        watch(type, (newValue, oldValue) => {
            // 更新 type 值
            if (member_level.value == 0) {
                // 詳細數據類型 
                detail_type.value = newValue;
                imaemsUI.log(detail_type.value);
            }
        });
        */
        // 更新place_id時，也更新詳細數據類型 
        watch(place_id, (newValue, oldValue) => {
            if (member_level.value == 1) {
                if (newValue === '') {
                    detail_type.value = "se";
                }
                else {
                    // 詳細數據類型
                    detail_type.value = place_id.value.slice(-2);
                }
            }
            else if (member_level.value == 0) {
                detail_type.value = place_id.value.slice(-2);
            }
        });

        // 建立請求參數
        const createBaseData = () => ({
            token: token.value,
            // user_id: user_id.value,
            // type: type.value.toUpperCase(),
            place_id: place_id.value,
        });
        const otherData = {
            member_level: member_level,
            // server: server
        };
        const { queryData } = useQueryData(createBaseData, otherData);

        // 每60秒重新請求一次
        const next_update_sec = 60;
        const interval = 1000 * next_update_sec;
        const { next_update, runTimer } = useTimer(next_update_sec);

        const { findAndReplaceOutliersWithTukeys } = useOutliers();
        const cleanedChartData = ref([]);

        const onSuccess = (api_response) => {
            // 在這裡定義成功後的邏輯
            console.log('Success:', api_response);
            isResult.value = 1;
            // 帶入詳細資料
            const detailObj = api_response.data.detail;
            Object.assign(detail_data, detailObj);
            // console.log("detail_data:", detail_data);

            // 繪製圖表
            const chartArr = api_response.data.chart;
            const columnIndex = 1;

            for (let rowIndex = 0; rowIndex < chartArr.length; rowIndex++) {
                if (chartArr[rowIndex][columnIndex] === "") {
                    let prevValue = null;
                    let nextValue = null;

                    // 尋找前一個非空值
                    for (let i = rowIndex - 1; i >= 0; i--) {
                        if (chartArr[i][columnIndex] !== "") {
                            prevValue = parseFloat(chartArr[i][columnIndex]);
                            break;
                        }
                    }

                    // 尋找後一個非空值
                    for (let i = rowIndex + 1; i < chartArr.length; i++) {
                        if (chartArr[i][columnIndex] !== "") {
                            nextValue = parseFloat(chartArr[i][columnIndex]);
                            break;
                        }
                    }

                    // 計算平均值並填充
                    if (prevValue !== null && nextValue !== null) {
                        chartArr[rowIndex][columnIndex] = ((prevValue + nextValue) / 2).toFixed(10);
                    } else if (prevValue !== null) {
                        chartArr[rowIndex][columnIndex] = prevValue.toFixed(10);
                    } else if (nextValue !== null) {
                        chartArr[rowIndex][columnIndex] = nextValue.toFixed(10);
                    } else {
                        chartArr[rowIndex][columnIndex] = "0";
                    }
                }
            }


            const originalValues = chartArr.slice(1).reverse();
            imaemsUI.log("originalValues", originalValues);

            /*
            // 處理異常值
            const valuesForOutliers = originalValues.map(entry => entry[1]); // 取得所有需要處理的值

            const cleanedValuesForOutliers = findAndReplaceOutliersWithTukeys(valuesForOutliers); // 使用您的函數
            imaemsUI.log("cleanedValuesForOutliers: ", cleanedValuesForOutliers);

            // 將清理後的值放回原來的結構
            const cleanedValues = originalValues.map((entry, index) => {
                const time = entry[0];
                const value = cleanedValuesForOutliers[index];
                return [time, value];
            });
            */

            cleanedChartData.value = [
                chartArr[0],
                ...originalValues
            ];
            imaemsUI.log("cleanedChartData: ", cleanedChartData.value);

            const values = originalValues.map(item => parseFloat(item[1]));
            const maxValue = Math.max(...values);
            const minValue = Math.min(...values);

            imaemsUI.log("maxValue minValue: ", maxValue, minValue);


            drawChart({
                value: cleanedChartData.value,
                max: maxValue,
                min: minValue
            });

            runTimer();

        };

        const onFailure = (api_response) => {
            // 在這裡定義失敗後的邏輯
            console.log('Failure:', api_response);

        };


        const { querySubmit, isdisabled } = useApiRequest('https://api.seochibao.com/api/real-time', validate, queryData, onSuccess, onFailure, member_level);
        const { autoRefreshEnabled, toggleAutoRefresh } = useAutoRefresh(querySubmit, interval);

        const handleSubmit = () => {
            isResult.value = 0;
            // 觸發第一次請求
            querySubmit();

            // 啟用自動更新
            if (!autoRefreshEnabled.value) {
                toggleAutoRefresh();
            }
        }


        return {
            token, user_id, type, place_id, server,
            placeOptions, typeOptions, serverOptions, placeSelect,
            member_level,
            detail_data, detail_type,
            next_update,
            isResult,
            isdisabled,
            fieldErrors,
            handleSubmit
        }
    },


}

const realTimeApp = createApp(setup);
realTimeApp.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('module-');
}
realTimeApp.mount("#realTimeApp");
