const { ref, watch, onMounted, onBeforeUnmount, onUnmounted } = Vue;

export const dataElm = {
    props: ['isResult', 'singleData'],
    template: `
        <span class="value" v-if="isResult">{{ singleData }}</span>
        <span class="value" v-else>0</span>
    `
};

export const submitBtn = {
    props: {
        'default_txt': String,
        'sending_txt': String,
        'isdisabled': Boolean
    },
    template: `
    <button type="submit" class="imaems_btn" :disabled="isdisabled">{{isdisabled ? sending_txt : default_txt}}</button>
    `,
};
export const InputField = {
    props: {
        'label': String,
        'id': String,
        'isrequired': Number,
        'placeholder': String,
        'modelValue': String,
        'error': String,
    },
    emits: ['update:modelValue'],
    // props: ['label', 'id', 'isRequired', 'placeholder'],
    template: `
    <module-field class="imaems_field" :class="{ 'required': isrequired }">
        <label :for="id" class="imaems_field-label">{{label}}</label>
        <div class="imaems_field-block">
            <div class="imaems_field-ctrler">
                <input type="text" :id="id" :name="id" v-model.trim="value" class="form-control" :placeholder="placeholder" @input="handleInput">
            </div>
            <div class="error-msg" v-if="error">{{error}}</div> <!-- 顯示錯誤信息 -->
        </div>
    </module-field>
    `,
    setup(props, { emit }) {
        const value = ref(props.modelValue);
        watch(() => props.modelValue, newVal => {
            value.value = newVal;
        });
        const handleInput = () => {
            emit('update:modelValue', value.value);
        };
        return { value, handleInput };
    }
};

export const NumberField = {
    props: {
        'label': String,
        'id': String,
        'isrequired': Number,
        'placeholder': String,
        'modelValue': Number,
        'error': String,
    },
    emits: ['update:modelValue'],
    // props: ['label', 'id', 'isRequired', 'placeholder'],
    template: `
    <module-field class="imaems_field" :class="{ 'required': isrequired }">
        <label :for="id" class="imaems_field-label">{{label}}</label>
        <div class="imaems_field-block">
            <div class="imaems_field-ctrler">
                <input type="number" :id="id" :name="id" v-model="value" class="form-control" :placeholder="placeholder" @input="handleInput">
            </div>
            <div class="error-msg" v-if="error">{{error}}</div> <!-- 顯示錯誤信息 -->
        </div>
    </module-field>
    `,
    setup(props, { emit }) {
        const value = ref(props.modelValue);
        watch(() => props.modelValue, newVal => {
            value.value = newVal;
        });
        const handleInput = () => {
            emit('update:modelValue', value.value);
        };
        return { value, handleInput };
    }
};

export const PasswordField = {
    props: {
        'label': String,
        'id': String,
        'isrequired': Number,
        'placeholder': String,
        'modelValue': String,
        'error': String
    },
    emits: ['update:modelValue'],
    template: `
    <module-field id="password_field" class="imaems_field password_field" :class="{ 'required': isrequired }">
        <label :for="id" class="imaems_field-label">密碼</label>
        <div class="imaems_field-block">
            <div class="imaems_field-ctrler">
                <input :type="fieldType" :id="id" :name="id" v-model="value" class="form-control" :placeholder="placeholder" @input="handleInput">
                <button type="button" class="toggle_password_btn" @click="togglePassword()">
                    <i class="fa-solid fa-eye" v-if="fieldType === 'password'"></i>
                    <i class="fa-solid fa-eye-slash" v-if="fieldType === 'text'"></i>
                </button>
            </div>
            <div class="error-msg" v-if="error">{{error}}</div> <!-- 顯示錯誤信息 -->
        </div>
    </module-field>
    `,
    setup(props, { emit }) {
        const value = ref(props.modelValue);
        const handleInput = () => {
            emit('update:modelValue', value.value);
        };
        const fieldType = ref("password");
        const togglePassword = () => {
            return fieldType.value = (fieldType.value === "password") ? "text" : "password";
        }
        return { value, handleInput, fieldType, togglePassword };
    }
};


export const SelectField = {
    props: {
        'label': String,
        'id': String,
        'options': Array,
        'modelValue': String,
        'error': String,
        // 'selectelement': String,
        'required': {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    template: `
    <module-field :class="['imaems_field', 'select_styled', { 'required': required }]">
        <label :for="id" class="imaems_field-label">{{label}}</label>
        <div class="imaems_field-block">
            <div class="imaems_field-ctrler">
                <div class="imaems_select form-control">
                    <select ref="selectElement" :name="id" :id="id" v-model="value" class="imaems_select-select">
                        <option v-for="option in options" :value="option.value">{{option.label}}</option>
                    </select>
                </div>
            </div>
            <div class="error-msg" v-if="error">{{error}}</div> <!-- 顯示錯誤信息 -->
        </div>
    </module-field>
    `,

    mounted() {
        // 通過 ref 訪問 select 元素
        const selectElement = this.$refs.selectElement;
        // console.log(selectElement);

        // 初始化 Select2
        $(selectElement).select2({
            width: 'style'
        }).on('change', (event) => {
            this.value = event.target.value;
            this.$emit('update:modelValue', this.value);
        });

        // this.initializeSelect2();
    },

    setup(props, { emit }) {
        const value = ref(props.modelValue);

        // 監聽 value 的變化，並通知父組件
        watch(value, (newValue) => {
            emit('update:modelValue', newValue);
        });

        return { value };
    }
}
