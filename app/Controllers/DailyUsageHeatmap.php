<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;

class DailyUsageHeatmap extends BaseController
{
    use ResponseTrait;

    private $page_name = 'daily_usage_heatmap';
	private $page_title = '每日用量熱圖';

    public function index()
    {
        return $this->renderView('daily-usage-heatmap', $this->page_title);
    }
}
