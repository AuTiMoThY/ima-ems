<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;

class Home extends BaseController
{
    use ResponseTrait;

    private $page_name = 'login';
    private $page_title = '使用者登入';
    private $isLogin = '1';

    public function index()
    {
        $data = [
            "page_title" => $this->page_title,
            "isLogin" => $this->isLogin,
            "session" => $this->session->get()
        ];
        return view('home', $data);
    }

    public function login()
    {
        $requestData = $this->request->getJSON()->data;
        // set session
        $this->session->set("member_info", $requestData);
        $this->session->set("member_level", $requestData->status);
        // var_dump($requestData);
        // var_dump($this->session->get());

        // 使用者設備列表
        $allPlace = $requestData->all_place;
        // $allPlace_json_encode = json_encode($allPlace);
        $filterStrings = array('se', 'ci', 'sp', 'st', 'sf');
        $placeArray = array();
        // 初始化關聯陣列元素
        foreach ($filterStrings as $filter) {
            $placeArray[$filter] = array();
        }

        // 根據篩選條件將place物件插入對應的子陣列
        foreach ($allPlace as $place) {
            foreach ($filterStrings as $filter) {
                if (strpos($place->id, $filter) !== false) {
                    $placeArray[$filter][] = $place;
                    break; // 找到一個符合的就中斷內層迴圈
                }
            }
        }

        $this->session->set("place_array", $placeArray);


        // 計量代號
        $parameterOptions = $requestData->parameterOptions;
        $this->session->set("parameterOptions", $parameterOptions);

        // foreach ($allPlace as $place) {
        //     foreach ($typeArr as $type) {
        //         if (strpos($place->id, $type) !== false) {
        //             $placeArr[] = $place;
        //             break; // 找到一個符合的就中斷內層迴圈
        //         }
        //     }
        // }

        // foreach ($typeArr as $type) {
        //     $filtered = array_filter($allPlace, function($place) {
        //         global $type;
        //         return strpos($place->id, $type) !== false;
        //     });

        //     $placeArr[] = array_values($filtered);
        // }


        $response = [
            'debuger' => array(
                'placeArray' => $placeArray,
                'parameterOptions' => $parameterOptions
            ),
            'status' => 'success',
            'message' => 'Login successful',
            'member_level' => $requestData->status,
        ];

        return $this->respond($response, 200);
        // return redirect()->to(base_url('/real-time'));
    }

    public function logout() {
        $this->session->remove("member_info");
        $this->session->remove("member_level");
        $this->session->remove("place_array");

        return redirect()->to(base_url('/'));
    }
}
