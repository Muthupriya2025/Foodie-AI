import os

from flask import Flask, render_template, request, jsonify
from groq import Groq
from dotenv import load_dotenv


# Load .env file
load_dotenv()


# Create Flask application
app = Flask(__name__)


# Connect to Groq
client = Groq(
	api_key=os.getenv("GROQ_API_KEY")
)


# Load restaurant knowledge base
with open("knowledge_base.txt", "r", encoding="utf-8") as file:
	knowledge_base = file.read()


# Home page
@app.route("/")
def home():
	return render_template("index.html")


# Chat API
@app.route("/chat", methods=["POST"])
def chat():

	# Get question from frontend
	data = request.get_json()

	user_question = data.get("message", "")


	# Create prompt using restaurant knowledge
	prompt = f"""
You are Foodie AI, a helpful food and restaurant chatbot.

Use ONLY the restaurant information provided below to answer
the user's question.

RESTAURANT KNOWLEDGE:
{knowledge_base}

USER QUESTION:
{user_question}

Give a simple, friendly and clear answer.

If the answer is not available in the restaurant knowledge,
say:
"Sorry, I don't have that information in my restaurant knowledge base."
"""


	# Send prompt to Groq AI
	response = client.chat.completions.create(

		model="openai/gpt-oss-120b",

		messages=[
			{
				"role": "user",
				"content": prompt
			}
		]
	)


	# Get AI answer
	answer = response.choices[0].message.content


	# Send answer back to frontend
	return jsonify({
		"answer": answer
	})


# Run application
if __name__ == "__main__":
	app.run(debug=True)
