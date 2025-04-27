"use client"
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Vapi from '@vapi-ai/web';
import { CodeEditor } from '@/components/CodeEditor';
import { Navbar } from '@/components/Navbar';

// Initialize Vapi outside the component or use useRef to avoid re-creating it on every render
const vapi = new Vapi('864fa337-0443-4b92-a4c4-42470a7db0f7'); // Replace with your public key

export default function Home() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false); // Add connecting state
  const assistantId = '15abae60-9cb1-4722-adb5-fd16a9907f53'; // Replace with your Assistant ID

  useEffect(() => {
    // Event listeners for Vapi
    vapi.on('call-start', () => {
      console.log('Vapi call started');
      setIsConnecting(false);
      setIsCallActive(true);
      toast.custom((t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-lg shadow-lg`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          AI Interviewer joined the call
        </div>
      ));
    });

    vapi.on('call-end', () => {
      console.log('Vapi call ended');
      setIsConnecting(false); // Ensure connecting state is reset
      setIsCallActive(false);
      toast.custom((t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-lg shadow-lg`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          AI Interviewer left the call
        </div>
      ));
    });

    vapi.on('error', (error) => {
      console.error('Vapi error:', error);
      setIsConnecting(false); // Reset connecting state on error
      setIsCallActive(false); // Assume call failed or ended
      toast.error('An error occurred with the voice agent.', {
        duration: 5000,
      });
    });

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      vapi.removeAllListeners();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const handleToggleCall = async () => {
    if (isConnecting) return; // Prevent multiple clicks while connecting/disconnecting

    if (isCallActive) {
      // Stop the call
      console.log('Attempting to stop Vapi call...');
      setIsConnecting(true); // Indicate disconnecting process
      try {
        await vapi.stop();
      } catch (e) {
        console.error('Error stopping Vapi call:', e);
        setIsConnecting(false); // Reset connecting state on error
        toast.error('Failed to end the call.');
      }
      // Let the 'call-end' event handle setting isCallActive and isConnecting to false
    } else {
      // Start the call
      console.log('Attempting to start Vapi call...');
      setIsConnecting(true);
      try {
        await vapi.start(assistantId);
      } catch (e) {
        console.error('Error starting Vapi call:', e);
        setIsConnecting(false); // Reset connecting state on error
        toast.error('Failed to start the call.');
      }
      // Let the 'call-start' event handle setting isCallActive to true and isConnecting to false
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex flex-col">
      <Navbar 
        isCallActive={isCallActive} 
        onToggleCall={handleToggleCall}
        isConnecting={isConnecting} // Pass connecting state to Navbar
      />
      <main className="flex-1">
        <CodeEditor />
      </main>
    </div>
  );
}
