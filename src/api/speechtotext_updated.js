import React, {useState, useEffect} from 'react';
import annyang from 'annyang';
import { Button, Container, Typography, Paper, Box, TextField } from '@mui/material';


const SpeechToText = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
  const [gpt3Response, setGpt3Response] = useState('');

    useEffect(() => {
        if (annyang) {
            const commands = {
                '*text': function(text) {
                    setTranscript(prevTranscript => prevTranscript + ' ' + text);
                }
            };

            annyang.addCommands(commands);

            if (isListening) {
                annyang.start();
            } else {
                annyang.pause();
            }
        }

return () => {
            if (annyang) {
                annyang.abort();
            }
        };
    }, [isListening]);

    const handleSubmitToGPT3 = async () => {
        const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

        const requestBody = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: "system",
                    content: "Generate a medical office note from the audio transcript provided by the user which includes diagnoses, patient complaints, assessments, plans, physical exam notes, summary, etc. The notes should implement the advice given in this article: 'https://mobius.md/2022/11/14/step-by-step-guide-to-taking-perfect-clinical-notes/'."
                },
                {
                    role: "user",
                    content: transcript
                }
            ],
            max_tokens: 1500,
            temperature: 0.6,
            top_p: 0.9,
            frequency_penalty: -0.5,
            presence_penalty: 0.5
        };


        try {
            let response = await fetch(OPENAI_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`  // Make sure to replace 'YOUR_OPENAI_API_KEY' with your actual API key
                },
                body: JSON.stringify(requestBody)
            });

            let data = await response.json();
            if (data.choices && data.choices.length > 0) {
                    console.log(data)
                setGpt3Response(data.choices[0].message.content);
            } else {
                console.error("No response from GPT-3", data);
            }
        } catch (error) {
            console.error("Error calling GPT-3", error);
        }


    };

return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Speech Recognition with Annyang
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                <Button variant="contained" color="primary" onClick={() => setIsListening(true)} sx={{ marginRight: 1 }}>
                    Start
                </Button>
                <Button variant="contained" color="secondary" onClick={() => setIsListening(false)}>
                    Stop
                </Button>
            </Box>
            <Paper elevation={3} style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                    Transcript:
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={transcript}
                    onChange={e => setTranscript(e.target.value)}
                />
                <Button variant={`contained`} onClick={handleSubmitToGPT3}>Generate Medical Office Note</Button>
                <Typography>
                    {gpt3Response ? gpt3Response: `Please begin recording your transcript`}
                </Typography>
            </Paper>
        </Container>
    );
};

export default SpeechToText;

/*
  prompt: `
            Task: Convert the following audio transcript into a medical office note.
            Requirements:
            - Include diagnoses, patient complaints, assessments, plans, physical exam notes, summary, and other relevant details.
            - Follow the guidelines from this article: "https://mobius.md/2022/11/14/step-by-step-guide-to-taking-perfect-clinical-notes/".

            Transcript:
            ${transcript}
        `,


* const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `Generate a medical office note from the audio transcript which include diagnoses, patient complaints, assesssments, plans, physical exam notes, summary, etc.. The notes should implement the advice given in this article: "https://mobius.md/2022/11/14/step-by-step-guide-to-taking-perfect-clinical-notes/". The transcript to convert is: ${transcript}`,
                max_tokens: 150
            })
        });
        const data = await response.json();
        setGpt3Response(data.choices[0].text.trim());
*
* */
