function movida(path, text, placeholderText, duration = 500) {
    return new Promise((resolve) => { 
        let length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
  
        let textLength = text.getComputedTextLength();
        text.style.strokeDasharray = textLength;
        text.style.strokeDashoffset = textLength;
  
        let startTime = performance.now();
        let textIndex = 0; 
  
        function animate(currentTime) {
            let elapsed = currentTime - startTime;
            if (elapsed < 0) {
                requestAnimationFrame(animate);
                return;
            }
            let progress = Math.min(elapsed / duration, 1);
            path.style.strokeDashoffset = length * (1 - progress);
  
            // Reveal text character by character (with length check and placeholderText check)
            if (placeholderText && text.textContent.length < placeholderText.length) {
                textIndex = Math.ceil(progress * placeholderText.length);
                text.textContent = placeholderText.substring(0, textIndex);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve(); 
            }
        }
        requestAnimationFrame(animate);
    });
  }
