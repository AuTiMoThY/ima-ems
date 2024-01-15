<?= $this->extend("layout/login") ?>
<?= $this->section("pageTitle") ?>
<?= $page_title ?>
<?= $this->endSection() ?>



<?= $this->section("content") ?>

<!-- =========================================================================-->
<!-- 頁面內容  START-->
<!-- =========================================================================-->
<main class="page_main page-login" id="loginApp">
    <div class="container">
        <div class="imaems_panel login_panel">
            <div class="imaems_panel-hd">
                登入 EMS 系統
            </div>
            <div class="imaems_panel-bd">
                <form class="imaems_frm login_frm" @submit.prevent="login($event)" data-baseurl="<?= base_url() ?>">
                    <div class="imaems_frm-bd">
                        <section class="form-group row">
                            <div class="col-12">
                                <input-field label="信箱" id="user_id" v-model="user_id" :isrequired="1" placeholder="請輸入信箱" :error="fieldErrors.user_id"></input-field>
                            </div>
                        </section>
                        <section class="form-group row">
                            <div class="col-12">
                                <password-field label="密碼" id="user_pw" v-model="user_pw" :isrequired="1" placeholder="請輸入密碼" :error="fieldErrors.user_pw"></password-field>
                            </div>
                        </section>
                        <div class="frm-error txt-danger text-center" v-if="frmError">{{ frmError }}</div> <!-- 顯示錯誤消息 -->
                    </div>
                    <div class="imaems_frm-ft">
                        <submit-btn default_txt="登入" sending_txt="登入中..." :isdisabled="isdisabled"></submit-btn>
                    </div>

                </form>
            </div>
        </div>
    </div>

</main>

<!-- /.page_main END  !! -->
<!-- =========================================================================-->
<!-- 頁面內容  END  !!-->
<!-- =========================================================================-->
<?= $this->endSection() ?>

<?= $this->section("page_script") ?>
<script type="module" src="<?= js_url('page/login.js?v='.WEB_VERSION) ?>"></script>
<?= $this->endSection() ?>