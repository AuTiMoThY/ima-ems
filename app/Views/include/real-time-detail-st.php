<article class="real_time__detail-cnt" v-if="detail_type === 'st'">
    <section class="cnt_left">
        <div class="cnt-col">
            <img src="<?= img_url() ?>se-image.png" alt="" class="icon">
        </div>
    </section>
    <section class="cnt_right">
        <div class="cnt_right-row">
            <div class="cnt-col">
                <span class="title">溫度(t)</span>
                <data-elm :is-result="isResult" :single-data="detail_data.temperature"></data-elm>
            </div>
        </div>
    </section>
</article>