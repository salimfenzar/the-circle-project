import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamingComponent } from './streaming.component';

describe('StreamingComponent', () => {
    let component: StreamingComponent;
    let fixture: ComponentFixture<StreamingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StreamingComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(StreamingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
