<article class="real_time__detail-cnt" v-if="detail_type === 'se'">
    <section class="cnt_left">
        <div class="cnt-col">
            <span class="title">總用電度數（kWh）</span>
            <data-elm :is-result="isResult" :single-data="detail_data.kwh"></data-elm>
        </div>
        <div class="cnt-col">
            <span class="title">需量（kW）</span>
            <data-elm :is-result="isResult" :single-data="detail_data.kw"></data-elm>
        </div>
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
                <span class="title">功率因數</span>
                <data-elm :is-result="isResult" :single-data="detail_data.pf"></data-elm>
            </div>
            <div class="cnt-col">
                <span class="title">三相電流－Ａ（A）</span>
                <data-elm :is-result="isResult" :single-data="detail_data.current_A"></data-elm>
            </div>
            <div class="cnt-col">
                <span class="title">三相電流－Ｂ（A）</span>
                <data-elm :is-result="isResult" :single-data="detail_data.current_B"></data-elm>
            </div>
            <div class="cnt-col">
                <span class="title">三相電流－Ｃ（A）</span>
                <data-elm :is-result="isResult" :single-data="detail_data.current_C"></data-elm>
            </div>
        </div>
        <div class="cnt_right-row">
            <div class="cnt-col">
                <span class="title">視在功率（kVA）</span>
                <data-elm :is-result="isResult" :single-data="detail_data.kva"></data-elm>
            </div>
            <div class="cnt-col">
                <span class="title">無功功率（kVAR）</span>
                <data-elm :is-result="isResult" :single-data="detail_data.kvar"></data-elm>
            </div>
            <div class="cnt-col">
                <span class="title">無功電度數（kVARh）</span>
                <data-elm :is-result="isResult" :single-data="detail_data.kvarh"></data-elm>
            </div>
        </div>
    </section>
</article>