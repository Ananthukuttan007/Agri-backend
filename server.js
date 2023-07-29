const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 3000; // Choose any available port you prefer
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyDtzJuwbnvaB7fuYmjjwFGDYl5lhehcW0M";

const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

async function callGenerateText(req, res) {
    const context = "A question and an answer will be given.\nOnly 3 wrong options should be generated that is in the context of the question and will confuse the user.";
    const examples = [
        {
            "input": {
                "content": "What is the scientific name of mango: a) Mangifera indica"
            },
            "output": {
                "content": "b) Solanum melongena c) Malus domestica d) Piper nigrum"
            }
        },
        {
            "input": {
                "content": "Pollination of carrot a) cross Pollination (95%) due to Andromonoecy, Protandry, Male sterility"
            },
            "output": {
                "content": "b) Self-pollination (60%) due to Gynodioecy, Protogyny, Female sterility c) Wind pollination (80%) due to Dioecy, Anemophily, Male fertility d) Insect pollination (70%) due to Hermaphroditism, Entomophily, Male fertility"
            }
        }
    ];
    const messages = [];
    messages.push(req.body);

    client.generateMessage({
        // required, which model to use to generate the result
        model: MODEL_NAME,
        // optional, 0.0 always uses the highest-probability result
        temperature: 0.25,
        // optional, how many candidate results to generate
        candidateCount: 1,
        // optional, number of most probable tokens to consider for generation
        top_k: 40,
        // optional, for nucleus sampling decoding strategy
        top_p: 0.95,
        prompt: {
            // optional, sent on every request and prioritized over history
            context: context,
            // optional, examples to further finetune responses
            examples: examples,
            // required, alternating prompt/response messages
            messages: messages,
        },
    }).then(result => {
        res.json(result);
    });
}

// callGenerateText();

app.post('/chat', express.json(), callGenerateText);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

