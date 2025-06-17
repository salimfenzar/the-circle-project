import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveStreamersComponent } from './active-streamers.component';

describe('ActiveStreamersComponent', () => {
    let component: ActiveStreamersComponent;
    let fixture: ComponentFixture<ActiveStreamersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ActiveStreamersComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ActiveStreamersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
