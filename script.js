document.getElementById('upload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate new image size and center it
      const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      const x = (canvasWidth - newWidth) / 2;
      const y = (canvasHeight - newHeight) / 2;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, x, y, newWidth, newHeight);

      document.getElementById('canvas').classList.remove('hidden');
      const downloadLink = document.getElementById('download');
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.classList.remove('hidden');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});
