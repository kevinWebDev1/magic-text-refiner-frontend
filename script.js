// Server URL: https://refiner-web-backend.vercel.app
document.addEventListener("DOMContentLoaded", () => {
    const refineInput = document.getElementById("refine-input");
    const refineButton = document.getElementById("refine-button");
    const refineOutput = document.getElementById("refine-output");

    const chatInput = document.getElementById("chat-input");
    const chatButton = document.getElementById("chat-button");
    const chatOutput = document.getElementById("chat-output");

    const URL = "http://localhost:5000";
    // const URL = "https://refiner-web-backend.vercel.app";

    const loader = `<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>`;

    async function callRefine(text) {
        const start = Date.now();
        try {
            const res = await fetch(`${URL}/refine`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            const data = await res.json();
            const time = ((Date.now() - start) / 1000).toFixed(2);

            if (data.error) return { text: "❌ " + data.error, time };

            return { text: data.refinedText, time };
        } catch (err) {
            const time = ((Date.now() - start) / 1000).toFixed(2);
            return { text: "❌ " + err.message, time };
        }
    }

    async function callChat(text) {
        const start = Date.now();
        try {
            const res = await fetch(`${URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            const data = await res.json();
            const time = ((Date.now() - start) / 1000).toFixed(2);

            if (data.error) return { text: "❌ " + data.error, time };

            return { text: data.chatText, time };
        } catch (err) {
            const time = ((Date.now() - start) / 1000).toFixed(2);
            return { text: "❌ " + err.message, time };
        }
    }

    // ----------------------- REFINE BUTTON -----------------------
    refineButton.addEventListener("click", async () => {
        const text = refineInput.value.trim();
        if (!text) {
            refineOutput.innerHTML = `<i>Enter text to refine.</i>`;
            return;
        }

        refineOutput.innerHTML = loader;

        const result = await callRefine(text);

        refineOutput.innerHTML =
            `${result.text}<br><span class="text-gray-500 text-sm">Response time: ${result.time}s</span>`;
    });

    // ----------------------- CHAT BUTTON -----------------------
    chatButton.addEventListener("click", async () => {
        const text = chatInput.value.trim();
        if (!text) {
            chatOutput.innerHTML = `<i>Enter something to chat.</i>`;
            return;
        }

        chatOutput.innerHTML = loader;

        const result = await callChat(text);

        chatOutput.innerHTML =
            `${result.text}<br><span class="text-gray-500 text-sm">Response time: ${result.time}s</span>`;
    });
});
