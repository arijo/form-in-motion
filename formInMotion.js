function formInMotion(formComponentsSelector, svgSelector, options = {}) {
    const formComponents = document.querySelector(formComponentsSelector);
    const formSVG = document.getElementById(svgSelector);
    const formContent = formComponents.parentElement;
    const formTitle = formContent.querySelector("h2");

    const defaultOptions = {
        duration: 500,
        stroke: 'lightgrey'
    };
    const mergedOptions = { ...defaultOptions, ...options };

    formComponents.style.opacity = 0;
    formTitle.style.color = mergedOptions.stroke;

    let currentAnimationIndex = 0;

    function animateFormElements() {
        if (currentAnimationIndex < formComponents.children.length) {
            const inputElement = formComponents.children[currentAnimationIndex];
            animateFormElement(inputElement);
        } else {
            formComponents.style.opacity = 1;
            formSVG.style.display = 'none';
            formTitle.style.color = 'black';
        }
    }

    function animateFormElement(inputElement) {
        const path = createPath(inputElement);
        const text = createText(inputElement, path);
        movida(path, text, inputElement.placeholder, mergedOptions.duration)
            .then(() => {
                currentAnimationIndex++;
                updateTextPosition(path, text);
                animateFormElements();
            });
    }

    function createPath(inputElement) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", createPathFromElement(inputElement, formContent));
        path.style.stroke = mergedOptions.stroke;
        path.style.fill = "none";
        formSVG.appendChild(path);
        return path;
    }

    function createText(inputElement, path) {
        const placeholderText = inputElement.placeholder;
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const pathBBox = path.getBBox(); 
        text.setAttribute("x", pathBBox.x + 10); 
        text.setAttribute("y", pathBBox.y + pathBBox.height / 2); 
        text.setAttribute("dominant-baseline", "central"); 
        text.style.fill = "black";
        text.style.stroke = "none";
        formSVG.appendChild(text);
        let textLength = text.getComputedTextLength();
        text.style.strokeDasharray = textLength;
        text.style.strokeDashoffset = textLength;

        const computedStyle = window.getComputedStyle(inputElement);
        text.style.fontFamily = computedStyle.getPropertyValue("font-family");
        text.style.fontSize = computedStyle.getPropertyValue("font-size");
        text.style.fill = mergedOptions.stroke;
        return text;
    }

    function createPathFromElement(element) {
        const rect = element.getBoundingClientRect();
        const formRect = formContent.getBoundingClientRect(); // Get form's bounding rectangle
        const x = rect.left - formRect.left; // Adjust for form position
        const y = rect.top - formRect.top;
        const width = rect.width;
        const height = rect.height;
        return `M${x},${y} h${width} v${height} h-${width} z`;
    }

    // Dynamically calculate and update text position
    function updateTextPosition(path, text) {
        const pathBBox = path.getBBox();
        text.setAttribute("y", pathBBox.y + pathBBox.height / 2); 
    }

    animateFormElements(); 
}
