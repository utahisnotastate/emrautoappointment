import React, { useState } from 'react';
import { Button, TextField, Typography, Paper } from '@material-ui/core';
import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

const API_KEY = "AIzaSyD95De7Qptxgxwuosd9aTHaenZtai7-uMw"; // Replace with your API key
const MODEL_NAME = "models/chat-bison-001";

const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

function TranscriptInput() {
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');

    const handleGenerateResponse = async () => {
        const messages = [{ content: transcript }];
        const result = await client.generateMessage({
            model: MODEL_NAME,
            temperature: 0.1,
            candidateCount: 1,
            top_k: 40,
            top_p: 0.95,
            prompt: { messages },
        });
        setResponse(result?.responses?.[0]?.content || 'No response generated.');
    };

    return (
        <Paper style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
            <Typography variant="h5" gutterBottom>
                Enter Transcript
            </Typography>
            <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Enter the transcript here..."
            />
            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={handleGenerateResponse}
            >
                Generate Response
            </Button>
            {response && (
                <Typography variant="subtitle1" style={{ marginTop: '20px' }}>
                    Response: {response}
                </Typography>
            )}
        </Paper>
    );
}

export default TranscriptInput;
