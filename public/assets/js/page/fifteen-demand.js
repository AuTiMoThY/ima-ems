import { dataElm, submitBtn, InputField, SelectField } from '../vue-components.js';
import { useFormValidation } from '../vue-validation.js';
import { useQueryData, useECharts, useOutliers, useGeneratePlaceOptions, useAutoLogout } from '../vue-composable.js';
import { useApiRequest, useFileDownloader } from '../vue-api.js';
const { ref, reactive, createApp, onMounted, watch } = Vue;


const siteHeader = createApp({
    setup() {
        const highlight = ref("fifteen-demand");
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


        const placeSelect = ref(null);
        const placeOptions = ref([
            { value: '', label: '請選擇設備號碼' },
        ]);
        const typeOptions = typeOptionsData;
        const serverOptions = serverOptionsData;

        const requiredFields = [
            { name: 'place_id', ref: place_id, label: '設備號碼' },
            { name: 'date', ref: date, label: '日期' },
        ];
        const { fieldErrors, validate } = useFormValidation(requiredFields);
        const time = reactive([]);
        // const chartHeight = ref('500');

        const { chartInstance, drawChart, chartHeight } = useECharts('chart', 'line');

        onMounted(() => {
            for (let i = 0; i < 24; i++) {
                const timeString = i.toString().padStart(2, '0') + ":00";
                time.push(timeString);
            }
        });
        useGeneratePlaceOptions(member_level, placeOptionsData, placeOptions);

        // useTypeWatcher(type, member_level, placeOptions, place_id, placeOptionsData);
        watch(type, (newValue, oldValue) => {

        });

        // 建立請求參數
        const createBaseData = () => ({
            token: token.value,
            // user_id: user_id.value,
            // type: type.value.toUpperCase(),
            place_id: place_id.value,
            date: date.value
        });
        const otherData = {
            member_level: member_level,
            // server: server
        };
        const { queryData } = useQueryData(createBaseData, otherData);

        const chartData = ref([]);
        const cleanedChartData = ref([]);
        const { findAndReplaceOutliersWithTukeys } = useOutliers();


        const onSuccess = (api_response) => {
            // 在這裡定義成功後的邏輯
            isResult.value = 1;

            chartData.value = api_response.data.chart;
            imaemsUI.log("chartData: ", chartData.value);

            const originalValues = chartData.value.slice(2);
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

            cleanedChartData.value = [
                [chartData.value[0], chartData.value[1]],
                ...cleanedValues
            ];
            imaemsUI.log("cleanedChartData: ", cleanedChartData.value);

            const maxValue = Math.max(...cleanedValuesForOutliers);
            const minValue = Math.min(...cleanedValuesForOutliers);
            imaemsUI.log("maxValue minValue: ", maxValue, minValue);

            // 繪製圖表
            drawChart({
                value: cleanedChartData.value,
                max: maxValue,
                min: minValue
            });
        };


        const onFailure = (api_response) => {
            // 在這裡定義失敗後的邏輯

        };
        const { querySubmit, isdisabled } = useApiRequest('https://api.seochibao.com/api/fifteen-demand', validate, queryData, onSuccess, onFailure, member_level);
        const handleSubmit = () => {
            isResult.value = 0;
            // 觸發第一次請求
            querySubmit();
        }
        const { isdisabledDownload, downloadFileFromApi } = useFileDownloader();

        const downloadFile = async () => {
            
            const apiEndpoint = 'https://api.seochibao.com/api/download/fifteen-demand';
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
            token, user_id, type, place_id, server, date,
            placeOptions, typeOptions, serverOptions, placeSelect,
            querySubmit,
            member_level,
            isResult,
            isdisabled,
            fieldErrors,
            chartHeight,
            isdisabledDownload, downloadFile,
            handleSubmit
        }
    },


}

const FifteenDemandApp = createApp(setup);
FifteenDemandApp.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('module-');
}
FifteenDemandApp.mount("#FifteenDemandApp");
