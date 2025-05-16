const fileInput = document.getElementById('file-input');
const dropArea = document.getElementById('drop-area');
const previewImage = document.getElementById('preview-image');
const convertBtn = document.getElementById('convert-btn');
const downloadBtn = document.getElementById('download-btn');
const convertingText = document.getElementById('converting-text');

let originalImageFile = null;
let convertedBlob = null;

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  window.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

dropArea.addEventListener('dragover', () => dropArea.classList.add('highlight'));
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('highlight'));

dropArea.addEventListener('drop', e => {
  dropArea.classList.remove('highlight');
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    loadImage(e.dataTransfer.files[0]);
    e.dataTransfer.clearData();
  }
});

dropArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files.length > 0) {
    loadImage(fileInput.files[0]);
  }
});

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

downloadBtn.addEventListener('click', () => {
  if (!convertedBlob) return;

  const url = URL.createObjectURL(convertedBlob);

  // Detect Messenger in-app browser
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMessengerBrowser = /FBAN|FBAV|Messenger/i.test(userAgent);

  if (isMessengerBrowser) {
    // Open image in new tab for manual save
    window.open(url, '_blank');
  } else {
    // Normal download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-4k-image.png';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 1000);
  }
});
