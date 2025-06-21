import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebRTCService } from '../dashboard/streaming/webrtc.service';

@Component({
    selector: 'avans-nx-workshop-app-watch',
    standalone: true,
    providers: [WebRTCService],
    templateUrl: './watch.component.html'
})
export class WatchComponent implements OnInit {
    @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

    constructor(
        private route: ActivatedRoute,
        // private webrtc: WebRTCService
    ) {}

    private webrtc = inject(WebRTCService);

    async ngOnInit() {
        console.log('Connecting to WebRTC service with id from route ' + this.route.snapshot.paramMap.get('id'));
        const streamId = this.route.snapshot.paramMap.get('id');
        this.webrtc.setTargetId(streamId!);
        await this.webrtc.initLocalStream(false, ""); // No name needed for viewers
        await this.webrtc.startConnection();
        this.remoteVideo.nativeElement.srcObject = this.webrtc.remoteStream;
    }
}
