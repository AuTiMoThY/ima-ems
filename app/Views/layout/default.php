<!DOCTYPE html>
<html lang="zh-Hant">

<head>
    <title><?= $this->renderSection("pageTitle") ?> | 今時能管系統</title>

    <?= $this->include("include/head") ?>
    <?= $this->renderSection("page_head") ?>
</head>

<body id="app">
    <div class="web_goTop" id="goTop">
        <a class="web_goTop-inner" href="javascript:;" @click.prevent="goToTop">
            <i class="fa-solid fa-arrow-up"></i>
        </a>
    </div>
    <!-- ========================================================================= -->
    <!-- .body_wrap  START-->
    <div class="body_wrap">
        <!-- header START -->
        <?= $this->include("include/header") ?>
        <!-- /header END  !! -->
        <?= $this->renderSection("content") ?>
        <!-- footer START -->
        <?= $this->include("include/footer") ?>
        <!-- /footer END  !! -->
    </div>
    <!-- /.body_wrap  END  !!-->
    <!-- =========================================================================-->

    <?= $this->include("include/script") ?>
    <?= $this->renderSection("page_script") ?>
    <div class="version">ver.<?= WEB_VERSION ?></div>
</body>

</html>