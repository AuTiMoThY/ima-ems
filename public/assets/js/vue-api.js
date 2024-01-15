const { ref } = Vue;
export function useApiRequest(url, validate, queryData, onSuccess, onFailure, member_level) {
    const isdisabled = ref(false);
    // let apiIntervalId = null;
    // imaemsUI.log("member_level:", member_level.value);

    const querySubmit = async () => {
        isdisabled.value = true;

        if (!validate()) { // validate() 是您的驗證函數
            console.error('Validation failed');
            isdisabled.value = false;
            return;
        }

        // if (apiIntervalId) {
        //     clearInterval(apiIntervalId);
        // }

        getApiResponse(0, 0);

        // if (apiIntervalId != null) {
        //     apiIntervalId = setInterval(() => {
        //         getApiResponse(0, 0);
        //     }, 1000 * 60);
        // }
    };

    const getApiResponse = async (i, retryCount) => {
        const maxRetries = 3;
        if (retryCount >= maxRetries) {
            console.error('Max retries reached');
            alert("查無資料，請重新查詢");
            // 查詢按鈕狀態回復可點擊
            isdisabled.value = false;
            return;
        }

        const data = queryData()[i];
        imaemsUI.log("queryData:", data);
        try {
            const api_response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            if (api_response.data.status == "success") {
                onSuccess(api_response);  // 自定義成功邏輯
                // imaemsUI.log("api_response:", api_response);
                // 查詢按鈕狀態回復可點擊
                isdisabled.value = false;
            }
            else if (api_response.data.status == "fail") {
                // if (member_level.value == 0) {
                //     getApiResponse(i + 1, retryCount + 1);
                // }
                // else if (member_level.value == 1) {
                //     getApiResponse(i, retryCount + 1);
                // }
                getApiResponse(i, retryCount + 1);
                onFailure(api_response);  // 自定義失敗邏輯
            }

        } catch (error) {
            // 處理錯誤
            console.error('Request failed', error);
            alert("資料查詢失敗，請重新查詢");
            // 查詢按鈕狀態回復可點擊
            isdisabled.value = false;
            // throw error;
            return false;
        }

    };

    return {
        querySubmit,
        isdisabled
    };
}


export function useFileDownloader() {
    const isdisabledDownload = ref(false);

    const downloadFileFromApi = async (apiEndpoint, requestData) => {
        try {
            isdisabledDownload.value = true;
            const download_response = await axios.post(
                apiEndpoint,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }
            );

            // Assuming download_response.data.url contains the URL of the file
            const fileUrl = download_response.data.url;

            window.open(`https://api.seochibao.com/${fileUrl}`, '_blank');
            isdisabledDownload.value = false;
            // return `https://api.seochibao.com/${fileUrl}`;
        } catch (error) {
            console.error('Request failed', error);
            alert('資料查詢失敗，請重新查詢');
            isdisabledDownload.value = false;
            throw error;
        } finally {
            isdisabledDownload.value = false;
        }
    };

    return {
        isdisabledDownload,
        downloadFileFromApi
    };
}
