<?php

namespace App\Controllers;

class Analysis extends BaseController
{

    private $page_name = 'analysis';
	private $page_title = '交叉分析';

    public function index()
    {
        return $this->renderView('analysis', $this->page_title);
    }
}
