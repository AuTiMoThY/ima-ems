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
</script>
<?= $this->endSection() ?>

<?= $this->section("content") ?>

<!-- =========================================================================-->
<!-- 頁面內容  START-->
<!-- =========================================================================-->
<main class="page_main page-fifteen_demand" id="FifteenDemandApp">

    <section class="page_section fifteen_demand__query">
        <div class="page_section-inner">
            <div class="page_section-content container">
                <div class="fifteen_demand__query-wrapper">
                    <p class="txt text-center"></p>
                    <div class="imaems_panel query_panel">
                        <h2 class="imaems_panel-hd mb-0"><?= $page_title ?></h2>
                        <div class="imaems_panel-bd">
                            <form action="" class="imaems_frm query_frm" @submit.prevent="handleSubmit($event)">
                                <input type="hidden" id="token" value="<?= $token ?>">
                                <input type="hidden" id="user_id" value="<?= $user_id ?>">
                                <div class="imaems_frm-bd">
                                    <?php if ($member_level == 0) : ?>
                                        <!-- <section class="form-group row">
                                            <div class="col-12">
                                                <select-field label="計量" id="type" :options="typeOptions" ref="typeSelect" v-model="type" :required="true" :error="fieldErrors.type"></select-field>
                                            </div>
                                        </section> -->
                                    <?php endif; ?>
                                    <section class="form-group row">
                                        <div class="col-12">
                                            <?php if ($member_level == 0) : ?>
                                                <select-field label="設備號碼" id="place_id" :options="placeOptions" ref="placeSelect" v-model="place_id" :required="true" :error="fieldErrors.place_id"></select-field>
                                            <?php elseif ($member_level == 1) : ?>
                                                <input-field label="設備號碼" id="place_id" v-model="place_id" :isrequired="1" placeholder="請輸入設備號碼" :error="fieldErrors.place_id"></input-field>
                                            <?php endif; ?>

                                        </div>
                                    </section>
                                    <?php if ($member_level == 1) : ?>
                                        <!-- <section class="form-group row">
                                            <div class="col-12">
                                                <select-field label="伺服器位置" id="server" :options="serverOptions" ref="serverSelect" v-model="server" :required="true" :error="fieldErrors.server"></select-field>
                                            </div>
                                        </section> -->
                                    <?php endif; ?>
                                    <section class="form-group row">
                                        <div class="col-12">
                                            <input-field label="日期" id="date" class="date_field" v-model="date" :isrequired="1" placeholder="請輸入日期" :error="fieldErrors.date"></input-field>
                                        </div>
                                    </section>
                                </div>
                                <div class="imaems_frm-ft">
                                    <submit-btn default_txt="送出查詢資料" sending_txt="查詢資料中..." :isdisabled="isdisabled"></submit-btn>
                                    <button type="button" class="imaems_btn imaems_btn-success" :disabled="isdisabledDownload" @click="downloadFile" v-if="isResult">{{isdisabledDownload ? "下載中..." : "下載表格資料"}}</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /.page_section-inner -->
    </section>


    <section class="page_section fifteen_demand__chart">
        <div class="page_section-inner">
            <div class="page_section-content container-fluid">
                <div class="fifteen_demand__chart-wrapper">
                    <div class="imaems_panel query_panel imaems_panel-nobg">
                        <!-- <h2 class="imaems_panel-hd mb-0">查詢結果</h2> -->
                        <div class="imaems_panel-bd">
                            <div class="search_result chart-block " style="position: relative; overflow: hidden; width: 100%;">
                                <div class="chart-info text-center" v-if="isResult">
                                    <p class="txt ">設備號碼: {{place_id}}</p>
                                    <p class="txt ">日期: {{date}}</p>
                                </div>
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
                                <div id="chart" class="chart-cnt" style="width: 100%" :style="{height: chartHeight + 'px'}" :class="{'hidden': !isResult}"></div>
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
<script type="module" src="<?= js_url('page/fifteen-demand.js?v=' . WEB_VERSION) ?>"></script>
<?= $this->endSection() ?>