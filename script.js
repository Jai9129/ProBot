document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const imagePreview = document.getElementById('imagePreview');
    const qualitySelect = document.getElementById('quality');

    // Handle file upload button click
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', handleFiles);

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2196f3';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ccc';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ccc';
        const files = e.dataTransfer.files;
        handleFiles({ target: { files } });
    });

    function handleFiles(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (!file.type.match('image.*')) {
                alert('Please upload only image files (JPEG or PNG)');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const quality = parseFloat(qualitySelect.value);
                compressImage(file, quality, e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    function compressImage(file, quality, originalDataUrl) {
        new Compressor(file, {
            quality: quality,
            success(result) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';

                // Create preview image
                const img = document.createElement('img');
                img.src = URL.createObjectURL(result);
                previewItem.appendChild(img);

                // Add file information
                const info = document.createElement('div');
                info.className = 'image-info';
                info.innerHTML = `
                    Original Size: ${(file.size / 1024).toFixed(2)} KB<br>
                    Compressed Size: ${(result.size / 1024).toFixed(2)} KB<br>
                    Compression Ratio: ${((1 - result.size / file.size) * 100).toFixed(1)}%
                `;
                previewItem.appendChild(info);

                // Add download button
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'download-btn';
                downloadBtn.textContent = 'Download';
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(result);
                    link.download = `compressed_${file.name}`;
                    link.click();
                };
                previewItem.appendChild(downloadBtn);

                imagePreview.insertBefore(previewItem, imagePreview.firstChild);
            },
            error(err) {
                console.error('Compression failed:', err.message);
                alert('Error compressing image. Please try again.');
            }
        });
    }
});