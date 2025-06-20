import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebRTCService } from '../dashboard/streaming/webrtc.service';

@Component({
    selector: 'avans-nx-workshop-app-watch',
    standalone: true,
    templateUrl: './watch.component.html'
})
export class WatchComponent implements OnInit {
    @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

    constructor(
        private route: ActivatedRoute,
        private rtcService: WebRTCService
    ) {}

    async ngOnInit() {
        const streamId = this.route.snapshot.paramMap.get('id');
        await this.rtcService.initLocalStream(false, streamId!); // join as viewer
        this.rtcService.onRemoteStreamCallback = (stream: MediaStream) => {
            this.remoteVideo.nativeElement.srcObject = stream;
        };
        await this.rtcService.startConnection();
    }
}
