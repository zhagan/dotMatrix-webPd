
 $(document).ready(function() {
        //initialize buttons

        function initUI(){
          //drum matrix ui
              let trkLength = 16;
              let trkContainer = $('<div>');
            for(var t = 0; t<4;t++){
                let track = $('<div class="tracks">');
                track.attr('id',"track"+(t+1));
                let trkBtnArray = [];

              for(var i = 0; i<trkLength;i++){
                    let trkButton = $('<button>');

                    trkButton.attr('value',i+1);
                    trkButton.attr('class',"track"+(t+1));
                    trkButton.attr('id',"button");
                    trkButton.html(i+1);
                    trkBtnArray.push(trkButton);

                  }
                  track.append(trkBtnArray);
                  track.prepend(t+1);
                  trkContainer.append(track);
                }

           $('#trkContainer').append(trkContainer);

           //instrument controls UI
           let trackUI = $('<div id="trackUI">');

           for(var i = 0; i<4;i++){

                  let instDiv = $('<div id="instDiv">');
                  let sliderDiv = $('<div id="sliderDiv" class="sldr">');
                  //instDiv.html("inst");
                  //instDiv.attr('id',"inst"+i);
                  instDiv.append(`<h3>${i+1}</h3>`);
                  sliderDiv.slider({
                        value: 70,

                  });
                  sliderDiv.attr('track',i+1);
                  instDiv.append(`<p id="volLbl">Volume</p2>`);
                  instDiv.append(sliderDiv);
                  trackUI.append(instDiv);

                }


           $('#trkContainer').append(trackUI);

        }

          initUI();


        //the sequence array

        var seqCom = new Array();
        for(x = 0;x<16;x++){
          seqCom[x] = new Array();
          for (y = 0;y<4;y++) {
              seqCom[x][y] = new Array();
              seqCom[x][y] = [0,1,1,1];

          }
        }

        var sequence = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
        //load the patch into webpd
        /*
        var patch
        $.get('patches/myPatch.pd', function(patchStr) {
          patch = Pd.loadPatch(patchStr)
          Pd.start()
        })
        */

        var patch
        $.get('patches/myPatch.pd', function(patchStr) {
          $.get('patches/sampleplayer.pd', function(sampleStr) {

            // Loading the patch and abstraction
            Pd.registerAbstraction('sampleplayer', sampleStr)
            patch = Pd.loadPatch(patchStr)
            Pd.start()
          })
        })

        //the set frequency form function
        $('form').submit(function(event) {
        event.preventDefault()
        Pd.send('frequency', [parseFloat($('#frequency').val())])
        })

        $('form').submit(function(event) {
        event.preventDefault()
        Pd.send('bpm', [parseFloat($('#bpm').val())])
        })

        //the recieve echo from pd function
        Pd.receive('echo', function(args) {
        console.log('echo : ', args)
        });
        //the receive the tick

        Pd.receive('tick', function(args) {
        // console.log('received a message from "freqBounce" : ', args)
        //  document.getElementById('freqBounceTxt').innerHTML = args;
          var track1_btns = $(".track1");
          var track2_btns = $(".track2");
          var track3_btns = $(".track3");
          var track4_btns = $(".track4");
          //var all_short_btns = $(".Short");
          //check th sequence for a trigger
          for(x = 0; x<4;x++){
              if(sequence[x][parseFloat(args)] == 1){
                var trigger = 'noteTrigger'+x;
                Pd.send(trigger,[1]);
                //console.log('ping: '+trigger);
              }
          }
          //automate the button background color to refelct tick number
          for(i = 0; i<16; i++){
              if(parseFloat(args)+1== track1_btns[i].value){
                // console.log('ping: ', args);
                track1_btns[i].style.background='#FFF000';

                  }else if(sequence[0][i]==1){
                    track1_btns[i].style.background='#F00000';
                  }else{
                    track1_btns[i].style.background='#FFFFFF';
                  }

              if(parseFloat(args)+1== track2_btns[i].value){
                // console.log('ping: ', args);
                track2_btns[i].style.background='#FFF000';

                  }else if(sequence[1][i]==1){
                    track2_btns[i].style.background='#F00000';
                  }else{
                    track2_btns[i].style.background='#FFFFFF';
                  }
              if(parseFloat(args)+1== track3_btns[i].value){
                // console.log('ping: ', args);
                track3_btns[i].style.background='#FFF000';

                  }else if(sequence[2][i]==1){
                    track3_btns[i].style.background='#F00000';
                  }else{
                    track3_btns[i].style.background='#FFFFFF';
                  }
              if(parseFloat(args)+1== track4_btns[i].value){
                // console.log('ping: ', args);
                track4_btns[i].style.background='#FFF000';

                }else if(sequence[3][i]==1){
                    track4_btns[i].style.background='#F00000';
                  }else{
                    track4_btns[i].style.background='#FFFFFF';
                  }

          }

        });

        //button press function

        (function() {
            'use strict'
            var track1_btns = $(".track1");
            track1_btns.click(function(){
                var value = $(this).val();
                //alert(value);
                if(sequence[0][parseFloat(value)-1]==0){
                sequence[0][parseFloat(value)-1]=1;
                //console.log('button pressed', value);
                track1_btns[value-1].style.background='#00FF00'
                }else{
                sequence[0][parseFloat(value)-1]=0;
                //console.log('button pressed', value);
                track1_btns[value-1].style.background='white'
                  }
            });

            var track2_btns = $(".track2");
            track2_btns.click(function(){
                var value = $(this).val();
                //alert(value);
                if(sequence[1][parseFloat(value)-1]==0){
                  sequence[1][parseFloat(value)-1]=1;
                  //console.log('button pressed', value);
                  track2_btns[value-1].style.background='#00FF00'
                }else{
                  sequence[1][parseFloat(value)-1]=0;
                  //console.log('button pressed', value);
                  track2_btns[value-1].style.background='white'
                }
            });

            var track3_btns = $(".track3");
            track3_btns.click(function(){
                var value = $(this).val();
                //alert(value);
                if(sequence[2][parseFloat(value)-1]==0){
                  sequence[2][parseFloat(value)-1]=1;
                  //console.log('button pressed', value);
                  track3_btns[value-1].style.background='#00FF00'
                }else{
                  sequence[2][parseFloat(value)-1]=0;
                  //console.log('button pressed', value);
                  track3_btns[value-1].style.background='white'
                }
            });

            var track4_btns = $(".track4");
            track4_btns.click(function(){
                var value = $(this).val();
                //alert(value);
                if(sequence[3][parseFloat(value)-1]==0){
                  sequence[3][parseFloat(value)-1]=1;
                  //console.log('button pressed', value);
                  track4_btns[value-1].style.background='#00FF00'
                }else{
                  sequence[3][parseFloat(value)-1]=0;
                  //console.log('button pressed', value);
                  track4_btns[value-1].style.background='white'
                }
            });
        }());


        //play button on click
        let isPlaying = true;
        $(".playBtn").on('click','img',function(){
            if(isPlaying){
                $('.playBtnImg').attr('src', './assets/images/play.png');
                isPlaying = false;
                Pd.send('play', [0]);
            }else{
                isPlaying = true;
                $('.playBtnImg').attr('src', './assets/images/pause.png');
                Pd.send('play',  [1]);
            }
        });


        //the volume slider function
        $( '.sldr' ).slider({
          change: function( event, ui ) {
            // console.log('slider '+ui.value);
            // console.log('track'+$(this).attr('track'));
            Pd.send($(this).attr('track')+'-volume', [ui.value]);
          }
          });



//begin analyzer code
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        ///var audioCtx = Pd.getAudio();
      //  var analyser1; // = audioCtx.createAnalyser();
        //var audioCtx2 = ;
      //  var analyser2;

        // analyser.minDecibels = -90;
        // analyser.maxDecibels = -10;
        // analyser.smoothingTimeConstant = 0.85;

        if (navigator.getUserMedia) {
          console.log('getUserMedia supported.');
          navigator.getUserMedia (
      // constraints - only audio needed for this app
         {
             audio: true
          },

              // Success callback
              function(stream) {
                 source = audioCtx.createMediaStreamSource(stream);

                 gain1 = Pd.getAudio().context.createGain();
                 gain2 = Pd.getAudio().context.createGain();
                 gain3 = Pd.getAudio().context.createGain();
                 gain4 = Pd.getAudio().context.createGain();

                 analyser1 = Pd.getAudio().context.createAnalyser();
                 analyser1.minDecibels = -110;

                 analyser2 = Pd.getAudio().context.createAnalyser();
                 analyser2.minDecibels = -110;

                 analyser3 = Pd.getAudio().context.createAnalyser();
                 analyser3.minDecibels = -110;

                 analyser4 = Pd.getAudio().context.createAnalyser();
                 analyser4.minDecibels = -110;
                // analyser2.maxDecibels = -10;
                // analyser2.smoothingTimeConstant = 0.85;


                //where and int .o(x) indicates which outlet~ from pd
                 patch.o(0).getOutNode().connect(gain1);
                 gain1.connect(analyser1);

                 patch.o(1).getOutNode().connect(gain2);
                 gain2.connect(analyser2);

                 patch.o(2).getOutNode().connect(gain3);
                 gain3.connect(analyser3);

                 patch.o(3).getOutNode().connect(gain4);
                 gain4.connect(analyser4);

                // source.connect(analyser);
                // analyser.connect(distortion);
                 //distortion.connect(biquadFilter);
                 //biquadFilter.connect(convolver);
                // convolver.connect(gainNode);
                // gainNode.connect(audioCtx.destination);

                //moved from visualize
                var canvas =  document.querySelector('.visualizer');
                var canvasCtx = canvas.getContext("2d");
                var intendedWidth = document.querySelector('.wrapper').clientWidth;

                 visualize(canvas, canvasCtx, intendedWidth, analyser1);

                 var canvas1 =  document.querySelector('.visualizer1');
                 var canvasCtx1 = canvas1.getContext("2d");
                 var intendedWidth1 = document.querySelector('.wrapper1').clientWidth;

                 visualize(canvas1, canvasCtx1, intendedWidth1, analyser2);

                 var canvas2 =  document.querySelector('.visualizer2');
                 var canvasCtx2 = canvas2.getContext("2d");
                 var intendedWidth2 = document.querySelector('.wrapper2').clientWidth;

                  visualize(canvas2, canvasCtx2, intendedWidth2, analyser3);

                  var canvas3 =  document.querySelector('.visualizer3');
                  var canvasCtx3 = canvas3.getContext("2d");
                  var intendedWidth3 = document.querySelector('.wrapper3').clientWidth;

                  visualize(canvas3, canvasCtx3, intendedWidth3, analyser4);

              },

              // Error callback
              function(err) {
                       console.log('The following gUM error occured: ' + err);
                    }
                 );
              } else {
                 console.log('getUserMedia not supported on your browser!');
              }


  function visualize(canvas, canvasCtx, intendedWidth, analyser) {
        var WIDTH = 100;
        var HEIGHT = 100;

        //let canvas = $('<canvas class="visualizer">');
        //$('#header-title').append(canvasDiv);


        canvas.setAttribute('width',intendedWidth);

        var drawVisual;

        analyser.fftSize = 2048;
        var bufferLength = analyser.fftSize;
        console.log(bufferLength);
        var dataArray = new Uint8Array(bufferLength);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        var draw = function() {

          drawVisual = requestAnimationFrame(draw);
          //dataArray = Pd.getAudio().getContext;
          analyser.getByteTimeDomainData(dataArray);

          canvasCtx.fillStyle = 'rgb(200, 200, 200)';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

          canvasCtx.beginPath();

          var sliceWidth = WIDTH * 1.0 / bufferLength;
          var x = 0;

          for(var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;

            if(i === 0) {
              canvasCtx.moveTo(x, y);
              } else {
              canvasCtx.lineTo(x, y);
              }

             x += sliceWidth;
            }

          canvasCtx.lineTo(WIDTH, HEIGHT/2);
          canvasCtx.stroke();
        };

    draw();

 }//end visualize


 }); //end on ready
