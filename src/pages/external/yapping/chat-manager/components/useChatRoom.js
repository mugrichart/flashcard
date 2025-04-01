
import { useEffect, useRef, useState } from "react";

import WebSocketService from "../../../../../api/ws"

import Peer from "simple-peer";

const useChatRoom = ({ gameID, thisUserId, players}) => {
    const [peers, setPeers] = useState({});
    const userStream = useRef(null);
    const peerConnections = useRef({});

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                //console.log("Microphone access granted!");
                userStream.current = stream;
                //console.log("🎵 Tracks:", stream.getAudioTracks());
                // Create peer connections for all players except for this user
                players.forEach(player => {
                    if (player.playerID !== thisUserId) createPeerConnection(player.playerID, true);
                })
            })
            .catch(error => {
                if (error.name === "NotAllowedError") {
                    console.error("Microphone permission denied! Please allow access.");
                } else if (error.name === "NotFoundError") {
                    console.error("No microphone found!");
                } else {
                    console.error("Error accessing microphone:", error);
                }
            });


        // WebSocketService.route('user-connected', userId => {
        //     //console.log('User connected:', userId);
        //     createPeerConnection(userId, true);
        // });

        WebSocketService.route('signal', ({ sender, signal }) => {
            //console.log(`🔄 Signal received from: ${sender}`);
            //console.log("📡 Signal content:", signal);
        
            if (!peerConnections.current[sender]) {
                //console.log(`📞 Creating new peer connection for ${sender}`);
                createPeerConnection(sender, false);
            } else {
                //console.log(`✅ Found existing connection for ${sender}, signaling now.`);
            }
        
            peerConnections.current[sender].signal(signal);
        });
        

        // WebSocketService.route('user-disconnected', userId => {
        //     if (peerConnections.current[userId]) {
        //         peerConnections.current[userId].destroy();
        //         delete peerConnections.current[userId];
        //         setPeers(prev => {
        //             const updated = { ...prev };
        //             delete updated[userId];
        //             return updated;
        //         });
        //     }
        // });

        return () => {
            // socket.off('user-connected');
            // socket.off('signal');
            // socket.off('user-disconnected');
            Object.values(peerConnections.current).forEach(peer => peer.destroy());
        };
    }, []);

    const createPeerConnection = (targetID, initiator) => {
        //console.log(`🔧 Creating PeerConnection: ${targetID}, Initiator: ${initiator}`);
    
        if (peerConnections.current[targetID]) {
            console.warn(`⚠️ Peer connection already exists for ${targetID}`);
            return peerConnections.current[targetID];
        }
    
        const peer = new Peer({
            initiator,
            trickle: false,
            stream: userStream.current
        });
    
        peer.on('signal', signal => {
            //console.log(`📡 Sending signal to ${targetID}`);
            WebSocketService.send('signal', { targetID, playerID: thisUserId, signal });
        });
    
        peer.on('stream', stream => {
            //console.log(`🎧 Received stream from ${targetID}`);
            setPeers(prev => ({ ...prev, [targetID]: stream }));
        });
    
        peer.on('connect', () => {
            //console.log(`✅ Connection established with ${targetID}`);
        });
    
        peer.on('error', err => {
            console.error(`❌ Peer ${targetID} error:`, err);
        });
    
        peerConnections.current[targetID] = peer;
        return peer;
    };
    

    //console.log("Current Peers:", peerConnections.current);
    Object.entries(peerConnections.current).forEach(([id, peer]) => {
        //console.log(`Peer ${id} state:`, peer.connected ? "Connected ✅" : "Not connected ❌");
    });
  
    //console.log("Browser Info:", navigator.userAgent);

    return { peers }
    
}

export default useChatRoom