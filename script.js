let stream;

async function setupWebcam(deviceId = null) {
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

  if (deviceId) {
    constraints.video.deviceId = { exact: deviceId };
  }

  try {
    if (stream) {
      const track = stream.getVideoTracks()[0]
      track.stop();
    }

    stream = await navigator.mediaDevices.getUserMedia(constraints);

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
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

async function updateDeviceList() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoInputDevices = devices.filter(device => device.kind === 'videoinput');

  const deviceSelector = document.getElementById('devices');
  deviceSelector.innerHTML = '';

  videoInputDevices.forEach(device => {
    const option = document.createElement('option');
    option.value = device.deviceId;
    option.text = device.label || `Camera ${deviceSelector.length + 1}`;
    deviceSelector.appendChild(option);
  });

  // Attach an event listener for device changes
  deviceSelector.onchange = async () => {
    const selectedDeviceId = deviceSelector.value;
    await setupWebcam(selectedDeviceId);
  };
}

navigator.mediaDevices.ondevicechange = () => updateDeviceList();


setupWebcam().then(() => {
  updateDeviceList();

  const fullscreenEl = document.getElementById('fullscreen');
  const videoEl = document.getElementById('webcam');

  fullscreenEl.addEventListener('click', () => {
    enterFullscreen(videoEl);
  });
});

