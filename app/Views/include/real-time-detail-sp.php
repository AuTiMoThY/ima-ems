<article class="real_time__detail-cnt" v-if="detail_type === 'sp'">
    <section class="cnt_left">
        <div class="cnt-col">
            <img src="<?= img_url() ?>se-image.png" alt="" class="icon">
        </div>
    </section>
    <section class="cnt_right">
        <div class="cnt_right-row">
            <div class="cnt-col">
                <span class="title">壓差(p)</span>
                <data-elm :is-result="isResult" :single-data="detail_data.pressure"></data-elm>
            </div>
        </div>
    </section>
</article>