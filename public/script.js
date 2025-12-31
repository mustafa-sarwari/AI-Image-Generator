const themeToggle = document.querySelector(".theme-toggle");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");
const promptBtn = document.querySelector(".prompt-btn");
const generatetBtn = document.querySelector(".generate-btn");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");
 //hugging face API key (Warning: don't expose keys in client-side code)

const examplePrompts = [
    "A magic forest with glowing plants and fairy homes among giant mushrooms",
    "An old steampunk airship floating through golden clouds at sunset",
    "A future Mars colony with glass domes and gardens against red mountains",
    "A dragon sleeping on gold coins in a crystal cave",
    "An underwater kingdom with merpeople and glowing coral buildings",
    "A floating island with waterfalls pouring into clouds below",
    "A witch's cottage in fall with magic herbs in the garden",
    "A robot painting in a sunny studio with art supplies around it",
    "A magical library with floating glowing books and spiral staircases",
    "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
    "A cosmic beach with glowing sand and an aurora in the night sky",
    "A medieval marketplace with colorful tents and street performers",
    "A cyberpunk city with neon signs and flying cars at night",
    "A peaceful bamboo forest with a hidden ancient temple",
    "A giant turtle carrying a village on its back in the ocean",
];

//set theme based on saved preference or system default
(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    document.body.classList.toggle("dark-theme", isDarkTheme);
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
})();
//Switch between light and dark themes
const toggleTheme = () => {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// calculate width/ height based on chosen ratio
const getImageDimenstions = (aspectRatio, baseSize = 512) => {
     const [width, height] = aspectRatio.split("/").map(Number);
     
     //defining the image resolution
     if(width == 1 && height == 1) return {width: 512, height: 512};
     if(width == 16 && height == 9) return { width: 768, height: 432};
    if(width == 9 && height == 16) return { width: 432, height: 768};

     return {width: 512, height: 512};
}


// replace loading spinner with the actual image
const updateImageCards = (imgIndex, imgUrl) => {
    const imgCard = document.getElementById(`img-card-${imgIndex}`);
    if (!imgCard) return;

    imgCard.classList.remove("loading");
    imgCard.innerHTML = `
        <img src="${imgUrl}" class="result-img" alt="generated image" />
        <div class="img-overlay">
            <a href="${imgUrl}" class="img-download-btn" download="${Date.now()}.png">
                <i class="fa-solid fa-download"></i>
            </a>
        </div>
    `;
};

const generateImages = async (selectedMethod, imageCount, aspectRatio, promptText) => {
    // Use the Hugging Face inference API endpoint (client-side use requires a token and is not recommended for production)
    const MODEL_URL =`https://api-inference.huggingface.co/models/${selectedMethod}`;

const {width, height} = getImageDimenstions(aspectRatio);

//disbling the generate button if the requset is still being processed
generatetBtn.setAttribute("disabled", "true");

//creating an array of image generation promises
const imagePromises = Array.from({length: imageCount}, async(_, i) => {
    //send request to the AI model API
    try {
        const response =  await fetch('http://localhost:3000/api/generate-image', {
            
			method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
			body: JSON.stringify({
               model: selectedMethod,
               prompt: promptText,
               width,
               height,
               
               
                /* 
                inputs: promptText,
                parameters: { width, height},
                options: {wait_for_model: true, user_cache: false},
 */
                }),
        });

        if (!response.ok) {
            // try to get a helpful error message from the server
            let errText = `Status ${response.status}`;
            try {
                const jsonErr = await response.json();
                errText = jsonErr?.error || JSON.stringify(jsonErr);
            } catch (e) {
                try {
                    const txt = await response.text();
                    errText = txt || errText;
                } catch (e2) {
                    /* ignore */
                }
            }
            throw new Error(errText);
        }

        // Convert response to an image URL (handle binary blob or JSON with base64)
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const json = await response.json();

            // Try common locations for base64 image data returned by different HF endpoints
            let b64 = null;
            if (json?.data && Array.isArray(json.data) && typeof json.data[0] === "string") b64 = json.data[0];
            else if (json?.images && Array.isArray(json.images) && typeof json.images[0] === "string") b64 = json.images[0];
            else if (typeof json?.image === "string") b64 = json.image;
            else if (typeof json?.generated_image === "string") b64 = json.generated_image;
            else if (typeof json[0] === "string") b64 = json[0];

            if (b64) {
                const dataUrl = b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`;
                updateImageCards(i, dataUrl);
            } else {
                console.error("Unknown JSON response format:", json);
                throw new Error("No image data found in JSON response");
            }
        } else {
            const blob = await response.blob();
            updateImageCards(i, URL.createObjectURL(blob));
        }
    } catch (error) {
        console.log(error)

        const imgCard = document.getElementById(`img-card-${i}`);
        imgCard.classList.replace("loading", "error");
        imgCard.querySelector(".status-text").textContent = "Generation failed! Check console for more details."
    }
    })
    
    await Promise.allSettled(imagePromises);
    generatetBtn.removeAttribute("disabled")
}

const createImageCards = (selectedMethod, imageCount, aspectRatio, promptText) => {
gridGallery.innerHTML = "";

    for (let i = 0; i < imageCount; i++) {
        gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
                        <div class="status-container">
                            <div class="spinner"></div>
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p class="status-text">Generating...</p>

                        </div>

                    </div>`; 
    }

    generateImages(selectedMethod, imageCount, aspectRatio, promptText);
}



//handle from submation
const handleFormSubmit = (e) => {
    e.preventDefault();

    //get form value
    const selectedMethod = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    
    const aspectRatio = ratioSelect.value || "1/1";
    const promptText = promptInput.value.trim();

    createImageCards(selectedMethod, imageCount, aspectRatio, promptText)
}
 
//Fill prompt input with random example
promptBtn.addEventListener("click", () => {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value = prompt;
    promptInput.focus();
})

promptForm.addEventListener("submit", handleFormSubmit);

themeToggle.addEventListener("click", toggleTheme);