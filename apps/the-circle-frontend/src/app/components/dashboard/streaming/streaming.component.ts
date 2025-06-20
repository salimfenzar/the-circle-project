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
  currentStreamId: string | null = null;


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

  if(isCaller){

  
  const streamData = {
    startTime: this.streamStartTime,
    title: 'Live Stream',
    isActive: true,
  };
  
  this.streamService.createStream(streamData).subscribe({
    next: (stream) => {
      console.log('Stream created:', stream);
      this.currentStreamId = stream._id ?? null; 
      console.log('Current Stream ID:', this.currentStreamId);
    }
  });
  } else {
    this.streamService.joinStream('6852b19bef649e51d42275e8').subscribe({ //streamid is hier nog hardcoded, maar de joinknop komt op een andere pagina
      next: (stream) => {
        console.log('Joined stream:', stream);
      },
      error: (error) => {
        console.error('Error joining stream:', error);
      }
    });
  }
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
  clearInterval(this.timerInterval); 
  this.streamDuration = '00:00:00';
  this.streamStartTime = null;
  this.streamService.stopStream(this.currentStreamId ?? '').subscribe({
    next: (stream) => {
      console.log('Stream stopped:', stream);
    }
  });
  this.currentStreamId = null; //reset de huidige stream ID
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
