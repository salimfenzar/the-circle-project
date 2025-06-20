import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {
  private socket: Socket = io('http://localhost:3100');

  private isCaller = false;
  private streamId: string | null = null;

  private localStream!: MediaStream;
  remoteStream!: MediaStream;

  private peerConnections: { [id: string]: RTCPeerConnection } = {};
  private iceConfig: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  onRemoteStreamCallback?: (stream: MediaStream) => void;

  constructor() {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('watcher', async ({ watcherId, streamId }: any) => {
      if (!this.isCaller || streamId !== this.streamId) return;

      const peer = this.createPeerConnection(watcherId);

      // Add local tracks to new peer connection
      this.localStream.getTracks().forEach((track) => {
        peer.addTrack(track, this.localStream);
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      this.socket.emit('offer', {
        sdp: peer.localDescription,
        target: watcherId,
        streamId: this.streamId
      });
    });

    this.socket.on('offer', async (data: any) => {
      if (this.isCaller || data.streamId !== this.streamId) return;

      const { from: broadcasterId, sdp } = data;
      const peer = this.createPeerConnection(broadcasterId);

      await peer.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      this.socket.emit('answer', {
        sdp: peer.localDescription,
        target: broadcasterId,
        streamId: this.streamId
      });
    });

    this.socket.on('answer', async (data: any) => {
      if (!this.isCaller || data.streamId !== this.streamId) return;

      const peer = this.peerConnections[data.from];
      if (peer) {
        await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
    });

    this.socket.on('ice-candidate', async (data: any) => {
      const peer = this.peerConnections[data.from];
      if (peer && data.candidate) {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Failed to add ICE candidate:', err);
        }
      }
    });

    this.socket.on('stop-broadcast', ({ from }: any) => {
      this.closeConnection(from);
    });
  }

  private createPeerConnection(peerId: string): RTCPeerConnection {
    let pc = this.peerConnections[peerId];
    if (pc) return pc;

    pc = new RTCPeerConnection(this.iceConfig);
    this.peerConnections[peerId] = pc;

    this.remoteStream = new MediaStream();

    pc.ontrack = (event) => {
      console.log('Track received:', event.track.kind);
      if (!this.remoteStream.getTracks().includes(event.track)) {
        this.remoteStream.addTrack(event.track);
      }
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', {
          candidate: event.candidate,
          target: peerId,
          streamId: this.streamId
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection ${peerId} state:`, pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.closeConnection(peerId);
      }
    };

    return pc;
  }

  async initLocalStream(isCaller: boolean, streamId: string): Promise<MediaStream | null> {
    this.isCaller = isCaller;
    this.streamId = streamId;

    if (isCaller) {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: true
      });

      this.socket.emit('start-broadcast', { streamId });
      return this.localStream;
    } else {
      this.socket.emit('join-broadcast', { streamId });
      return null;
    }
  }

  async startConnection() {
    // nothing to do here since connections are created on demand
  }

  async stopConnection() {
    Object.keys(this.peerConnections).forEach((peerId) => {
      this.closeConnection(peerId);
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
    }

    if (this.isCaller && this.streamId) {
      this.socket.emit('stop-broadcast', { streamId: this.streamId });
    }

    this.peerConnections = {};
    this.streamId = null;
    this.localStream = null as any;
    this.remoteStream = null as any;
  }

  private closeConnection(peerId: string) {
    const peer = this.peerConnections[peerId];
    if (peer) {
      peer.close();
      delete this.peerConnections[peerId];
    }
  }
}
