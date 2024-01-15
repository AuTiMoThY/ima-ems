<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;

class DailyDemandHeatmap extends BaseController
{
    use ResponseTrait;

    private $page_name = 'daily_demand_heatmap';
	private $page_title = '每日需量熱圖';

    public function index()
    {
        return $this->renderView('daily-demand-heatmap', $this->page_title);
    }
}
