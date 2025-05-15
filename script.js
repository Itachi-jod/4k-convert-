const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('download');
const container = document.querySelector('.container');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return alert("Please upload a valid image.");

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const upscaleWidth = 3840; // 4K Width
      const upscaleHeight = 2160; // 4K Height

      // Set canvas size
      canvas.width = upscaleWidth;
      canvas.height = upscaleHeight;

      // Draw the image scaled
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, upscaleWidth, upscaleHeight);

      canvas.classList.remove('hidden');
      downloadBtn.classList.remove('hidden');
      downloadBtn.href = canvas.toDataURL('image/jpeg');
      downloadBtn.download = 'enhanced-4k.jpg';

      showConfetti();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function showConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = 0;
  confettiContainer.style.left = 0;
  confettiContainer.style.width = '100%';
  confettiContainer.style.height = '100%';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = 9999;
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `${Math.random() * -20}%`;
    confetti.style.opacity = 0.9;
    confetti.style.animation = `fall ${3 + Math.random() * 2}s ease-out infinite`;
    confettiContainer.appendChild(confetti);
  }
}
