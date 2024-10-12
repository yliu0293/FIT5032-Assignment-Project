<template>
  <div class="container">
    <h1 class="text-center">How to live a healthy senior life</h1>
    
    <!-- AI Response Output -->
    <div v-if="streamingResponse" class="ai-response-box">
      <strong>AI Response: </strong>
      <span>{{ streamingResponse }}</span>
    </div>

    <!-- Button to trigger AI request -->
    <button @click="askAI" class="btn btn-primary mt-4">Ask AI</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Set up AI and configuration
const API_KEY = 'AIzaSyAGbaLfcMyNxaTM24JiS7TMK2x1cotO7OM';
const genAI = new GoogleGenerativeAI({ apiKey: API_KEY });
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const streamingResponse = ref(''); // To store and show the AI's response

// Function to request AI for content generation
const askAI = async () => {
  const prompt = 'How to live a healthy senior life';
  streamingResponse.value = ''; // Clear previous response

  try {
    // Call AI model to generate content
    const result = await model.generateContentStream(prompt);

    // Process the streaming response
    for await (const chunk of result.stream) {
      streamingResponse.value += chunk.text(); // Update response as it streams in
    }
  } catch (error) {
    console.error('Error while generating content:', error);
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.ai-response-box {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  text-align: left;
  font-size: 18px;
}

button {
  padding: 10px 20px;
  font-size: 18px;
}
</style>
