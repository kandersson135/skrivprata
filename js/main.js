$(document).ready(function(){
	// Setting text-area focus on page load
	$('#text-area').focus();

	// Save text to localStorage
	$('#text-area').on('input', function() {
	  localStorage.setItem('skrivprata-text', $(this).val());
	});

	// Fetch text from localStorage
	$('#text-area').val(localStorage.getItem('skrivprata-text') || '');
	updateWordCount();

	// Speak button click
	// $('#speak-btn').click(function() {
	// 	var text = $('#text-area').val();
	// 	//responsiveVoice.speak(text.toLowerCase(), 'Swedish Female');
	// 	responsiveVoice.speak(text.toLowerCase(), "Swedish Female", {
	// 		rate: speechRate
	// 	});
	// 	$('#text-area').focus();
  // });

	// Speak button click
	$('#speak-btn').click(function() {
	  let text = $('#text-area').val();
	  if (text.trim() !== "") {
	    speakText(text.toLowerCase(), speechRate); // använder vår wrapper
	  }
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
	var spellcheckEnabled = localStorage.getItem("spellcheck") === "true";



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

	<br><br><br><hr color="#eee"><br><br>

	<p>Rösthastighet för talsyntes</p>
	<input type="range" id="rateSlider" min="0.5" max="1.5" step="0.1" value="${speechRate}">
	<span id="rateValue">${speechRate}</span>

	<br><br><br><hr color="#eee"><br><br>

	<p>Rättstavning</p>
	<label>
	  <input type="checkbox" id="spellcheck-toggle" ${spellcheckEnabled ? "checked" : ""}>
	  Aktivera rättstavning
	</label>
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

		// Rättstavnings-checkbox
	  // $('#spellcheck-toggle').on('change', function() {
	  //   let enabled = $(this).is(':checked');
	  //   $('#text-area').attr('spellcheck', enabled);
	  //   localStorage.setItem("spellcheck", enabled);
	  // });

		$('#spellcheck-toggle').on('change', function() {
		  let enabled = $(this).is(':checked');

		  $('#text-area')
		    .attr('spellcheck', enabled)
		    .attr('autocorrect', enabled ? 'on' : 'off');

		  localStorage.setItem("spellcheck", enabled);
		});
	});

	// Vid sidladdning, applicera sparade inställningar
	if(lineOption === "1") {
	  $("#text-area").removeClass("lines");
	} else {
	  $("#text-area").addClass("lines");
	}

	//Applicera rättstavning vid laddning
	//$('#text-area').attr('spellcheck', spellcheckEnabled);
	$('#text-area')
  .attr('spellcheck', spellcheckEnabled)
  .attr('autocorrect', spellcheckEnabled ? 'on' : 'off');

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

				// Remove text from localStorage
				localStorage.removeItem('skrivprata-text');

				// spela ljudet
			  const audio = new Audio('audio/eraser.mp3');
			  audio.play();
				audio.loop = true;

			  const interval = setInterval(function(){
			    if(i <= 0){
			      clearInterval(interval);
			      $txt.val('');
			      $txt.focus();

						updateWordCount();

						// stoppa ljudet direkt när vi är klara
			      audio.pause();
			      audio.currentTime = 0; // hoppa tillbaka till början
			      return;
			    }
			    $txt.val(val.slice(0,i));
			    i--;
			  }, 10); // 10ms mellan varje bokstav
	    }
	  });
	});

  // Help button click
  var wrapper2 = document.createElement('div');
	wrapper2.innerHTML = '<p>Detta är ett hjälpmedel som läser upp text medan du skriver, ljudar bokstäver och ord, och gör det lättare för elever att träna läs- och skrivinlärning.<br><br>Version: 0.0.8.<br><br>Utvecklad av Kim Andersson.<br><a href="mailto:kandersson135@gmail.com?subject=Skrivprata%20webbapp">kandersson135@gmail.com</a></p>';

	$('#help-btn').click(function() {
    swal({
		  title: 'Om verktyget',
		  content: wrapper2
		});
  });

	// playbackRate for letters
	function playLetterSound(letter, rate = 1) {
	  fetch('audio/' + letter + '.mp3')
	    .then(res => res.arrayBuffer())
	    .then(buf => {
	      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	      audioCtx.decodeAudioData(buf, (decoded) => {
	        const source = audioCtx.createBufferSource();
	        source.buffer = decoded;
	        source.playbackRate.value = rate; // ändra hastighet här
	        source.connect(audioCtx.destination);
	        source.start(0);
	      });
	    });
	}

	// get current word position
	function getCurrentWord(textarea) {
	  // markörens position
	  let pos = textarea.selectionStart;

	  // ta texten fram till markören
	  let beforeCursor = textarea.value.substring(0, pos);

	  // splitta på mellanslag eller radbrytning
	  let words = beforeCursor.trim().split(/\s+/);

	  // returnera sista ordet innan markören
	  return words[words.length - 1];
	}

	function getCurrentSentence(textarea) {
	  let pos = textarea.selectionStart;
	  let text = textarea.value.substring(0, pos);

	  // Dela texten i meningar på skiljetecken (inklusive dem)
	  let sentences = text.split(/(?<=[.!?])/);
	  // Trimma bort tomma element
	  sentences = sentences.map(s => s.trim()).filter(s => s.length > 0);

	  // Returnera sista meningen om den finns
	  return sentences.length > 0 ? sentences[sentences.length - 1] : "";
	}

	function speakText(text, rate = 1) {
	  if (typeof responsiveVoice !== "undefined" && responsiveVoice.speak) {
	    // Försök med responsiveVoice
	    responsiveVoice.speak(text, "Swedish Female", { rate: rate });
			// responsiveVoice.speak(text, "Swedish Female", {
		  //   rate: rate,
		  //   onstart: function() {
			// 		$('#speak-btn').html('<i class="fas fa-volume-up"></i>');
		  //   },
		  //   onend: function() {
		  //     $('#speak-btn').html('<i class="fas fa-volume-off"></i>');
		  //   }
		  // });
	  } else if ('speechSynthesis' in window) {
	    // Fallback till inbyggd talsyntes
	    let utterance = new SpeechSynthesisUtterance(text);
	    utterance.lang = "sv-SE"; // svenska
	    utterance.rate = rate;    // hastighet
	    // välj första kvinnliga rösten om möjligt
	    let voices = speechSynthesis.getVoices();
	    let female = voices.find(v => v.lang === "sv-SE" && v.name.toLowerCase().includes("female"));
	    if (female) utterance.voice = female;

			// utterance.onstart = function () {
	    //   $('#speak-btn').html('<i class="fas fa-volume-up"></i>');
	    // };
	    // utterance.onend = function () {
	    //   $('#speak-btn').html('<i class="fas fa-volume-off"></i>');
	    // };

	    speechSynthesis.speak(utterance);
	  } else {
	    console.warn("Ingen talsyntes tillgänglig.");
	  }
	}

	function updateWordCount() {
	  let text = $('#text-area').val().trim();
	  let words = text.split(/\s+/).filter(word => word.length > 0);
	  $('#word-count').text(words.length);
	}

	// Räkna ord vid varje input-ändring
	$('#text-area').on('input', function () {
	  updateWordCount();
	});

	let justReadSentence = false;

	$('#text-area').on('keydown', function(e) {
		let textArea = this;

		// Mellanslag eller enter = läs ord (om vi inte just läst en mening)
	  if ((e.key === " " || e.key === "Enter") && !justReadSentence) {
			let word = getCurrentWord(textArea);

			if (word) {
	      // responsiveVoice.speak(word.toLowerCase(), "Swedish Female", {
	      //   rate: speechRate
	      // });

				speakText(word.toLowerCase(), speechRate);
	    }
	  }

		// Skiljetecken = läs mening
		else if (e.key === "." || e.key === "!" || e.key === "?") {
	    let sentence = getCurrentSentence(this);
	    console.log("Mening som hittades:", sentence);
	    if (sentence) {
	      speakText(sentence.toLowerCase(), speechRate);
				justReadSentence = true;
	    } else {
	      console.log("Ingen mening hittades.");
	    }
	  }

		// Bokstavsljud
		else if (e.key.length === 1) {
	    let letter = e.key.toLowerCase();

	    // Hantera svenska tecken
	    if ("abcdefghijklmnopqrstuvwxyzåäö".includes(letter)) {
	      let audio = new Audio('audio/' + letter + '.mp3');
	      audio.play();
				//playLetterSound(letter, speechRate);
	    }
			justReadSentence = false;
	  }
	});
});
