<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;

class RealTime extends BaseController
{
    use ResponseTrait;

    private $page_name = 'real_time';
	private $page_title = '即時資訊';

    public function index()
    {
        return $this->renderView('real-time', $this->page_title);

    }
}
