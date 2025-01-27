import { CommonModule } from '@angular/common';
import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nTestingModule } from '@spartacus/core';
import { DeleteItemModule } from '@spartacus/organization/administration/components';
import { Budget } from '@spartacus/organization/administration/core';
import { FocusConfig } from '@spartacus/storefront';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { EMPTY, of, Subject } from 'rxjs';
import { CardTestingModule } from '../../shared/card/card.testing.module';
import { ItemService } from '../../shared/item.service';
import { MessageService } from '../../shared/message/services/message.service';
import { UserGroupDetailsComponent } from './user-group-details.component';
import createSpy = jasmine.createSpy;

const mockCode = 'u1';

class MockUserGroupItemService implements Partial<ItemService<Budget>> {
  key$ = of(mockCode);
  load = createSpy('load').and.returnValue(EMPTY);
}

class MockMessageService {
  add() {
    return new Subject();
  }
  clear() {}
  close() {}
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cxFocus]',
  standalone: false,
})
export class MockKeyboadFocusDirective {
  @Input('cxFocus') config: FocusConfig = {};
}

describe('UserGroupDetailsComponent', () => {
  let component: UserGroupDetailsComponent;
  let fixture: ComponentFixture<UserGroupDetailsComponent>;
  let itemService: ItemService<Budget>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        I18nTestingModule,
        UrlTestingModule,
        CardTestingModule,
        DeleteItemModule,
      ],
      declarations: [UserGroupDetailsComponent, MockKeyboadFocusDirective],
      providers: [
        {
          provide: ItemService,
          useClass: MockUserGroupItemService,
        },
      ],
    })
      .overrideComponent(UserGroupDetailsComponent, {
        set: {
          providers: [
            {
              provide: MessageService,
              useClass: MockMessageService,
            },
          ],
        },
      })
      .compileComponents();

    itemService = TestBed.inject(ItemService);

    fixture = TestBed.createComponent(UserGroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger reload of model on each code change', () => {
    expect(itemService.load).toHaveBeenCalledWith(mockCode);
  });
});
