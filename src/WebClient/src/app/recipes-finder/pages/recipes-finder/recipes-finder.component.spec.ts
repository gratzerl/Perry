import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesFinderComponent } from './recipes-finder.component';

describe('RecipesFinderComponent', () => {
  let component: RecipesFinderComponent;
  let fixture: ComponentFixture<RecipesFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipesFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
