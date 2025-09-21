document.addEventListener('DOMContentLoaded', () => {

    // Refine Text elements
    const refineInput = document.getElementById('refine-input');
    const refineButton = document.getElementById('refine-button');
    const refineOutput = document.getElementById('refine-output');

    // Chat elements
    const chatInput = document.getElementById('chat-input');
    const chatButton = document.getElementById('chat-button');
    const chatOutput = document.getElementById('chat-output');

    const SERVER_URL = "https://refiner-backend.vercel.app";
    // const LOCAL_SERVER_URL = "http://localhost:5000";

    // Utility function to handle POST REQUEST

    const refineFunction = async (userInput) => {
        try {
            const response = await axios.post(`${SERVER_URL}/refine`, { text: userInput });

            const refinedText = response.data.refinedText || "";

            refineOutput.innerText = refinedText;
        } catch (error) {
            console.error('API call failed:', error);
            refineOutput.innerText = `Error: ${error.message || 'Failed to get a response from the API.'}`;
        }
    };


    const chatFunction = async (userInput) => {
        try {
            const response = await axios.post(`${SERVER_URL}/chat`, { text: userInput });

            const chatResponse = response.data.chatReply || "";

            chatOutput.innerText = chatResponse;
        } catch (error) {
            console.error('API call failed:', error);
            chatOutput.innerText = `Error: ${error.message || 'Failed to get a response from the API.'}`;
        }
    };

    // Event listener for Refine button
    refineButton.addEventListener('click', () => {
        const userText = refineInput.value;
        console.log("userText ::>", userText);
        if (!userText || typeof userText !== "string") {
            refineOutput.innerHTML = '<p class="text-gray-500 italic">Please enter some text to refine.</p>';
            return;
        }
        refineOutput.innerHTML =  `<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-600 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
  <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
</div>`;
        refineFunction(userText);
    });

    // Event listener for Chat button
    chatButton.addEventListener('click', () => {
        const userText = chatInput.value;
        if (!userText) {
            chatOutput.innerHTML = '<p class="text-gray-500 italic">Please enter a message to chat.</p>';
            return;
        }
        chatOutput.innerHTML = `<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-600 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
  <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
</div>`;

        chatFunction(userText);
    });
});





















