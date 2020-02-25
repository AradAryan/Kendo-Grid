$(document).ready(function() {
	
	// Expand Panel
    $("#open").click(function () {
        $('.quicklunch').fadeOut("fast");
	    $("div#panel").slideDown("slow");
	    $('#footer').slideDown("slow");
	    $('#mini-menu').slideUp("slow");
	    $('#toppanel').css('top', 0);
	});	
	
	// Collapse Panel
    $("#close").click(function () {
	    $("div#panel").slideUp("slow");
	    $('#footer').slideUp("slow");
	    $('.quicklunch').fadeIn("fast");
	    $('#mini-menu').slideDown("slow");
	    $('#toppanel').css('top', 25);
	});		
	
	// Switch buttons from "Log In | Register" to "Close Panel" on click
	$("#toggle a").click(function () {
		$("#toggle a").toggle();
	});		
		
});