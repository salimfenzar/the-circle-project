import { Component, ElementRef, ViewChild, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebRTCService } from './webrtc.service';
import { StreamService } from './streaming.service';

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
  isStreaming = false;
  streamStartTime: Date | null = null;
  streamDuration: string = '00:00:00';
  private timerInterval: any;


  private webrtc = inject(WebRTCService);
  constructor(
    private streamService: StreamService
  ){}
  
  updateStreamDuration() {
    if (this.streamStartTime) {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - this.streamStartTime.getTime()) / 1000);
      const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const seconds = String(elapsed % 60).padStart(2, '0');
      this.streamDuration = `${hours}:${minutes}:${seconds}`;
    }
  }

  async start(isCaller: boolean) {
    if (this.isStreaming) {
    this.stop();
    return;
  }
  this.showLocal = isCaller;
  this.showRemote = !isCaller;

  await new Promise((resolve) => setTimeout(resolve)); // DOM laten updaten 

  const localStream = await this.webrtc.initLocalStream(isCaller);

  if (localStream && this.localVideo?.nativeElement) {
    this.localVideo.nativeElement.srcObject = localStream;
  }

  await this.webrtc.startConnection();
  this.isStreaming = true;
  this.streamStartTime = new Date();
  this.startTimer();
  this.updateStreamDuration();

  if (this.remoteVideo?.nativeElement) {
    this.remoteVideo.nativeElement.srcObject = this.webrtc.remoteStream;
  }
  const streamData = {
    startTime: this.streamStartTime,
    title: 'Live Stream',
    isActive: true,
    //userId: '6853dfb79dd8407f2d6aacb3'
  };
  
  this.streamService.createStream(streamData).subscribe({
    next: (stream) => {
      console.log('Stream created:', stream);
    }
  });
}

stop() {
  this.webrtc.stopConnection();
  if (this.localVideo?.nativeElement) {
    this.localVideo.nativeElement.srcObject = null;
  }
  if (this.remoteVideo?.nativeElement) {
    this.remoteVideo.nativeElement.srcObject = null;
  }

  this.isStreaming = false;
  clearInterval(this.timerInterval); // ⬅️ deze regel toevoegen
  this.streamDuration = '00:00:00';
  this.streamStartTime = null;
}



  startTimer() {
  this.timerInterval = setInterval(() => {
    this.updateStreamDuration();
  }, 1000); // elke seconde bijwerken
}


  
  ngAfterViewInit() {
    this.webrtc.onRemoteStreamCallback = (stream) => {
      this.remoteVideo.nativeElement.srcObject = stream;
    };
  }
}
