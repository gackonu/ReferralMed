<?php

function referralpics($filename, $type="full"){
	$path = './uploads/referralpictures/';
	if($type != 'full')
		$path .= $type .'/';
	return $path . $filename;
}
