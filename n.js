import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const socket = io('http://localhost:5000'); // Connect to signaling server

const AudioCall = () => {
    const [peers, setPeers] = useState({});
    const userStream = useRef(null);
    const peerConnections = useRef({});
    const roomId = 'test-room'; // Static room for now

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                userStream.current = stream;
                socket.emit('join-room', roomId, socket.id);
            })
            .catch(error => console.error('Error accessing microphone:', error));

        socket.on('user-connected', userId => {
            console.log('User connected:', userId);
            createPeerConnection(userId, true);
        });

        socket.on('signal', ({ sender, signal }) => {
            if (!peerConnections.current[sender]) {
                createPeerConnection(sender, false);
            }
            peerConnections.current[sender].signal(signal);
        });

        socket.on('user-disconnected', userId => {
            if (peerConnections.current[userId]) {
                peerConnections.current[userId].destroy();
                delete peerConnections.current[userId];
                setPeers(prev => {
                    const updated = { ...prev };
                    delete updated[userId];
                    return updated;
                });
            }
        });

        return () => {
            socket.off('user-connected');
            socket.off('signal');
            socket.off('user-disconnected');
            Object.values(peerConnections.current).forEach(peer => peer.destroy());
        };
    }, []);

    const createPeerConnection = (userId, initiator) => {
        const peer = new Peer({ initiator, trickle: false, stream: userStream.current });

        peer.on('signal', signal => {
            socket.emit('signal', { target: userId, signal });
        });

        peer.on('stream', stream => {
            setPeers(prev => ({ ...prev, [userId]: stream }));
        });

        peerConnections.current[userId] = peer;
    };

    return (
        <div>
            <h1>Live Audio Call</h1>
            {Object.entries(peers).map(([userId, stream]) => {
                const audioRef = useRef();
                useEffect(() => {
                    if (audioRef.current) {
                        audioRef.current.srcObject = stream;
                    }
                }, [stream]);
                return <audio key={userId} ref={audioRef} autoPlay />;
            })}
        </div>
    );
};

export default AudioCall;
