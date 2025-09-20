$(document).ready(function(){

	// Setting text-area focus on page load
	$('#text-area').focus();

	// Speak button click
	$('#speak-btn').click(function() {
		var text = $('#text-area').val();
		responsiveVoice.speak(text.toLowerCase(), 'Swedish Female');
		$('#text-area').focus();
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
	  swal({
	    title: "Är du säker?",
	    text: "All text kommer att raderas.",
	    buttons: ["Avbryt", "Rensa"],
	  })
	  .then((willClear) => {
	    if (willClear) {
	      $('#text-area').val('');
	      $('#text-area').focus();
	      swal("Texten har rensats!", {
	        icon: "success",
	        timer: 1500,
	        buttons: false
	      });
	    }
	  });
	});

  // Help button click
  var wrapper = document.createElement('div');
	wrapper.innerHTML = '<p>Version: 1.0.4.<br><br>Utvecklad av Kim Andersson.<br><a href="mailto:kandersson135@gmail.com?subject=Skrivprata%20webbapp">kandersson135@gmail.com</a></p>';

	$('#help-btn').click(function() {
    swal({
		  title: 'Om webbappen',
		  content: wrapper
		});
  });

	// Textarea speak on key press
	$('#text-area').keypress(function(e) {
	  var text = $('#text-area').val();

	  if (e.keyCode === 32 || e.keyCode === 13) {
	    // Mellanslag (32) eller Enter (13)
	    responsiveVoice.speak(lastword(text).toLowerCase(), 'Swedish Female');
	  } else {
	    // Vanliga bokstäver/tecken
	    responsiveVoice.speak(String.fromCharCode(e.which).toLowerCase(), 'Swedish Female');
	  }
	});

	// $('#text-area').keypress(function(e) {
	//   var text = $('#text-area').val();
	//
	//   if (e.keyCode === 32) {
	//     // Mellanslag → läs sista ordet
	//     responsiveVoice.speak(lastword(text).toLowerCase(), 'Swedish Female');
	//
	//   } else if (e.keyCode === 13) {
	//     // Enter → läs sista raden
	//     var lines = text.split(/\n/);
	//     var lastLine = lines[lines.length - 1].trim();
	//     if (lastLine.length > 0) {
	//       responsiveVoice.speak(lastLine.toLowerCase(), 'Swedish Female');
	//     }
	//   } else {
	//     // Vanliga bokstäver/tecken → läs tecknet
	//     responsiveVoice.speak(String.fromCharCode(e.which).toLowerCase(), 'Swedish Female');
	//   }
	// });

	function lastword(words) {
    var n = words.split(" ");
    return n[n.length - 1];
	}
});
