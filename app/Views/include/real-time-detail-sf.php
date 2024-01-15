<article class="real_time__detail-cnt" v-if="detail_type === 'sf'">
    <section class="cnt_left">
        <div class="cnt-col">
            <img src="<?= img_url() ?>se-image.png" alt="" class="icon">
        </div>
    </section>
    <section class="cnt_right">
        <div class="cnt_right-row">
            <div class="cnt-col">
                <span class="title">流量(f)</span>
                <data-elm :is-result="isResult" :single-data="detail_data.flow"></data-elm>
            </div>
        </div>
    </section>
</article>