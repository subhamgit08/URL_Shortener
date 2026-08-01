import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    Tooltip
} from '@mui/material';
import {
    ContentCopy,
    CheckCircle,
    Link as LinkIcon,
    AutoAwesome
} from '@mui/icons-material';

// --- Logic Ported from Vanilla JS ---
const setOfIDs = new Set();

export function shortenerOfID(id) {
    const container = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let n = id;
    let convertedString = "";
    if (n === 0) return container[0];
    while (n > 0) {
        let rem = n % 62;
        convertedString = container[rem] + convertedString;
        n = Math.floor(n / 62);
    }
    return convertedString;
}

// --- Modern React UI Component ---
export default function UrlShortener() {
    const [longUrl, setLongUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlContent = longUrl.trim();
        if (!urlContent) return;

        setIsLoading(true);
        setResult(null); // Clear previous result if any
        setIsCopied(false);

        // Simulate backend processing time
        setTimeout(() => {
            let newID;
            do {
                newID = Math.floor(Math.random() * 2000);
            } while (setOfIDs.has(newID));

            setOfIDs.add(newID);
            const encryptedID = shortenerOfID(newID);
            const trimmedLink = `https://snap-URL.com/${encryptedID}`;

            setResult({ original: urlContent, shortened: trimmedLink });
            setIsLoading(false);
            setLongUrl('');
            console.log([...setOfIDs]);
        }, 800); // Slightly longer delay for a smoother loading animation
    };

    const handleCopy = () => {
        if (result?.shortened) {
            navigator.clipboard.writeText(result.shortened).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    return (
        // Centering wrapper
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                position: 'relative',
                zIndex: 1 // Ensures it sits above your fixed WebGL canvas
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
            >
                <Card
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 480,
                        padding: 4,
                        borderRadius: "24px",

                        // Better Glass
                        background:
                            "linear-gradient(180deg, rgba(18,12,45,0.92) 0%, rgba(12,8,32,0.90) 100%)",

                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",

                        border: "1px solid rgba(255,255,255,0.18)",

                        boxShadow: `
                            0 25px 60px rgba(0,0,0,0.55),
                            inset 0 1px 1px rgba(255,255,255,0.12),
                            0 0 40px rgba(157,78,221,0.18)
                            `,

                        color: "white",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                        <AutoAwesome sx={{ color: '#E0AAFF' }} />
                        <Typography variant="h5" fontWeight="700" letterSpacing="-0.5px" sx={{ mb: 2 }}>
                            Snap Shortener
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="URL Here"
                            placeholder="Paste your long URL here..."
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    color: "#666", // Default label color
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#7f0acd", // Label color when input is focused
                                },
                                "& .MuiInputLabel-root:hover": {
                                    color: "#7f0acd", // Label color when hovering (optional)
                                },

                                "& .MuiFilledInput-root": {
                                    backgroundColor: "#fff",
                                    borderRadius: "16px",

                                    "&:hover": {
                                        backgroundColor: "#fff",
                                    },

                                    "&.Mui-focused": {
                                        backgroundColor: "#fff",
                                    },

                                    "&.Mui-disabled": {
                                        backgroundColor: "#fff",
                                    },

                                    "&:before": {
                                        borderBottom: "1px solid rgba(0,0,0,0.15)",
                                    },

                                    "&:hover:not(.Mui-disabled):before": {
                                        borderBottom: "2px solid #9D4EDD",
                                    },

                                    "&.Mui-focused:after": {
                                        borderBottom: "2px solid #9D4EDD",
                                    },
                                },

                                "& .MuiFilledInput-input": {
                                    color: "#000",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LinkIcon sx={{ color: "#666" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            disabled={isLoading || !longUrl.trim()}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: '16px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #5A189A 0%, #9D4EDD 100%)',
                                color: 'white',
                                boxShadow: "0 10px 35px rgba(157,78,221,0.45)",
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #7b2cbf 0%, #c77dff 100%)',
                                    boxShadow: '0 8px 25px rgba(157, 78, 221, 0.6)',
                                    transform: 'translateY(-2px)'
                                },
                                '&.Mui-disabled': {
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.3)'
                                }
                            }}
                        >
                            {isLoading ? 'Generating Magic Link...' : 'Shorten URL'}
                        </Button>
                    </form>

                    {/* Animated Result Container */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.4, type: 'spring' }}
                                style={{ overflow: 'hidden' }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(199,125,255,0.35)",
                                        borderRadius: '16px',
                                        p: 2,
                                    }}
                                >
                                    <Box sx={{ overflow: 'hidden', mr: 2 }}>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 0.5 }}
                                        >
                                            Your shortened link:
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            component="a"
                                            href={result.original}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                color: '#E0AAFF',
                                                textDecoration: 'none',
                                                fontWeight: 500,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: 'block',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                        >
                                            {result.shortened}
                                        </Typography>
                                    </Box>

                                    <Tooltip title={isCopied ? "Copied!" : "Copy to clipboard"} placement="top">
                                        <motion.div whileTap={{ scale: 0.9 }}>
                                            <IconButton
                                                onClick={handleCopy}
                                                sx={{
                                                    background: isCopied ? '#4ade80' : 'rgba(255,255,255,0.1)',
                                                    color: isCopied ? '#000' : 'white',
                                                    '&:hover': { background: isCopied ? '#4ade80' : 'rgba(255,255,255,0.2)' }
                                                }}
                                            >
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={isCopied ? "check" : "copy"}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.5, opacity: 0 }}
                                                        transition={{ duration: 0.15 }}
                                                    >
                                                        {isCopied ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </IconButton>
                                        </motion.div>
                                    </Tooltip>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </Card>
            </motion.div>
        </Box>
    );
}