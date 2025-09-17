
const refineBtn = document.getElementById("refineBtn");
const chatBtn = document.getElementById("chatBtn");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const errorTextEl = document.getElementById("errorText");
const outputEl = document.getElementById("output");
const outputContainer = document.getElementById("outputContainer");
const inputTextEl = document.getElementById("inputText");
const charCountEl = document.getElementById("charCount");
const copyMessageEl = document.getElementById("copyMessage");

// Character counter
inputTextEl.addEventListener("input", () => {
    const count = inputTextEl.value.length;
    charCountEl.textContent = count;

    if (count > 2000) {
        charCountEl.style.color = "var(--error-color)";
    } else {
        charCountEl.style.color = "#666";
    }
});

async function refineText() {
    const input = inputTextEl.value.trim();

    if (!input) {
        showError("Please enter some text first!");
        return;
    }

    if (input.length > 2000) {
        showError("Text is too long (max 2000 characters)");
        return;
    }

    // Clear previous error & hide output
    clearError();
    outputContainer.style.display = "none";

    // Show loading state
    refineBtn.disabled = true;
    loadingEl.style.display = "block";

    try {
        const response = await fetch("https://refiner-backend.vercel.app/refine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        let refinedText = data.refinedText;

        // Use regex to extract content inside \boxed{...}
        // const match = refinedText.match(/\\boxed\s*{([^}]*)}/);
        // if (match) {
        //     refinedText = match[1]; // Extracted text inside \boxed{}
        //     console.log(refinedText)
        // }

        outputEl.textContent = refinedText;
        outputContainer.style.display = "block";


    } catch (err) {
        showError("Failed to refine text. Please try again.");
        console.error("Refinement error:", err);
    } finally {
        refineBtn.disabled = false;
        loadingEl.style.display = "none";
    }
}
async function chatText() {
    const input = inputTextEl.value.trim();

    if (!input) {
        showError("Please enter some text first!");
        return;
    }

    if (input.length > 2000) {
        showError("Text is too long (max 2000 characters)");
        return;
    }

    // Clear previous error & hide output
    clearError();
    outputContainer.style.display = "none";

    // Show loading state
    chatBtn.disabled = true;
    loadingEl.style.display = "block";

    try {
        const response = await fetch("https://refiner-backend.vercel.app/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        let chatText = data.chatText;

        outputEl.textContent = chatText;
        outputContainer.style.display = "block";


    } catch (err) {
        showError("Failed to chat. Please try again.");
        console.error("Chat error:", err);
    } finally {
        chatBtn.disabled = false;
        loadingEl.style.display = "none";
    }
}

function showError(message) {
    errorTextEl.textContent = message;
    errorEl.style.display = "flex";
}

function clearError() {
    errorEl.style.display = "none";
}

async function copyText() {
    try {
        await navigator.clipboard.writeText(outputEl.textContent);
        copyMessageEl.classList.add("show");
        setTimeout(() => {
            copyMessageEl.classList.remove("show");
        }, 2000);
    } catch (err) {
        showError("Failed to copy text");
        console.error("Copy error:", err);
    }
}

// Initialize
clearError();
