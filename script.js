async function setupWebcam() {
  const params = new URLSearchParams(window.location.search);
  let width, height;

  switch (params.get('resolution')) {
    case '4K':
      width = 3840;
      height = 2160;
      break;
    case '1080p':
      width = 1920;
      height = 1080;
      break;
    case '720p':
      width = 1280;
      height = 720;
      break;
    case '480p':
      width = 854;
      height = 480;
      break;
    default:
      width = 3840;
      height = 2160;
  }

  const constraints = {
    video: {
      width: { ideal: width },
      height: { ideal: height }
    }
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const videoEl = document.getElementById('webcam');
    videoEl.srcObject = stream;

    videoEl.onloadedmetadata = () => {
      videoEl.play();
    };
  } catch (error) {
    console.error('Error accessing the webcam', error);
  }
}


function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) { /* Firefox */
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { /* IE/Edge */
    element.msRequestFullscreen();
  }
}

setupWebcam().then(() => {
  const fullscreenEl = document.getElementById('fullscreen');
  const videoEl = document.getElementById('webcam');

  fullscreenEl.addEventListener('click', () => {
    enterFullscreen(videoEl);
  });
});

