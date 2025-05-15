const inputFile = document.getElementById('inputFile');
const downloadBtn = document.getElementById('downloadBtn');
const previewImg = document.getElementById('previewImg');

inputFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewImg.src = reader.result;
  };
  reader.readAsDataURL(file);
});

downloadBtn.addEventListener('click', () => {
  if (!previewImg.src) {
    alert('Please upload an image first!');
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size for 4K resolution
  canvas.width = 3840;
  canvas.height = 2160;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = previewImg.src;

  img.onload = () => {
    // Calculate aspect ratio and draw image centered & resized
    let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    let newWidth = img.width * ratio;
    let newHeight = img.height * ratio;
    let xOffset = (canvas.width - newWidth) / 2;
    let yOffset = (canvas.height - newHeight) / 2;

    ctx.fillStyle = '#fff'; // optional: white background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);

    canvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'converted-4k-image.png';
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png', 1);
  };
});
