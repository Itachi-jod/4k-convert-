const fileInput = document.getElementById('file-input');
const dropArea = document.getElementById('drop-area');
const previewContainer = document.querySelector('.preview');
const previewImage = document.getElementById('preview-image');
const convertBtn = document.getElementById('convert-btn');
const downloadBtn = document.getElementById('download-btn');
const convertingText = document.getElementById('converting-text');

let originalImageFile = null;
let convertedBlob = null;

// Open file dialog when drop area clicked
dropArea.addEventListener('click', () => {
  fileInput.click();
});

// Handle file input change
fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    loadImage(e.target.files[0]);
  }
});

// Handle drag & drop
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
});

dropArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = 'transparent';
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = 'transparent';
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    loadImage(e.dataTransfer.files[0]);
  }
});

// Load image and show preview
function loadImage(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please upload a valid image file!');
    return;
  }
  originalImageFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewContainer.style.display = 'block';
    convertBtn.disabled = false;
    downloadBtn.disabled = true;
    convertingText.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// Simulate convert to 4K (just resave the image in this example)
convertBtn.addEventListener('click', () => {
  if (!originalImageFile) return;

  convertBtn.disabled = true;
  downloadBtn.disabled = true;
  convertingText.style.display = 'block';

  // Use canvas to redraw image at same resolution
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');

    // For real 4K, we'd upscale to 3840x2160 or similar.
    // Here we keep original resolution to simulate.
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob for download
    canvas.toBlob((blob) => {
      convertedBlob = blob;
      downloadBtn.disabled = false;
      convertingText.style.display = 'none';
      convertBtn.disabled = false;
    }, 'image/png', 1);
  };
  img.src = URL.createObjectURL(originalImageFile);
});

// Download the converted image
downloadBtn.addEventListener('click', () => {
  if (!convertedBlob) return;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(convertedBlob);
  link.download = 'converted-4k-image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
