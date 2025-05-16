const fileInput = document.getElementById('file-input');
const dropArea = document.getElementById('drop-area');
const previewImage = document.getElementById('preview-image');
const convertBtn = document.getElementById('convert-btn');
const downloadBtn = document.getElementById('download-btn');
const convertingText = document.getElementById('converting-text');

let originalImageFile = null;
let convertedBlob = null;

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  window.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Highlight drop area on dragover
dropArea.addEventListener('dragover', () => dropArea.classList.add('highlight'));
// Remove highlight on dragleave
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('highlight'));

// Handle drop event
dropArea.addEventListener('drop', e => {
  dropArea.classList.remove('highlight');
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    loadImage(e.dataTransfer.files[0]);
    e.dataTransfer.clearData();
  }
});

// Click on drop area triggers file input
dropArea.addEventListener('click', () => fileInput.click());

// Handle file input change
fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files.length > 0) {
    loadImage(fileInput.files[0]);
  }
});

// Load and preview image
function loadImage(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file.');
    return;
  }
  originalImageFile = file;

  const reader = new FileReader();
  reader.onload = e => {
    previewImage.src = e.target.result;
    previewImage.style.display = 'block';
    convertBtn.disabled = false;
    downloadBtn.disabled = true;
    convertingText.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// Convert image to 4K with cropping to cover
convertBtn.addEventListener('click', () => {
  if (!originalImageFile) return;

  convertBtn.disabled = true;
  downloadBtn.disabled = true;
  convertingText.style.display = 'block';

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 3840;
    canvas.height = 2160;
    const ctx = canvas.getContext('2d');

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let sx, sy, sWidth, sHeight;

    if (imgRatio > canvasRatio) {
      sHeight = img.height;
      sWidth = sHeight * canvasRatio;
      sx = (img.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = img.width;
      sHeight = sWidth / canvasRatio;
      sx = 0;
      sy = (img.height - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      convertedBlob = blob;
      downloadBtn.disabled = false;
      convertingText.style.display = 'none';
      convertBtn.disabled = false;
    }, 'image/png', 1);
  };
  img.src = URL.createObjectURL(originalImageFile);
});

// Download converted 4K image
downloadBtn.addEventListener('click', () => {
  if (!convertedBlob) return;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(convertedBlob);
  link.download = 'converted-4k-image.png';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, 100);
});
