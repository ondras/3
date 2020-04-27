<?php
	function array_permutations($arr) {
		if (count($arr) == 1) { return array($arr); }

		$results = [];
		foreach ($arr as $index=>$item) {
			$copy = array_slice($arr, 0);
			array_splice($copy, $index, 1);
			$sub = array_permutations($copy);
			foreach ($sub as $p) {
				array_unshift($p, $item);
				$results[] = $p;
			}
		}
		return $results;
	}

	function string_permutations($str) {
		$arr = str_split($str);
		$perms = array_permutations($arr);
		foreach ($perms as &$p) {
			$p = implode("", $p);
		}
		return $perms;
	}

	function create_file($name) {
		exec("make -C .. '${name}'", $output, $code);
		if ($code != 0) {
			http_response_code(400);
			die($output);
		}
		return $name;
	}

	if (array_key_exists("str", $_GET)) {
		$str = $_GET["str"];

		$str = preg_replace("/[^a-z0-9]/i", "", $str);
		if (strlen($str) != 3) {
			http_response_code(400);
			die("Bad characters");
		}

		$all = string_permutations($str);
		$names = [];
		foreach ($all as $p) {
			$names[] = create_file("out/${p}-tl.3mf");
			$names[] = create_file("out/${p}-tr.3mf");
		}

		header("Content-type: application/json");
		echo json_encode($names);
	} else {
		echo "?str=OMG";
	}
?>