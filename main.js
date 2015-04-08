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
      setTimeout(function () {
        background.drawImage(video, 0, 0);
        backgroundData = background.getImageData(0, 0, 640, 480);
        setInterval(detect, 100);
      }, 3000);
    }, function(error) {
      alert(error.name || error);
    });
  }

  function detect () {
    hidden.drawImage(video, 0, 0);
    hiddenData = hidden.getImageData(0, 0, 640, 480);
    currentData = current.createImageData(640, 480);
    var dots = [];
    var unset = true;
    var start = end = 0;
    for (var i = 0; i < 480; i++) {
      for (var j = 0; j < 640; j++) {
        var k = 4 * (640 * i + j);
        currentData.data[k + 0] = 255;
        currentData.data[k + 1] = 255;
        currentData.data[k + 2] = 255;
        currentData.data[k + 3] = 255;
        if (Math.abs(hiddenData.data[k + 0] - backgroundData.data[k + 0]) > 50 &&
          Math.abs(hiddenData.data[k + 1] - backgroundData.data[k + 1]) > 50 &&
          Math.abs(hiddenData.data[k + 2] - backgroundData.data[k + 2]) > 50) {
          if (unset) {
            start = k;
            unset = false;
          }
        } else {
          if (!unset) {
            end = k;
            unset = true;
            if (Math.abs(end - start) > 200) {
              dots.push({r : start + 0, g : start + 1, b : start + 2});
              dots.push({r : end + 0, g : end + 1, b : end + 2});
            }
            start = end = 0;
          }
        }
      }
    }
    for (var i in dots) {
      var dot = dots[i];
      currentData.data[dot.r] = 0;
      currentData.data[dot.g] = 255;
      currentData.data[dot.b] = 0;
      currentData.data[dot.r - 4] = 0;
      currentData.data[dot.g - 4] = 255;
      currentData.data[dot.b - 4] = 0;
      currentData.data[dot.r - 8] = 0;
      currentData.data[dot.g - 8] = 255;
      currentData.data[dot.b - 8] = 0;
    }
    current.putImageData(currentData, 0, 0);
  }

})();