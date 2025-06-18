import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerChatComponent } from './peer-chat.component';

describe('PeerChatComponent', () => {
    let component: PeerChatComponent;
    let fixture: ComponentFixture<PeerChatComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PeerChatComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(PeerChatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
