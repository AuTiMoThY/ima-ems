<?php 
    function css_url($filename = '') {
		return base_url('public/assets/css/'.$filename);
	}

	function js_url($filename = '') {
		return base_url('public/assets/js/'.$filename);
	}

	function plugins_url($filename = '') {
		return base_url('public/assets/plugins/'.$filename);
	}

	function img_url($filename = '') {
		return base_url('public/assets/images/'.$filename);
	}
	function favicon_url($filename = '') {
		return base_url('public/favicon/'.$filename);
	}
?>