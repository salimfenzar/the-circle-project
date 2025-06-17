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

  showLocal = false;
  showRemote = false;

  private webrtc = inject(WebRTCService);
  
  async start(isCaller: boolean) {
  this.showLocal = isCaller;
  this.showRemote = !isCaller;

  await new Promise((resolve) => setTimeout(resolve)); // DOM laten updaten (optioneel)

  const localStream = await this.webrtc.initLocalStream(isCaller);

  if (localStream && this.localVideo?.nativeElement) {
    this.localVideo.nativeElement.srcObject = localStream;
  }

  await this.webrtc.startConnection();

  if (this.remoteVideo?.nativeElement) {
    this.remoteVideo.nativeElement.srcObject = this.webrtc.remoteStream;
  }
}
  
  ngAfterViewInit() {
    this.webrtc.onRemoteStreamCallback = (stream) => {
      this.remoteVideo.nativeElement.srcObject = stream;
    };
  }
}
