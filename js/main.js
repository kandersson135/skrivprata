$(document).ready(function(){
	// Setting text-area focus on page load
	$('#text-area').focus();

	// Speak button click
	$('#speak-btn').click(function() {
		var text = $('#text-area').val();
		//responsiveVoice.speak(text.toLowerCase(), 'Swedish Female');
		responsiveVoice.speak(text.toLowerCase(), "Swedish Female", {
			rate: speechRate
		});
		$('#text-area').focus();
  });

  // Print button click
	$('#print-btn').click(function() {
    window.print();
  });

  // Settings button click
	// Hämta sparade inställningar
	var lineOption = localStorage.getItem("option") || "2"; // 1=dölj, 2=visa
	var speechRate = localStorage.getItem("speechRate") || 1;

	// Bygg wrapper för SweetAlert
	var wrapper = document.createElement('div');

	// Radio-knappar HTML
	wrapper.innerHTML = `
	<p>Välj om du vill visa eller dölja textrader</p>
	<input type="radio" name="lines" id="opt1" value="1" ${lineOption === "1" ? "checked" : ""}>
	<label for="opt1">Dölj rader</label>
	&nbsp;&nbsp;&nbsp;
	<input type="radio" name="lines" id="opt2" value="2" ${lineOption === "2" ? "checked" : ""}>
	<label for="opt2">Visa rader</label>

	<br><br><hr color="#ddd"><br>

	<p>Rösthastighet för talsyntes</p>
	<input type="range" id="rateSlider" min="0.5" max="1.5" step="0.1" value="${speechRate}">
	<span id="rateValue">${speechRate}</span>
	`;

	// Settings-knapp
	$('#settings-btn').click(function() {
	  swal({
	    title: "Inställningar",
	    content: wrapper
	  });

	  // Radio-knappar direktkoppling
	  $('#opt1').on('change', function(){
	      localStorage.setItem("option", "1");
	      $("#text-area").removeClass("lines");
	  });

	  $('#opt2').on('change', function(){
	      localStorage.setItem("option", "2");
	      $("#text-area").addClass("lines");
	  });

	  // Slider för hastighet
	  $('#rateSlider').on('input change', function() {
	    let newRate = $(this).val();
	    $('#rateValue').text(newRate);
	    localStorage.setItem("speechRate", newRate);
	    speechRate = newRate;
	  });
	});

	// Vid sidladdning, applicera sparade inställningar
	if(lineOption === "1") {
	  $("#text-area").removeClass("lines");
	} else {
	  $("#text-area").addClass("lines");
	}



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
				rate: speechRate
			});
	  } else if (e.key.length === 1) {
	    // Vanliga tecken → spela bokstavsljud

	    let letter = e.key.toLowerCase();

	    // Hantera svenska tecken
	    if ("abcdefghijklmnopqrstuvwxyzåäö".includes(letter)) {
	      let audio = new Audio('audio/' + letter + '.mp3');
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
