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
            <Paper elevation={3} style={{ padding: '16px' }}>
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
            </Paper>
        </Container>
    );
};

export default SpeechToText;
