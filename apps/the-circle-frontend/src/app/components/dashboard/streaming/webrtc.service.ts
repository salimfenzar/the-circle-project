import { io } from 'socket.io-client';

export class WebRTCService {
  private socket = io('http://192.168.1.139:3100'); // your backend signaling server port

  private peerConnection!: RTCPeerConnection;
  onRemoteStreamCallback?: (stream: MediaStream) => void;
  localStream!: MediaStream;
  remoteStream!: MediaStream;

  private isCaller = false;
  private targetId: string | null = null;
  public broadcasterList: { id: string; name: string }[] = [];

  getBroadcasters() {
    this.socket.emit('get-broadcasters');
  }

  onBroadcasterList(callback: (list: { id: string; name: string }[]) => void) {
    this.socket.on('broadcaster-list', (list) => {
      this.broadcasterList = list;
      callback(list);
    });
  }

  constructor() {
    this.socket.on('watcher', async (watcherId: string) => {
      if (this.isCaller) {
        this.targetId = watcherId;
        await this.createOffer();
      }
    });

    this.socket.on('offer', async (data: any) => {
      if (!this.isCaller) {
        this.targetId = data.from;
        await this.handleOffer(data.sdp);
      }
    });

    this.socket.on('answer', async (data: any) => {
      if (this.isCaller && data.from === this.targetId) {
        await this.handleAnswer(data.sdp);
      }
    });

    this.socket.on('ice-candidate', async (data: any) => {
      if (data.from === this.targetId) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });
  }
  
  setTargetId(id: string) {
    this.targetId = id;
  }

  async initLocalStream(isCaller: boolean, name?: string): Promise<MediaStream | null> {
    this.isCaller = isCaller;
    if (isCaller) {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.socket.emit('start-broadcast', { name });
      return this.localStream;
    } else {
      this.socket.emit('join-broadcast', { targetId: this.targetId });
      return null;
    }
  }

  async startConnection() {
    if (this.peerConnection && this.peerConnection.connectionState !== 'closed') {
      console.log('[WebRTC] PeerConnection already exists, skipping start');
      return;
    }

    this.peerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    this.remoteStream = new MediaStream();

    this.peerConnection.ontrack = (event) => {
        console.log('Track received:', event.track.kind);
        this.remoteStream.addTrack(event.track);
        
        // Set remote video srcObject once tracks are received
        if (this.onRemoteStreamCallback) {
            this.onRemoteStreamCallback(this.remoteStream);
        }
    };


    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.targetId) {
        this.socket.emit('ice-candidate', { candidate: event.candidate, target: this.targetId });
      }
    };

    if (this.isCaller && this.localStream) {
      this.localStream.getTracks().forEach((track) =>
        this.peerConnection.addTrack(track, this.localStream)
      );
    }
  }

  async stopConnection() {
    this.peerConnection.close();

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
    }

    // not sure if this is needed, stop-broadcast is not implemented in the backend
    // if (this.isCaller && this.streamId) {
    //   this.socket.emit('stop-broadcast', { streamId: this.streamId });
    // }

    this.localStream = null as any;
    this.remoteStream = null as any;
  }

  private async createOffer() {
    await this.startConnection();
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit('offer', { sdp: offer, target: this.targetId });
  }

  private async handleOffer(sdp: RTCSessionDescriptionInit) {
  if (this.peerConnection?.signalingState !== 'stable') {
    console.warn('[WebRTC] Ignoring offer: PeerConnection not stable');
    return;
  }

  if (!this.peerConnection) {
    await this.startConnection();
  }

  if (this.peerConnection.signalingState !== 'stable') {
    console.warn('Unexpected signaling state:', this.peerConnection.signalingState);
  }

  // Set remote offer
  await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));

  // Add local tracks if needed
  if (!this.isCaller && this.localStream) {
    this.localStream.getTracks().forEach((track) =>
      this.peerConnection.addTrack(track, this.localStream)
    );
  }

  // Create and set answer
  const answer = await this.peerConnection.createAnswer();
  await this.peerConnection.setLocalDescription(answer);

  this.socket.emit('answer', { sdp: answer, target: this.targetId });
}

  private async handleAnswer(sdp: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
  }
}
