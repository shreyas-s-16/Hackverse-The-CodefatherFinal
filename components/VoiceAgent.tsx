import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveSession, Modality, FunctionDeclaration, Type, LiveServerMessage } from '@google/genai';
import { agentFunctionDeclarations, getFinancialInsight } from '../services/geminiService';
import { MicrophoneIcon, StopCircleIcon, InformationCircleIcon } from './common/Icons';
import { TradeOrder } from '../types';
import { MOCK_STOCKS } from '../constants';

// Helper functions for audio encoding/decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceAgent: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [userTranscript, setUserTranscript] = useState('');
    const [agentResponse, setAgentResponse] = useState('');
    const [notifications, setNotifications] = useState<TradeOrder[]>([]);

    const sessionRef = useRef<Promise<LiveSession> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    let nextStartTime = 0;

    const startSession = async () => {
        if (!process.env.API_KEY) {
            setAgentResponse("Error: API_KEY is not configured.");
            return;
        }

        setIsActive(true);
        setUserTranscript('');
        setAgentResponse('Connecting...');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            sessionRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    tools: [{ functionDeclarations: agentFunctionDeclarations }],
                    systemInstruction: `You are a helpful stock trading assistant for the Indian stock market (NSE). You can execute trades, get stock prices, and answer questions about market trends, economic indicators, and investment strategies. When executing a trade, always confirm the action. When asked for a price, find it in the provided list: ${JSON.stringify(MOCK_STOCKS)}. All prices are in Indian Rupees (INR). For general financial questions, use the get_market_insights tool. Respond concisely.`
                },
                callbacks: {
                    onopen: () => {
                        setAgentResponse('Listening... Speak now.');
                        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        const source = audioContextRef.current.createMediaStreamSource(stream);
                        scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current.onaudioprocess = (event) => {
                            const inputData = event.inputBuffer.getChannelData(0);
                            const int16 = new Int16Array(inputData.length);
                            for (let i = 0; i < inputData.length; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            
                            sessionRef.current?.then(session => session.sendRealtimeInput({ media: { data: btoa(String.fromCharCode(...new Uint8Array(int16.buffer))), mimeType: 'audio/pcm;rate=16000' }}));
                        };
                        source.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(audioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setUserTranscript(prev => prev + message.serverContent.inputTranscription.text);
                        }
                        if (message.serverContent?.outputTranscription) {
                            setAgentResponse(prev => prev.startsWith('Listening') || prev.startsWith('Connecting') ? message.serverContent.outputTranscription.text : prev + message.serverContent.outputTranscription.text);
                        }
                        if (message.serverContent?.turnComplete) {
                            setUserTranscript('');
                            setAgentResponse('');
                        }

                        // Function Calling
                        if (message.toolCall?.functionCalls) {
                            for (const fc of message.toolCall.functionCalls) {
                                if (fc.name === 'execute_stock_trade' && fc.args) {
                                    const { action, symbol, quantity } = fc.args as {action: 'BUY' | 'SELL', symbol: string, quantity: number};
                                    const stock = MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
                                    const price = stock ? stock.price : 0;
                                    const newOrder = { action, symbol: symbol.toUpperCase(), quantity, price };
                                    setNotifications(prev => [newOrder, ...prev]);
                                    sessionRef.current?.then(session => session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: "OK, trade simulated successfully." } } }));
                                }
                                if (fc.name === 'get_stock_price' && fc.args) {
                                     const { symbol } = fc.args as {symbol: string};
                                     const stock = MOCK_STOCKS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
                                     const result = stock ? `The current price of ${symbol.toUpperCase()} is ₹${stock.price}.` : `Sorry, I could not find the price for ${symbol.toUpperCase()}.`;
                                     sessionRef.current?.then(session => session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result } } }));
                                }
                                if (fc.name === 'get_market_insights' && fc.args) {
                                    const { query } = fc.args as { query: string };
                                    const insight = await getFinancialInsight(query);
                                    sessionRef.current?.then(session => session.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: insight } } }));
                                }
                            }
                        }
                        
                        // Handle audio output
                        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if(base64Audio && outputAudioContextRef.current) {
                            nextStartTime = Math.max(nextStartTime, outputAudioContextRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current.destination);
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                        }

                    },
                    onerror: (e) => {
                        console.error('Gemini Live Error:', e);
                        setAgentResponse(`Connection error. Please try again.`);
                        stopSession();
                    },
                    onclose: () => {
                       // Handled in stopSession
                    },
                }
            });

        } catch (error) {
            console.error("Error starting voice session:", error);
            setAgentResponse("Could not access microphone. Please check permissions.");
            setIsActive(false);
        }
    };

    const stopSession = () => {
        setIsActive(false);
        setAgentResponse('');
        setUserTranscript('');

        sessionRef.current?.then(session => session.close());
        sessionRef.current = null;
        
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        
        audioContextRef.current?.close();
        audioContextRef.current = null;
        
        outputAudioContextRef.current?.close();
        outputAudioContextRef.current = null;
    };

    useEffect(() => {
        return () => {
            if (isActive) {
                stopSession();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-4 flex flex-col items-center justify-center space-y-4 min-h-[200px]">
            <button
                onClick={isActive ? stopSession : startSession}
                className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${isActive ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'}`}
            >
                {isActive ? <StopCircleIcon className="w-10 h-10 text-white" /> : <MicrophoneIcon className="w-10 h-10 text-white" />}
                 {isActive && <span className="absolute h-full w-full rounded-full bg-red-500 animate-ping opacity-75"></span>}
            </button>

            <div className="w-full text-center h-12">
                <p className="text-sm text-gray-400 min-h-[20px]">{userTranscript || (isActive ? ' ' : 'Press mic to start')}</p>
                <p className="font-semibold text-green-300 min-h-[24px]">{agentResponse}</p>
            </div>
            
            {notifications.length > 0 && (
                <div className="w-full pt-2 border-t border-gray-700">
                    <h4 className="text-sm font-semibold text-center text-gray-300 mb-2">Simulated Order Executions</h4>
                    <div className="max-h-24 overflow-y-auto space-y-1">
                        {notifications.map((order, index) => (
                            <div key={index} className="flex items-center text-xs bg-gray-700/50 p-1.5 rounded-md">
                                <InformationCircleIcon className={`w-4 h-4 mr-2 ${order.action === 'BUY' ? 'text-green-400' : 'text-red-400'}`} />
                                <span className="font-mono">
                                    {order.action} {order.quantity} {order.symbol} @ ₹{order.price.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


export default VoiceAgent;