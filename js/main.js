$(document).ready(function(){
	// Speak button click
	$('#speak-btn').click(function() {
		var text = $('#texty').val();
		responsiveVoice.speak(text.toLowerCase(), 'Swedish Female');
		$('#texty').focus();
  });

  // Print button click
	$('#print-btn').click(function() {
    window.print();
  });

  // Settings button click
	$('#settings-btn').click(function() {
    swal("Inställningar", "Under konstruktion.");
  });

  // Clear button click
	$('#clear-btn').click(function() {
		$('#texty').val('');
		$('#texty').focus();
  });

  // Help button click
  var wrapper = document.createElement('div');
	wrapper.innerHTML = '<p>Version: 1.0.0.<br><br>Utvecklad av Kim Andersson.<br><a href="mailto:kandersson135@gmail.com?subject=Skrivprata%20webbapp">kandersson135@gmail.com</a></p>';

	$('#help-btn').click(function() {
    swal({
		  title: 'Om webbappen',
		  content: wrapper
		});
  });

	// Textarea speak on key press
	$('#texty').keypress(function(e){
	  //alert(String.fromCharCode(event.which));
		
		
		if(e.keyCode == 32){
			var text = $('#texty').val();
			responsiveVoice.speak(lastword(text).toLowerCase(), 'Swedish Female');
  	} else {
  		responsiveVoice.speak(String.fromCharCode(e.which).toLowerCase(), 'Swedish Female');
  	}
	});
	
	/*
	$('body').keyup(function(e){
		if(e.keyCode == 32){
			
		}
	});
	*/
	
	function lastword(words) {
    var n = words.split(" ");
    return n[n.length - 1];
	}
});
