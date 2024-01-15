<header class="site_header" id="siteHeader">
    <div class="site_header-container container">
        <div class="site_logo">
            <a href="./" class="site_logo-link">
                <img src="<?= img_url('logo-02-1.png') ?>" alt="今時科技">
            </a>
        </div>
        <nav class="site_nav" id="siteNav">
            <ul class="site_nav-list cf lis-n">


                <li class="site_nav-item" data-highlight="real-time" :class="{'js-active': highlight === 'real-time'}">
                    <a href="<?= base_url('real-time') ?>" class="link">即時資訊</a>
                </li>

                <li class="site_nav-item" data-highlight="daily-usage-heatmap" :class="{'js-active': highlight === 'daily-usage-heatmap'}">
                    <a href="<?= base_url('daily-usage-heatmap') ?>" class="link">每日用量熱圖</a>
                </li>

                <li class="site_nav-item" data-highlight="fifteen-demand" :class="{'js-active': highlight === 'fifteen-demand'}">
                    <a href="<?= base_url('fifteen-demand') ?>" class="link">每十五分鐘需量</a>
                </li>

                <li class="site_nav-item" data-highlight="daily-demand-heatmap" :class="{'js-active': highlight === 'daily-demand-heatmap'}">
                    <a href="<?= base_url('daily-demand-heatmap') ?>" class="link">每日需量熱圖</a>
                </li>

                <li class="site_nav-item" data-highlight="analysis" :class="{'js-active': highlight === 'analysis'}">
                    <a href="<?= base_url('analysis') ?>" class="link">交叉分析</a>
                </li>

                <li class="site_nav-item" data-highlight="logout">
                    <a href="<?= base_url('logout') ?>" class="link">登出系統</a>
                </li>


            </ul>
        </nav>
        <div class="m_menu" id="m_menu" onclick="imaemsUI.mmenu().init();">
            <div class="group">
                <div class="line1"></div>
                <div class="line2"></div>
                <div class="line3"></div>
                <div class="line4"></div>
            </div>
        </div>
    </div>
    <div class="member_info" v-if="member_level == '0'">
        <div class="container">
            <p class="txt">使用者(<?= $user_id ?>)您好</p>
        </div>
    </div>
    <div class="member_info" v-if="member_level == '1'">
        <div class="container">
            <p class="txt">內部人員(<?= $user_id ?>)您好</p>
            <a href="https://api.seochibao.com/ems_spa_admin/" class="link" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i>後台管理系統</a>
        </div>
    </div>
</header>
<!-- /.site_header -->