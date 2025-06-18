import { Component, ElementRef, ViewChild, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebRTCService } from './webrtc.service';

@Component({
    selector: 'avans-nx-workshop-streaming',
    standalone: true,
    imports: [CommonModule],
    providers: [WebRTCService],
    templateUrl: './streaming.component.html',
    styleUrls: ['./streaming.component.css']
})

export class StreamingComponent implements AfterViewInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  private webrtc = inject(WebRTCService);

  async start(isCaller: boolean) {
    // Initialize the local stream (only if broadcaster)
    const localStream = await this.webrtc.initLocalStream(isCaller);
    console.log('Local stream initialized:', isCaller);

    if (localStream) {
      this.localVideo.nativeElement.srcObject = localStream;
    } else {
      this.localVideo.nativeElement.srcObject = null;
    }

    // Start WebRTC connection
    await this.webrtc.startConnection();

    // Assign the remote stream to the remote video element
    this.remoteVideo.nativeElement.srcObject = this.webrtc.remoteStream;
  }
  
  ngAfterViewInit() {
    this.webrtc.onRemoteStreamCallback = (stream) => {
      this.remoteVideo.nativeElement.srcObject = stream;
    };
  }
}
