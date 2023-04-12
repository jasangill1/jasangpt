import { Configuration, OpenAIApi } from "openai";
import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";

// It's a good practice to store sensitive information like API keys in environment variables
const apiKey = process.env.OPENAI_API_KEY;
const organizationId = process.env.OPENAI_ORG_ID;

const configuration = new Configuration({
    organization: organizationId,
    apiKey: apiKey,
  });
  
  const openai = new OpenAIApi(configuration);
  
  const app = express();
  const port = 3000;
  
  app.use(bodyParser.json());
  app.use(cors());
  
  app.get('/', async (req, res) => {

    const message = req.query.message;
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: '${message}' },
        ],
      });
  
      console.log("API response:", completion.data);
      console.log("Message object:", completion.data.choices[0].message);
  
      res.json({
        completion: completion.data.choices[0].message,
      });
    } catch (error) {
      console.error("Error generating completion:", error);
      res.status(500).json({ error: "Error generating completion" });
    }
  });
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
