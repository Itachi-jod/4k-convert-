const fileInput = document.getElementById('file-input');
const dropArea = document.getElementById('drop-area');
const previewImage = document.getElementById('preview-image');
const convertBtn = document.getElementById('convert-btn');
const downloadBtn = document.getElementById('download-btn');
const convertingText = document.getElementById('converting-text');

let originalImageFile = null;
let convertedBlob = null;

// Handle drag-and-drop
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
  if (e.dataTransfer.files.length > 0) {
    loadImage(e.dataTransfer.files[0]);
  }
});

dropArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    loadImage(fileInput.files[0]);
  }
});

function loadImage(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image.');
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

convertBtn.addEventListener('click', async () => {
  if (!originalImageFile) return;

  convertBtn.disabled = true;
  downloadBtn.disabled = true;
  convertingText.style.display = 'block';

  try {
    // Step 1: Upload to ImgBB
    const formData = new FormData();
    formData.append('image', originalImageFile);
    const imgbbKey = 'bb76aca183bff957183bcb5bceb9a891';
    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: 'POST',
      body: formData
    });
    const imgbbData = await imgbbRes.json();
    if (!imgbbData.success) throw new Error('Image upload failed.');

    const imgUrl = imgbbData.data.url;

    // Step 2: Send to upscaling API
    const upscaleUrl = `https://smfahim.xyz/4k?url=${encodeURIComponent(imgUrl)}`;
    const upscaleRes = await fetch(upscaleUrl);
    const upscaleBlob = await upscaleRes.blob();

    // Step 3: Show download button
    convertedBlob = upscaleBlob;
    downloadBtn.disabled = false;
    convertingText.style.display = 'none';
    convertBtn.disabled = false;
  } catch (err) {
    alert('Error: ' + err.message);
    convertingText.style.display = 'none';
    convertBtn.disabled = false;
  }
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
