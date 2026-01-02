async function startScreenShare() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    document.getElementById("screenVideo").srcObject = stream;
  } catch (err) {
    console.error("Error sharing screen", err);
  }
}