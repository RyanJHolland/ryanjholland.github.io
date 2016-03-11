$(document).ready(function() {

	boxHeights();

	setTimeout(function() {
		boxHeights();
	}, 1000);

	$(window).resize(function() {
		boxHeights();
	})

	function boxHeights() {

		for (var box = 1; box < 5; box++) {
			$('#box'+box).css('height', 'auto');
		}

		var heights = [
		$('#box1').height(),
		$('#box2').height(),
		$('#box3').height(),
		$('#box4').height()
		];
		var tallest = Math.max.apply(Math, heights);
		for (var box = 1; box < 5; box++) {
			$('#box'+box).height(tallest);
		}
	}

})