const fileInput = document.getElementById('file-input');
const dropArea = document.getElementById('drop-area');
const previewContainer = document.querySelector('.preview');
const previewImage = document.getElementById('preview-image');
const convertBtn = document.getElementById('convert-btn');
const downloadBtn = document.getElementById('download-btn');
const convertingText = document.getElementById('converting-text');

let originalImageFile = null;
let convertedBlob = null;

// Prevent default drag behaviors on whole window
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  window.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Highlight drop area on dragover
dropArea.addEventListener('dragover', () => {
  dropArea.classList.add('highlight');
});

// Remove highlight on dragleave or drop
dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('highlight');
});

dropArea.addEventListener('drop', e => {
  dropArea.classList.remove('highlight');
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    loadImage(e.dataTransfer.files[0]);
    e.dataTransfer.clearData();
  }
});

// Click on drop area triggers file input
dropArea.addEventListener('click', () => fileInput.click());

// Handle file selected via input
fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files.length > 0) {
    loadImage(fileInput.files[0]);
  }
});

// Load image & preview
function loadImage(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file.');
    return;
  }
  originalImageFile = file;

  const reader = new FileReader();
  reader.onload = e => {
    previewImage.src = e.target.result;
    previewContainer.style.display = 'block';
    convertBtn.disabled = false;
    downloadBtn.disabled = true;
    convertingText.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// Convert and enable download
convertBtn.addEventListener('click', () => {
  if (!originalImageFile) return;

  convertBtn.disabled = true;
  downloadBtn.disabled = true;
  convertingText.style.display = 'block';

  const img = new Image();
  img.onload = () => {
    // Create 4K canvas size (3840 x 2160)
    const canvas = document.createElement('canvas');
    canvas.width = 3840;
    canvas.height = 2160;

    const ctx = canvas.getContext('2d');

    // Calculate aspect ratio and fit image inside 4K canvas centered
    const aspectRatio = img.width / img.height;
    let drawWidth, drawHeight;

    if (3840 / 2160 > aspectRatio) {
      // canvas wider ratio than image
      drawHeight = 2160;
      drawWidth = drawHeight * aspectRatio;
    } else {
      drawWidth = 3840;
      drawHeight = drawWidth / aspectRatio;
    }

    const dx = (3840 - drawWidth) / 2;
    const dy = (2160 - drawHeight) / 2;

    ctx.fillStyle = '#fff'; // white background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

    canvas.toBlob(blob => {
      convertedBlob = blob;
      downloadBtn.disabled = false;
      convertingText.style.display = 'none';
      convertBtn.disabled = false;
    }, 'image/png', 1);
  };
  img.src = URL.createObjectURL(originalImageFile);
});

downloadBtn.addEventListener('click', () => {
  if (!convertedBlob) return;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(convertedBlob);
  link.download = 'converted-4k-image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
