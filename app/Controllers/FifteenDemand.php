<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;

class FifteenDemand extends BaseController
{
    use ResponseTrait;

    private $page_name = 'fifteen_demand';
	private $page_title = '每十五分鐘需量';

    public function index()
    {
        return $this->renderView('fifteen-demand', $this->page_title);
    }
}
