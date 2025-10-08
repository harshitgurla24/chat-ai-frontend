const inputEl = document.getElementById('inputText');
const buttonEl = document.getElementById('submitButton');
const chatBox = document.getElementById('chatBox');

let chatHistory = [];

function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

buttonEl.addEventListener('click', async () => {
  const inputText = inputEl.value.trim();
  if (!inputText) return;

  addMessage(inputText, 'user');

  chatHistory.push({ role: "user", content: inputText });

  inputEl.value = "";

  const loadingMsg = document.createElement('div');
  loadingMsg.classList.add('message', 'ai');
  loadingMsg.textContent = "Just a sec...";
  chatBox.appendChild(loadingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory }),
    });
    const result = await response.json();
    chatBox.removeChild(loadingMsg);

    if (result && result.text) {
      addMessage(result.text, 'ai');
      chatHistory.push({ role: "assistant", content: result.text });
    } else {
      addMessage("No response from AI.", 'ai');
    }
  } catch (error) {
    chatBox.removeChild(loadingMsg);
    addMessage("Error connecting to server.", 'ai');
    console.error(error);
  }
});

inputEl.addEventListener('keydown', (e) => {
  if (e.key === "Enter") buttonEl.click();
});


