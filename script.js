/* =========================================================
   FOODIE AI - CHATBOT JAVASCRIPT
   Connects Frontend with Flask Backend
   ========================================================= */

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

async function sendMessage() {
	const message = userInput.value.trim();
	if (message === "") return;

	addUserMessage(message);
	userInput.value = "";
	showTyping();
	sendButton.disabled = true;

	try {
		const response = await fetch("/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message })
		});

		if (!response.ok) throw new Error("Server error");
		const data = await response.json();
		removeTyping();
		addBotMessage(data.answer);
	} catch (error) {
		console.error("Error:", error);
		removeTyping();
		addBotMessage("Sorry 😔 Something went wrong. Please try again.");
	} finally {
		sendButton.disabled = false;
		userInput.focus();
	}
}

function addUserMessage(message) {
	const messageRow = document.createElement("div");
	messageRow.className = "message-row user-row";
	messageRow.innerHTML = `
		<div class="avatar user-avatar"><i class="fa-solid fa-user"></i></div>
		<div class="message-content user-content">
			<div class="message-name">You</div>
			<div class="message user-message"><p>${escapeHTML(message)}</p></div>
		</div>`;
	chatBox.appendChild(messageRow);
	scrollToBottom();
}

function addBotMessage(message) {
	const messageRow = document.createElement("div");
	messageRow.className = "message-row bot-row";
	messageRow.innerHTML = `
		<div class="avatar bot-avatar"><i class="fa-solid fa-robot"></i></div>
		<div class="message-content">
			<div class="message-name">Foodie AI</div>
			<div class="message bot-message"><p>${formatAIResponse(message)}</p></div>
		</div>`;
	chatBox.appendChild(messageRow);
	scrollToBottom();
}

function showTyping() {
	if (document.getElementById("typing-indicator")) return;
	const typingRow = document.createElement("div");
	typingRow.id = "typing-indicator";
	typingRow.className = "message-row bot-row";
	typingRow.innerHTML = `
		<div class="avatar bot-avatar"><i class="fa-solid fa-robot"></i></div>
		<div class="message-content">
			<div class="message-name">Foodie AI</div>
			<div class="message bot-message typing-message">
				<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
			</div>
		</div>`;
	chatBox.appendChild(typingRow);
	scrollToBottom();
}

function removeTyping() {
	document.getElementById("typing-indicator")?.remove();
}

function askSuggestion(question) {
	userInput.value = question;
	sendMessage();
}

function clearChat() {
	chatBox.innerHTML = `
		<div class="message-row bot-row">
			<div class="avatar bot-avatar"><i class="fa-solid fa-robot"></i></div>
			<div class="message-content">
				<div class="message-name">Foodie AI</div>
				<div class="message bot-message">
					<p>Welcome back! 👋</p><p>What would you like to eat today? 🍕🍔🍰</p>
				</div>
			</div>
		</div>`;
	userInput.focus();
}

userInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
		sendMessage();
	}
});

function scrollToBottom() {
	chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
}

function formatAIResponse(text) {
	if (!text) return "Sorry, I couldn't find an answer.";
	return escapeHTML(String(text))
		.replace(/\n/g, "<br>")
		.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function escapeHTML(text) {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}

window.addEventListener("load", () => userInput.focus());
