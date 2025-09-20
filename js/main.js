$(document).ready(function(){

	// Setting text-area focus on page load
	$('#text-area').focus();

	// Speak button click
	$('#speak-btn').click(function() {
		var text = $('#text-area').val();
		//responsiveVoice.speak(text.toLowerCase(), 'Swedish Female');
		responsiveVoice.speak(text.toLowerCase(), "Swedish Female", {
			rate: 0.8
		});
		$('#text-area').focus();
  });

  // Print button click
	$('#print-btn').click(function() {
    window.print();
  });

  // Settings button click
	var wrapper = document.createElement('div');
	var itemValue = localStorage.getItem("option");

	// Check radio button value
	if (itemValue !== null) {
		if (itemValue === "1") {
			$("#text-area").removeClass("lines");
			wrapper.innerHTML = '<p>Välj om du vill visa eller dölja textrader</p><input type="radio" onclick="localStorage.setItem(`option`, `1`);" name="lines" id="opt1" value="1" checked="checked"> <label for="opt1">Dölj rader</label> &nbsp;&nbsp;&nbsp; <input type="radio" onclick="localStorage.setItem(`option`, `2`);" name="lines" id="opt2" value="2"> <label for="opt2">Visa rader</label>';
		} else {
			$("#text-area").addClass("lines");
			wrapper.innerHTML = '<p>Välj om du vill visa eller dölja textrader</p><input type="radio" onclick="localStorage.setItem(`option`, `1`);" name="lines" id="opt1" value="1"> <label for="opt1">Dölj rader</label> &nbsp;&nbsp;&nbsp; <input type="radio" onclick="localStorage.setItem(`option`, `2`);" name="lines" id="opt2" value="2"  checked="checked"> <label for="opt2">Visa rader</label>';
		}
	} else {
		wrapper.innerHTML = '<p>Välj om du vill visa eller dölja textrader</p><input type="radio" onclick="localStorage.setItem(`option`, `1`);" name="lines" id="opt1" value="1" checked="checked"> <label for="opt1">Dölj rader</label> &nbsp;&nbsp;&nbsp; <input type="radio" onclick="localStorage.setItem(`option`, `2`);" name="lines" id="opt2" value="2"> <label for="opt2">Visa rader</label>';
	}

	$('#settings-btn').click(function() {
		swal({
    	title: "Inställningar",
      content: wrapper
    })
    .then((willReload) => {
      if (willReload) {
        location.reload();
      }
    });
  });

	// $('#settings-btn').click(function() {
  //   swal("Inställningar", "Under konstruktion.");
  // });

  // Clear button click
	$('#clear-btn').click(function() {
	  swal({
	    title: "Är du säker?",
	    text: "All text kommer att raderas.",
	    buttons: ["Avbryt", "Rensa"],
	  })
	  .then((willClear) => {
	    if (willClear) {
			  const $txt = $('#text-area');
			  let val = $txt.val();
			  let i = val.length;

				// spela ljudet
			  const audio = new Audio('audio/eraser.mp3');
			  audio.play();
				audio.loop = true;

			  const interval = setInterval(function(){
			    if(i <= 0){
			      clearInterval(interval);
			      $txt.val('');
			      $txt.focus();

						// stoppa ljudet direkt när vi är klara
			      audio.pause();
			      audio.currentTime = 0; // hoppa tillbaka till början
			      return;
			    }
			    $txt.val(val.slice(0,i));
			    i--;
			  }, 10); // 10ms mellan varje bokstav

	      // swal("Texten har rensats!", {
	      //   icon: "success",
	      //   timer: 1500,
	      //   buttons: false
	      // });
	    }
	  });
	});

  // Help button click
  var wrapper2 = document.createElement('div');
	wrapper2.innerHTML = '<p>Version: 1.0.9.<br><br>Utvecklad av Kim Andersson.<br><a href="mailto:kandersson135@gmail.com?subject=Skrivprata%20webbapp">kandersson135@gmail.com</a></p>';

	$('#help-btn').click(function() {
    swal({
		  title: 'Om webbappen',
		  content: wrapper2
		});
  });

	// Textarea speak on key press
	// $('#text-area').keypress(function(e) {
	//   var text = $('#text-area').val();
	//
	//   if (e.keyCode === 32 || e.keyCode === 13) {
	//     // Mellanslag (32) eller Enter (13)
	//     responsiveVoice.speak(lastword(text).toLowerCase(), 'Swedish Female');
	//   } else {
	//     // Vanliga bokstäver/tecken
	//     responsiveVoice.speak(String.fromCharCode(e.which).toLowerCase(), 'Swedish Female');
	//   }
	// });

	$('#text-area').on('keydown', function(e) {
	  var text = $(this).val();

	  if (e.key === " " || e.key === "Enter") {
	    // Mellanslag eller Enter → spela upp senaste ordet med responsiveVoice
	    //responsiveVoice.speak(lastword(text).toLowerCase(), 'Swedish Female');
			responsiveVoice.speak(lastword(text).toLowerCase(), "Swedish Female", {
				rate: 0.8
			});
	  } else if (e.key.length === 1) {
	    // Vanliga tecken → spela bokstavsljud

	    let letter = e.key.toLowerCase();

	    // Hantera svenska tecken
	    if ("abcdefghijklmnopqrstuvwxyzåäö".includes(letter)) {
	      let audio = new Audio('audio/' + letter + '.wav');
	      audio.play();
	    }
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
