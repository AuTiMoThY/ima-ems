import { submitBtn, InputField, PasswordField } from '../vue-components.js';
import { useFormValidation } from '../vue-validation.js';

const {ref, createApp} = Vue;
const loginPageSetup = {
    components: {
        'input-field': InputField,
        'password-field': PasswordField,
        'submit-btn': submitBtn
    },
    setup() {
        const isdisabled = ref(false);
        const user_id = ref('');
        const user_pw = ref('');
        const fields = [
            { name: 'user_id', ref: user_id, label: '信箱', required: true },
            { name: 'user_pw', ref: user_pw, label: '密碼', required: true },
        ];
        const { fieldErrors, validate } = useFormValidation(fields);
        const frmError = ref('');
        const login = async (e) => {
            const $frm = $(e.target);
            const base_url = $(e.target).data('baseurl');
            isdisabled.value = true;


            if (!validate()) {
                console.error('驗證失敗:', fieldErrors.value);
                isdisabled.value = false;
                return;
            }

            if(user_id.value != '' && user_pw.value != '') {
                try {
                    const api_response = await axios.post('https://api.seochibao.com/api/login', {
                        user_id: user_id.value,
                        user_pw: user_pw.value
                    }, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
    
                    console.log('Login response: ', api_response.data);
                    
                    // 在這裡處理登入成功的邏輯，例如儲存使用者資料或導向其他頁面
                    if (api_response.data.status == 2) {
                        frmError.value = '帳號或密碼輸入錯誤'; // 設置錯誤消息
                        isdisabled.value = false;
                        return;
                    }
                    if (api_response.data.status != 2) {
                        try {
                            const res = await axios.post(`${base_url}login`, {
                                data: api_response.data
                            }, {
                                headers: {
                                    // 'Content-Type': 'application/json',
                                    'X-Requested-With': 'XMLHttpRequest'
                                }
                            });
                            // html()
                            console.log('Login result: ', res.data);

                            window.location.href = `${base_url}real-time`;
                        } catch (error) {
                            console.error('Login failed2', error);
                            console.error('error: ', error.request.responseText);
                        }
                    }
    
                } catch (error) {
                    console.error('Login failed', error);
                }
            }

        };

        return {
            isdisabled,
            user_id,
            user_pw,
            login,
            fieldErrors,
            frmError
        }
    }

}

const loginPage = createApp(loginPageSetup);
loginPage.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('module-')
}
loginPage.mount("#loginApp");
