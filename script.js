const inputFile = document.getElementById('inputFile');
const downloadBtn = document.getElementById('downloadBtn');
const previewImg = document.getElementById('previewImg');

let canvas, ctx, img;

inputFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewImg.src = reader.result;

    img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = reader.result;
    img.onload = () => {
      // Create canvas once image is loaded
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      canvas.width = 3840;
      canvas.height = 2160;

      let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
      let newWidth = img.width * ratio;
      let newHeight = img.height * ratio;
      let xOffset = (canvas.width - newWidth) / 2;
      let yOffset = (canvas.height - newHeight) / 2;

      ctx.fillStyle = '#fff'; // white background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
    };
  };
  reader.readAsDataURL(file);
});

downloadBtn.addEventListener('click', () => {
  if (!canvas) {
    alert('Please upload and wait for the image to load!');
    return;
  }

  canvas.toBlob((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '4k-image.png';

    // Append link to body to make sure it works
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, 'image/png', 1);
});
