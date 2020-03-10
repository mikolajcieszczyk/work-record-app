function Tooltip (element) {
    var tooltipOpen = element.tooltip({
	    position: {
	        my: "left bottom",
	        at: "center",
	        collision: "fit"
	    },
	    disabled:true,
	    close: function (event, ui) {
	        ui.tooltip.hover(function () {
	            $(this).stop(true).fadeTo(500,1);
	        }, function () {

	        })
	    }
	});

	element.on("keypress", function () {
	    tooltipOpen.tooltip( "disable" );
	})

	element.on("click", function() {
		tooltipOpen.tooltip( "disable");
	})

	return tooltipOpen;
}