import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerComponent } from './peer.component';

describe('PeerComponent', () => {
  let component: PeerComponent;
  let fixture: ComponentFixture<PeerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
