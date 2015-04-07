(function () {

  init();

  var video, background, current, hidden;
  var backgroundData, currentData, hiddenData;

  function init () {
    video = document.getElementById('video');
    background = document.getElementById('background').getContext('2d');
    current = document.getElementById('current').getContext('2d');
    hidden = document.getElementById('hidden').getContext('2d');
    range = document.getElementById('range');
    navigator.getUserMedia = navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia;
    navigator.getUserMedia({
      video: true
    }, function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
      capture();

    }, function(error) {
      alert(error.name || error);
    });
  }

  function capture () {
    // setTimeout(function () {
    //   background.drawImage(video, 0, 0);
    //   backgroundData = background.getImageData(0, 0, 640, 480);
    //   setInterval(detect, 100);
    // }, 3000);
    setInterval(function () {
      effect();
    }, 100);
  }

  function effect () {
    background.drawImage(video, 0, 0);
    backgroundData = background.getImageData(0, 0, 640, 480);
    currentData = current.createImageData(640, 480);
    for (var j = 0; j < 480; j++) {
      for (var i = 0; i < 640; i++) {
        var k = 4 * (640 * j + i);
        // currentData.data[k + 0] = backgroundData.data[k + 0] > 127 ? 255 : 0;
        // currentData.data[k + 1] = backgroundData.data[k + 1] > 127 ? 255 : 0;
        // currentData.data[k + 2] = backgroundData.data[k + 2] > 127 ? 255 : 0;
        if (backgroundData.data[k + 0] > 90 ||
          backgroundData.data[k + 1] > 90 ||
          backgroundData.data[k + 2] > 90) {
          currentData.data[k + 0] = 255;
          currentData.data[k + 1] = 255;
          currentData.data[k + 2] = 255;
        } else {
          currentData.data[k + 0] = 0;
          currentData.data[k + 1] = 0;
          currentData.data[k + 2] = 0;
        }
        currentData.data[k + 3] = 255;
      }
    }
    current.putImageData(currentData, 0, 0);
  }

  function detect () {
    hidden.drawImage(video, 0, 0);
    hiddenData = hidden.getImageData(0, 0, 640, 480);
    currentData = current.createImageData(640, 480);
    var flag = true;
    for (var j = 0; j < 480; j++) {
      for (var i = 0; i < 640; i++) {
        var k = 4 * (640 * j + i);
        currentData.data[k + 0] = hiddenData.data[k + 0];
        currentData.data[k + 1] = hiddenData.data[k + 1];
        currentData.data[k + 2] = hiddenData.data[k + 2];
        currentData.data[k + 3] = 255;
        if (Math.abs(hiddenData.data[k + 0] - backgroundData.data[k + 0]) > 40 &&
          Math.abs(hiddenData.data[k + 1] - backgroundData.data[k + 1]) > 40 &&
          Math.abs(hiddenData.data[k + 2] - backgroundData.data[k + 2]) > 40) {
          if (flag) {
            currentData.data[k + 0 - 4] = currentData.data[k + 0 - 8] = 0;
            currentData.data[k + 1 - 4] = currentData.data[k + 1 - 8] = 255;
            currentData.data[k + 2 - 4] = currentData.data[k + 2 - 8] = 0;
            flag = false;
          }
        } else {
          if (!flag) {
            currentData.data[k + 0 - 4] = currentData.data[k + 0 - 8] = 0;
            currentData.data[k + 1 - 4] = currentData.data[k + 1 - 8] = 255;
            currentData.data[k + 2 - 4] = currentData.data[k + 2 - 8] = 0;
            flag = true;
          }
        }
      }
    }
    current.putImageData(currentData, 0, 0);
  }

})();