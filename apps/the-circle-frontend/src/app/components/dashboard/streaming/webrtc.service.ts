import { io } from 'socket.io-client';

export class WebRTCService {
    private socket = io('https://the-circle-project-1.onrender.com'); // your backend signaling server port

    private peerConnection!: RTCPeerConnection;
    onRemoteStreamCallback?: (stream: MediaStream) => void;
    localStream!: MediaStream;
    remoteStream!: MediaStream;

    private isCaller = false;
    private targetId: string | null = null;

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
                await this.peerConnection.addIceCandidate(
                    new RTCIceCandidate(data.candidate)
                );
            }
        });
    }

    async initLocalStream(isCaller: boolean): Promise<MediaStream | null> {
        this.isCaller = isCaller;
        if (isCaller) {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            this.socket.emit('start-broadcast');
            return this.localStream;
        } else {
            this.socket.emit('join-broadcast');
            return null;
        }
    }

    async startConnection() {
        this.peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

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
                this.socket.emit('ice-candidate', {
                    candidate: event.candidate,
                    target: this.targetId
                });
            }
        };

        if (this.isCaller && this.localStream) {
            this.localStream
                .getTracks()
                .forEach((track) =>
                    this.peerConnection.addTrack(track, this.localStream)
                );
        }
    }

    private async createOffer() {
        await this.startConnection();
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.socket.emit('offer', { sdp: offer, target: this.targetId });
    }

    private async handleOffer(sdp: RTCSessionDescriptionInit) {
        await this.startConnection();
        await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(sdp)
        );
        if (!this.isCaller && this.localStream) {
            this.localStream
                .getTracks()
                .forEach((track) =>
                    this.peerConnection.addTrack(track, this.localStream)
                );
        }
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.socket.emit('answer', { sdp: answer, target: this.targetId });
    }

    private async handleAnswer(sdp: RTCSessionDescriptionInit) {
        await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(sdp)
        );
    }
}
