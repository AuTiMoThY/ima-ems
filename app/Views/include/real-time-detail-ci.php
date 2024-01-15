<article class="real_time__detail-cnt" v-if="detail_type === 'ci'">
    <section class="cnt_left">
        <div class="cnt-col">
            <img src="<?= img_url() ?>se-image.png" alt="" class="icon">
        </div>
    </section>
    <section class="cnt_right">
        <div class="cnt_right-row">
            <div class="cnt-col">
                <span class="title">電壓（V）</span>
                <data-elm :is-result="isResult" :single-data="detail_data.voltage"></data-elm>
            </div>
            <div class="cnt-col">
                <span class="title">電流（A）</span>
                <data-elm :is-result="isResult" :single-data="detail_data.current"></data-elm>
            </div>
            <div class="cnt-col">
                <span class="title">頻率(hz)</span>
                <data-elm :is-result="isResult" :single-data="detail_data.hz"></data-elm>
            </div>
            <div class="cnt-col">
                <span class="title">錯誤碼</span>
                <data-elm :is-result="isResult" :single-data="detail_data.error"></data-elm>
            </div>
        </div>
    </section>
</article>