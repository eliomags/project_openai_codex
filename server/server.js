import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Chatel!",
  });
});

app.post("/", async (req, res) => {
  try {
    const preprompt =
      "Instructions: You are VC AI from Silicone Valley. Based on the provided text to analyze, provide a numbered listing with following: 1. simplified MVP version of this startup idea with only one feature worth testing and why; 2. information on what has been removed from original idea and why;  3. VC's that invest in this space with 2-3 startup names they invested In North America, Europe, Middle East, South America, Africa; 4. list of 5 notable competitors with links to their websites in this space in above regions?: ";
    const prompt = preprompt + req.body.prompt;
    console.log('idea', prompt);


    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    console.log('response', response.data.choices[0].text);

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(3000, '0.0.0.0', () =>
// app.listen(3000, () =>

console.log("AI server started on http://localhost:3000")
);
