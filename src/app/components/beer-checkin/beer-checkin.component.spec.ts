import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerCheckinComponent } from './beer-checkin.component';

describe('BeerCheckinComponent', () => {
  let component: BeerCheckinComponent;
  let fixture: ComponentFixture<BeerCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeerCheckinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BeerCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
