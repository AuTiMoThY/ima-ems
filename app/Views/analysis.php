<?= $this->extend("layout/default") ?>
<?= $this->section("pageTitle") ?>
<?= $page_title ?>
<?= $this->endSection() ?>

<?= $this->section("page_head") ?>
<script id="page_head">
    const placeOptionsData = <?= $placeData ?>;
    const typeOptionsData = [{
            value: '',
            label: '請選擇電錶、變頻器'
        },
        {
            value: 'se',
            label: '電錶'
        },
        {
            value: 'ci',
            label: '變頻器'
        },
        {
            value: 'sp',
            label: '壓差計'
        },
        {
            value: 'st',
            label: '溫度計'
        },
        {
            value: 'sf',
            label: '流量計'
        }
    ];
    const serverOptionsData = [{
            value: '',
            label: '請輸入伺服器'
        },
        {
            value: 'db4.ima-ems.com',
            label: '195 商辦'
        },
        {
            value: 'db2.ima-ems.com',
            label: '196 非商辦'
        }
    ];
    const memberLevel = "<?= $member_level ?>";

    const parameterOptionsData = <?= $parameterOptions ?>;
    console.log(parameterOptionsData);
</script>
<?= $this->endSection() ?>

<?= $this->section("content") ?>

<!-- =========================================================================-->
<!-- 頁面內容  START-->
<!-- =========================================================================-->
<main class="page_main page-analysis" id="Analysis">

    <section class="page_section analysis__query">
        <div class="page_section-inner">
            <div class="page_section-content container">
                <div class="real_time__query-wrapper">
                    <div class="imaems_panel query_panel">
                        <h2 class="imaems_panel-hd mb-0">交叉分析數據</h2>
                        <div class="imaems_panel-bd">
                            <form action="" class="imaems_frm query_frm" id="queryFrm">
                                <input type="hidden" id="token" value="<?= $token ?>">
                                <input type="hidden" id="user_id" value="<?= $user_id ?>">

                                <div class="imaems_frm-bd">
                                    <section class="form-group row">
                                        <div class="col-12">
                                            <input-field label="日期" id="date" class="date_field" v-model="date" :isrequired="1" placeholder="請輸入日期" :error="fieldErrors.date"></input-field>
                                        </div>
                                    </section>
                                    <section class="form-group row">
                                        <div class="col-12">
                                            <select-field label="天數" id="day" :options="dayOptions" ref="daySelect" v-model="day" :required="true" :error="fieldErrors.day"></select-field>
                                        </div>
                                    </section>
                                    <section class="analysis_query-data_list">
                                        <ul class="analysis_query-data_list-ul lis-n">
                                            <li v-for="(data, index) in dataList" :key="index" class="analysis_query-data_list-item" >
                                                <div class="item-hd">

                                                    <div class="title">數據{{index + 1}}</div>

                                                    <button type="button" class="download-btn" :disabled="isdisabledDownload" @click="downloadData(data)">
                                                        <i class="fa-solid fa-download"></i>{{isdisabledDownload ? "下載中..." : "下載表格資料"}}
                                                    </button>

                                                </div>
                                                <hr>
                                                <div class="form-group">
                                                    <?php if ($member_level == 0) : ?>
                                                        <!-- <div class="analysis_query-data_list-item-col">
                                                            <section class="form-group row">
                                                                <div class="col-12">
                                                                    <select-field label="計量" :id="'type-' + index" v-model="data.type" class="imaems_field-v" :options="typeOptions" ref="typeSelect" :required="true" :error="fieldErrors['type-' + index]"></select-field>
                                                                </div>
                                                            </section>
                                                        </div> -->
                                                    <?php endif; ?>
                                                    <div class="analysis_query-data_list-item-col">
                                                        <?php if ($member_level == 0) : ?>
                                                            <select-field label="設備號碼" :id="'place_id-' + index" v-model="data.place_id" class="imaems_field-v" :options="placeOptions" ref="placeSelect" :required="true" :error="fieldErrors['place_id-' + index]"></select-field>
                                                        <?php elseif ($member_level == 1) : ?>
                                                            <input-field label="設備號碼" :id="'place_id-' + index" v-model="data.place_id" class="imaems_field-v" :isrequired="1" placeholder="請輸入設備號碼" :error="fieldErrors['place_id-' + index]"></input-field>
                                                        <?php endif; ?>
                                                    </div>
                                                    <div class="analysis_query-data_list-item-col">
                                                        <select-field label="參數" :id="'parameter-' + index" v-model="data.parameter" class="imaems_field-v" :options="data.parameterOptions" ref="parameterSelect" :required="true" :error="fieldErrors['parameter-' + index]"></select-field>
                                                    </div>
                                                    <div class="analysis_query-data_list-item-col">
                                                        <number-field label="排除最大異常值" :id="'max_outliers-' + index" v-model="data.max_outliers" class="imaems_field-v" :isrequired="0" placeholder="請輸入欲排除的最大異常值" :error="fieldErrors['max_outliers-' + index]"></number-field>
                                                    </div>
                                                    <div class="analysis_query-data_list-item-col">
                                                        <number-field label="排除最小異常值" :id="'min_outliers-' + index" v-model="data.min_outliers" class="imaems_field-v" :isrequired="0" placeholder="請輸入欲排除的最小異常值" :error="fieldErrors['min_outliers-' + index]"></number-field>
                                                    </div>
                                                </div>
                                                <button type="button" class="btn-remove_data_block" @click="removeDataBlock(index)" v-if="index != 0">
                                                    <i class="fa-solid fa-trash-can"></i>
                                                </button>

                                                <div class="error-msg" v-if="fieldErrors.dynamicBlocks[index] && fieldErrors.dynamicBlocks[index].type">
                                                    {{ fieldErrors.dynamicBlocks[index].type }}
                                                </div>
                                                <div class="error-msg" v-if="fieldErrors.dynamicBlocks[index] && fieldErrors.dynamicBlocks[index].place_id">
                                                    {{ fieldErrors.dynamicBlocks[index].place_id }}
                                                </div>
                                                <div class="error-msg" v-if="fieldErrors.dynamicBlocks[index] && fieldErrors.dynamicBlocks[index].parameter">
                                                    {{ fieldErrors.dynamicBlocks[index].parameter }}
                                                </div>
                                            </li>
                                        </ul>
                                        <button type="button" class="analysis_query-data_list-btn" @click="addDataBlock">
                                            <div class="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <mask id="mask0_327_468" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                        <rect width="24" height="24" fill="#D9D9D9" />
                                                    </mask>
                                                    <g mask="url(#mask0_327_468)">
                                                        <path d="M11 13H5V11H11V5H13V11H19V13H13V19H11V13Z" fill="white" />
                                                    </g>
                                                </svg>
                                            </div>
                                            <div class="txt">新增數據</div>
                                        </button>
                                    </section>
                                </div>
                                <div class="imaems_frm-ft">
                                    <!-- <submit-btn default_txt="送出查詢資料" sending_txt="查詢資料中..." :isdisabled="isdisabled"></submit-btn> -->
                                    <button type="button" class="imaems_btn" :disabled="isMultiLineDisabled" @click="sendMultiLine">{{isMultiLineDisabled ? "圖表繪製中..." : "繪製折線圖"}}</button>
                                    <button type="button" class="imaems_btn" :disabled="isScatterDisabled" @click="sendScatter" v-if="dataList.length === 2">{{isScatterDisabled ? "圖表繪製中..." : "繪製散佈圖"}}</button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>



















        <!-- /.page_section-inner -->
    </section>

    <section class="page_section analysis__chart">
        <div class="page_section-inner">
            <div class="page_section-content container-fluid">
                <div class="real_time__chart-wrapper">
                    <div class="imaems_panel query_panel imaems_panel-nobg">
                        <!-- <h2 class="imaems_panel-hd mb-0">分析結果</h2> -->
                        <div class="imaems_panel-bd">
                            <div class="search_result chart-block " style="width: 100%;">
                                <div class="chart-non-data" v-if="!isResult">
                                    <h3 class="title text-center txt-H3">等候資料...</h3>
                                    <div class="chart-cnt">
                                        <div class="loader loader--style1" title="0">
                                            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                                                <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                                                <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z">
                                                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
                                                </path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="multi-line-chart" style="position: relative; overflow: hidden;">
                                    <div class="chart-info text-center" v-show="isShowMultiLine">
                                        <p class="txt ">折線圖</p>
                                    </div>
                                    <div id="chart" class="chart-cnt" style="width: 100%; height: 700px;" :style="isShowMultiLine ? {} : {position: 'absolute'}" :class="{'hidden': !isShowMultiLine}"></div>
                                </div>
                                <div class="scatter-chart" style="position: relative; overflow: hidden;">
                                    <div class="chart-info text-center" v-show="isShowScatter">
                                        <p class="txt ">散佈圖</p>
                                    </div>
                                    <div id="chart2" class="chart-cnt" style="width: 100%; height: 800px;" :style="isShowScatter ? {} : {position: 'absolute'}" :class="{'hidden': !isShowScatter}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /.page_section-inner -->
    </section>
</main>

<!-- /.page_main END  !! -->
<!-- =========================================================================-->
<!-- 頁面內容  END  !!-->
<!-- =========================================================================-->
<?= $this->endSection() ?>

<?= $this->section("page_script") ?>
<script src="<?= js_url('libs/ecStat.js') ?>"></script>
<script type="module" src="<?= js_url('page/analysis.js?v=' . WEB_VERSION) ?>"></script>
<?= $this->endSection() ?>