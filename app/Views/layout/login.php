<!DOCTYPE html>
<html lang="zh-Hant">

<head>
    <title><?= $this->renderSection("pageTitle") ?> | 今時能管系統</title>

    <?= $this->include("include/head") ?>
</head>

<body id="app">

    <?= $this->renderSection("content") ?>
    <!-- ========================================================================= -->


    <?= $this->include("include/script") ?>
    <?= $this->renderSection("page_script") ?>
    <div class="version">ver.<?= WEB_VERSION ?></div>
</body>

</html>