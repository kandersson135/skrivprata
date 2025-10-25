$(document).ready(function(){
	const VERSION = "0.0.9";
	const $textArea = $('#text-area');
  const $tipBox = $('#tip-box');
	const tipShown = localStorage.getItem('tipShown');

	// Setting text-area focus on page load
	$('#text-area').focus();

	// version display
	$('#versionDisplay').text(`Version: ${VERSION}`);

	// Fetch text from localStorage
	$('#text-area').val(localStorage.getItem('skrivprata-text') || '');

	// Kollar om tipsrutan redan visats
	// if (!tipShown) {
  //   // Visa bara om det är första gången OCH texten är tom
  //   if ($textArea.val().trim() === "") {
  //     $tipBox.show();
  //   }
	//
  //   // När användaren börjar skriva → dölj tipsrutan och spara flagga
  //   $textArea.one('input', function() {
  //     $tipBox.fadeOut(800);
  //     localStorage.setItem('tipShown', 'true');
  //   });
  // } else {
  //   // Användaren har redan sett tipset tidigare
  //   $tipBox.hide();
  // }

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

	// short command
	$(document).on('keydown', function(e) {
	  if (e.ctrlKey && e.key === '.') {
	    e.preventDefault();
			let text = $('#text-area').val();
		  if (text.trim() !== "") {
		    speakText(text.toLowerCase(), speechRate); // använder vår wrapper
		  }
		  $('#text-area').focus();
	  }
	});

  // Print button click
	$('#print-btn').click(function() {
    window.print();

		//resizeAndPrint();
  });

	function resizeAndPrint() {
		var _print = window.print;
			window.print = function() {
				$('textarea').each(function() {
					$(this).height($(this).prop('scrollHeight'));
				});
				_print();
			}
		window.print();
	}

  // Settings button click
	// Hämta sparade inställningar
	let lineOption = localStorage.getItem("option") || "2"; // 1=dölj, 2=visa
	let speechRate = localStorage.getItem("speechRate") || 1;
	let spellcheckEnabled = localStorage.getItem("spellcheck") === "true";
	let dyslexicFontEnabled = localStorage.getItem("dyslexicFont") === "true";

	// Bygg wrapper för SweetAlert
	let wrapper = document.createElement('div');
	// wrapper.style.maxHeight = '300px';
  // wrapper.style.overflowY = 'auto';
  // wrapper.style.paddingRight = '6px';

	// Radio-knappar HTML
	wrapper.innerHTML = `
	<div class="settings-wrapper">
	  <div class="setting">
	    <label for="lines-toggle">Visa textrader</label>
	    <label class="switch">
	      <input type="checkbox" id="lines-toggle" ${lineOption === "2" ? "checked" : ""}>
	      <span class="slider"></span>
	    </label>
	  </div>

	  <div class="setting">
	    <label for="rateSlider">Rösthastighet</label>
	    <div class="range-wrapper">
	      <input type="range" id="rateSlider" min="0.5" max="1.5" step="0.1" value="${speechRate}">
	      <span id="rateValue">${speechRate}</span>
	    </div>
	  </div>

	  <div class="setting">
	    <label for="spellcheck-toggle">Rättstavning</label>
	    <label class="switch">
	      <input type="checkbox" id="spellcheck-toggle" ${spellcheckEnabled ? "checked" : ""}>
	      <span class="slider"></span>
	    </label>
	  </div>

	  <div class="setting">
	    <label for="font-toggle">Dyslexivänligt typsnitt</label>
	    <label class="switch">
	      <input type="checkbox" id="font-toggle" ${dyslexicFontEnabled ? "checked" : ""}>
	      <span class="slider"></span>
	    </label>
	  </div>
	</div>
	`;

	// Settings-knapp
	$('#settings-btn').click(function() {
	  swal({
	    title: "Inställningar",
	    content: wrapper
	  });

		$('#lines-toggle').on('change', function() {
		  let showLines = $(this).is(':checked');

		  if(showLines) {
		    $('#text-area').addClass('lines');
		    localStorage.setItem("option", "2");
		  } else {
		    $('#text-area').removeClass('lines');
		    localStorage.setItem("option", "1");
		  }
		});

	  // Slider for speech rate
	  $('#rateSlider').on('input change', function() {
	    let newRate = $(this).val();
	    $('#rateValue').text(newRate);
	    localStorage.setItem("speechRate", newRate);
	    speechRate = newRate;
			updateFooterStats();
	  });

		// Spellcheck toggle
		$('#spellcheck-toggle').on('change', function() {
		  let enabled = $(this).is(':checked');

		  $('#text-area')
		    .attr('spellcheck', enabled)
		    .attr('autocorrect', enabled ? 'on' : 'off');

		  localStorage.setItem("spellcheck", enabled);
			updateFooterStats();
		});

		$('#font-toggle').on('change', function() {
			dyslexicFontEnabled = $(this).is(':checked');

		  // Change font
		  // document.documentElement.style.setProperty(
		  //   '--text-font', dyslexicFontEnabled ? 'OpenDyslexic3' : 'Patrick Hand'
		  // );

			// if (dyslexicFontEnabled) {
			//   document.documentElement.style.setProperty('--text-font', 'OpenDyslexic3');
			//   document.documentElement.style.setProperty('--font-size', '22px');
			// } else {
			//   document.documentElement.style.setProperty('--text-font', 'Patrick Hand');
			//   document.documentElement.style.setProperty('--font-size', '28px');
			// }

			const isIpad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;

			if (dyslexicFontEnabled) {
			  document.documentElement.style.setProperty('--text-font', 'OpenDyslexic3');

			  if (isIpad) {
			    document.documentElement.style.setProperty('--font-size', '22px');
			  } else {
			    document.documentElement.style.setProperty('--font-size', '28px');
			  }

			} else {
			  document.documentElement.style.setProperty('--text-font', 'Patrick Hand');
			  document.documentElement.style.setProperty('--font-size', '28px');
			}


		  // Save to localStorage
		  localStorage.setItem("dyslexicFont", dyslexicFontEnabled);
		});
	});

	// At page load, apply saved settings
	// lines
	if(lineOption === "1") {
	  $("#text-area").removeClass("lines");
	} else {
	  $("#text-area").addClass("lines");
	}

	// spell check
	$('#text-area')
  .attr('spellcheck', spellcheckEnabled)
  .attr('autocorrect', spellcheckEnabled ? 'on' : 'off');

	// font
	// document.documentElement.style.setProperty(
	// 	'--text-font', dyslexicFontEnabled ? 'OpenDyslexic3' : 'Patrick Hand'
	// );
	//$('#font-toggle').prop('checked', dyslexicFontEnabled);

	const isIpad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;

	if (dyslexicFontEnabled) {
		document.documentElement.style.setProperty('--text-font', 'OpenDyslexic3');

		if (isIpad) {
			document.documentElement.style.setProperty('--font-size', '22px');
		} else {
			document.documentElement.style.setProperty('--font-size', '28px');
		}

	} else {
		document.documentElement.style.setProperty('--text-font', 'Patrick Hand');
		document.documentElement.style.setProperty('--font-size', '28px');
	}

  // Clear button click
	$('#clear-btn').click(function() {
	  const $txt = $('#text-area');
	  const currentText = $txt.val().trim();

	  // Kolla om textarean är tom
	  if (currentText.length === 0) {
	    swal("Textfältet är redan tomt!", {
	      icon: "info",
	      buttons: false,
	      timer: 1500
	    });
	    return; // Avbryt funktionen
	  }

	  // Om det finns text, visa bekräftelserutan
	  swal({
	    title: "Är du säker?",
	    text: "All text kommer att raderas.",
	    buttons: ["Avbryt", "Rensa"],
	  })
	  .then((willClear) => {
	    if (willClear) {
	      let val = $txt.val();
	      let i = val.length;

	      // Ta bort text från localStorage
	      localStorage.removeItem('skrivprata-text');

				// rensa copy to print helper
				$('#print-helper').text('');

	      // Spela suddljudet
	      const audio = new Audio('audio/eraser.mp3');
	      audio.play();
	      audio.loop = true;

	      const interval = setInterval(function() {
	        if (i <= 0) {
	          clearInterval(interval);
	          $txt.val('');
	          $txt.focus();

	          updateFooterStats();

	          // Stoppa ljudet
	          audio.pause();
	          audio.currentTime = 0;
	          return;
	        }
	        $txt.val(val.slice(0, i));
	        i--;
	      }, 10); // 10 ms mellan varje bokstav
	    }
	  });
	});

	// $('#clear-btn').click(function() {
	//   swal({
	//     title: "Är du säker?",
	//     text: "All text kommer att raderas.",
	//     buttons: ["Avbryt", "Rensa"],
	//   })
	//   .then((willClear) => {
	//     if (willClear) {
	// 		  const $txt = $('#text-area');
	// 		  let val = $txt.val();
	// 		  let i = val.length;
	//
	// 			// Remove text from localStorage
	// 			localStorage.removeItem('skrivprata-text');
	//
	// 			// play sound
	// 		  const audio = new Audio('audio/eraser.mp3');
	// 		  audio.play();
	// 			audio.loop = true;
	//
	// 		  const interval = setInterval(function(){
	// 		    if(i <= 0){
	// 		      clearInterval(interval);
	// 		      $txt.val('');
	// 		      $txt.focus();
	//
	// 					updateFooterStats();
	//
	// 					// stop sound
	// 		      audio.pause();
	// 		      audio.currentTime = 0;
	// 		      return;
	// 		    }
	// 		    $txt.val(val.slice(0,i));
	// 		    i--;
	// 		  }, 10); // 10ms mellan varje bokstav
	//     }
	//   });
	// });

	// Help button click
	var wrapper2 = document.createElement('div');
	wrapper2.innerHTML = `
	  <div style="font-size: 16px; line-height: 1.6; text-align: left;">
	    <p>
	      Skrivprata är ett hjälpmedel som läser upp text medan du skriver,
	      ljudar bokstäver och ord och gör det lättare för elever att träna läs- och skrivinlärning.
	    </p>

	    <ul style="margin: 0; padding-left: 1.2em;">
	      <li>Börja skriva i rutan för att komma igång.</li>
	      <li>Tryck på <i class="fas fa-volume-off"></i> för att höra texten.</li>
	      <li>Din text sparas automatiskt i webbläsaren.</li>
	    </ul>

	    <p style="margin-top: 1em; font-size: 12px; border-radius: 4px;  border: 1px solid #eee; color: #777; background: #f5f5f5; padding: 4px;">
	    	Bonustips: Använd kortkommando <strong>CTRL + .</strong> för att läsa upp all text.
	    </p>

	    <p style="margin-top: 1em;">
	      Utvecklad av Kim Andersson.<br>
	      <a href="mailto:kandersson135@gmail.com?subject=Skrivprata%20webbapp">kandersson135@gmail.com</a>
				<span style="float: right; color: #ccc; font-size: 10px;">Version: ${VERSION}</span>
	    </p>
	  </div>
	`;

	$('#help-btn').click(function() {
	  swal({
	    title: 'Om Skrivprata',
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
	  let pos = textarea.selectionStart;
	  let beforeCursor = textarea.value.substring(0, pos);
	  let words = beforeCursor.trim().split(/\s+/);
	  return words[words.length - 1];
	}

	function getCurrentSentence(textarea) {
	  let pos = textarea.selectionStart;
	  let text = textarea.value.substring(0, pos);
	  let sentences = text.split(/(?<=[.!?])/);
	  sentences = sentences.map(s => s.trim()).filter(s => s.length > 0);
	  return sentences.length > 0 ? sentences[sentences.length - 1] : "";
	}

	function speakText(text, rate = 1) {
	  if (typeof responsiveVoice !== "undefined" && responsiveVoice.speak) {
	    // Försök med responsiveVoice
	    //responsiveVoice.speak(text, "Swedish Female", { rate: rate });

			// responsiveVoice.speak(text, "Swedish Female", {
		  //   rate: rate,
		  //   onstart: function() {
			// 		$('#speak-btn').addClass('icon-speaking');
		  //   },
		  //   onend: function() {
		  //     $('#speak-btn').removeClass('icon-speaking');
		  //   }
		  // });

			responsiveVoice.speak(text, "Swedish Female", {
		    rate: rate,
		    onstart: function() {
					$('#speak-btn').html('<i class="fas fa-volume-up fa-fw"></i>');
		    },
		    onend: function() {
		      $('#speak-btn').html('<i class="fas fa-volume-off fa-fw"></i>');
		    }
		  });
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

	// cope text to print helper
	function copy_to_print_helper(){
    $('#print-helper').text($('#text-area').val());
  }

	// update footer stats
	function updateFooterStats() {
	  let text = $('#text-area').val();
	  let words = text.trim().split(/\s+/).filter(Boolean).length;
	  let chars = text.length;

		$('#word-count').text(words);
	  $('#char-count').text(chars);
		$('#read-time').text(`${Math.ceil(words / (3 * speechRate))}`);
	  $('#rate-indicator').text(speechRate + 'x');

		let spellStatus = localStorage.getItem("spellcheck") === "true" ? 'På' : 'Av';
		$('#spell-status').text(spellStatus);
	}

	let justReadSentence = false;

	$('#text-area').on('keydown', function(e) {
		let textArea = this;

		// Mellanslag eller enter = läs ord (om vi inte just läst en mening)
	  if ((e.key === " " || e.key === "Enter") && !justReadSentence) {
			let word = getCurrentWord(textArea);

			if (word) {
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

				$('#speak-btn').addClass('icon-speaking');

				// Ta bort klassen när ljudet är klart
			 audio.addEventListener('ended', function() {
				 $('#speak-btn').removeClass('icon-speaking');
			 });

				//playLetterSound(letter, speechRate);
	    }
			justReadSentence = false;
	  }
	});

	// Kör vid page load
	updateFooterStats();
	copy_to_print_helper();

	// Kör varje gång texten ändras
	$('#text-area').on('input', function() {
	  localStorage.setItem('skrivprata-text', $(this).val());
		updateFooterStats();
		copy_to_print_helper();
	});
});
