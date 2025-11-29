document.addEventListener('DOMContentLoaded', () => {
  const refineInput = document.getElementById('refine-input');
  const refineButton = document.getElementById('refine-button');
  const refineOutput = document.getElementById('refine-output');

  const chatInput = document.getElementById('chat-input');
  const chatButton = document.getElementById('chat-button');
  const chatOutput = document.getElementById('chat-output');

  const BYTEZ_API_KEY = "f416c90e373d70cf2112b8ad52b6b556";
  const BYTEZ_BASE = "https://api.bytez.com/models/v2";

  // Example model IDs — you can change as needed
  const REFINE_MODEL = "openai-community/gpt2";      // simple text-generation for refining
  const CHAT_MODEL   = "openai-community/gpt2";      // or any chat-capable model

  // Utility: call Bytez for text generation
  async function callTextModel(modelId, inputText) {
    const url = `${BYTEZ_BASE}/${modelId}`;
    const payload = {
      text: inputText,
      stream: false,
      params: { max_length: 200, temperature: 0.7 }
    };
    const resp = await axios.post(url, payload, {
      headers: {
        "Authorization": `Key ${BYTEZ_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    return resp.data.output || "";
  }

  // Utility: call Bytez for chat-style model (messages)
  async function callChatModel(modelId, userMessage) {
    const url = `${BYTEZ_BASE}/${modelId}`;
    const payload = {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage }
      ],
      stream: false,
      params: { max_tokens: 150, temperature: 0.7 }
    };
    const resp = await axios.post(url, payload, {
      headers: {
        "Authorization": `Key ${BYTEZ_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    // Bytez may return output directly or choices — handle both
    return resp.data.output
      || (resp.data.choices && resp.data.choices[0].message.content)
      || "";
  }

  refineButton.addEventListener('click', async () => {
    const userText = refineInput.value;
    if (!userText || typeof userText !== "string") {
      refineOutput.innerHTML = '<p class="text-gray-500 italic">Please enter some text to refine.</p>';
      return;
    }
    refineOutput.innerHTML = `<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-blue-600" role="status">
      <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0">Loading...</span>
    </div>`;
    try {
      const refined = await callTextModel(REFINE_MODEL, userText);
      refineOutput.innerText = refined;
    } catch (err) {
      console.error("Bytez refine failed:", err);
      refineOutput.innerText = `Error: ${err.message || "Failed to get a response from Bytez API."}`;
    }
  });

  chatButton.addEventListener('click', async () => {
    const userText = chatInput.value;
    if (!userText) {
      chatOutput.innerHTML = '<p class="text-gray-500 italic">Please enter a message to chat.</p>';
      return;
    }
    chatOutput.innerHTML = `<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-green-600" role="status">
      <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0">Loading...</span>
    </div>`;
    try {
      const reply = await callChatModel(CHAT_MODEL, userText);
      chatOutput.innerText = reply;
    } catch (err) {
      console.error("Bytez chat failed:", err);
      chatOutput.innerText = `Error: ${err.message || "Failed to get a response from Bytez API."}`;
    }
  });
});
