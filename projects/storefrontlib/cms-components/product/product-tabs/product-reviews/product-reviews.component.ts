/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  isNotNullable,
  Product,
  ProductReviewService,
  Review,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CustomFormValidators } from '../../../../shared/index';
import { CurrentProductService } from '../../current-product.service';

@Component({
  selector: 'cx-product-reviews',
  templateUrl: './product-reviews.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewsComponent {
  @ViewChild('titleInput', { static: false }) titleInput: ElementRef;
  @ViewChild('writeReviewButton', { static: false })
  writeReviewButton: ElementRef;

  isWritingReview = false;

  // TODO: configurable
  initialMaxListItems = 5;
  maxListItems: number;
  reviewForm: UntypedFormGroup;

  product$: Observable<Product | null> =
    this.currentProductService.getProduct();

  reviews$: Observable<Review[]> = this.product$.pipe(
    filter(isNotNullable),
    map((p) => p.code ?? ''),
    distinctUntilChanged(),
    switchMap((productCode) =>
      this.reviewService
        .getByProductCode(productCode)
        .pipe(
          switchMap((reviews) => this.reviewService.updateSpamInfo(reviews))
        )
    ),
    tap(() => {
      this.resetReviewForm();
      this.maxListItems = this.initialMaxListItems;
    })
  );

  constructor(
    protected reviewService: ProductReviewService,
    protected currentProductService: CurrentProductService,
    private fb: UntypedFormBuilder,
    protected cd: ChangeDetectorRef
  ) {}

  initiateWriteReview(): void {
    this.isWritingReview = true;

    this.cd.detectChanges();

    if (this.titleInput && this.titleInput.nativeElement) {
      this.titleInput.nativeElement.focus();
    }
  }

  cancelWriteReview(): void {
    this.isWritingReview = false;
    this.resetReviewForm();

    this.cd.detectChanges();

    if (this.writeReviewButton && this.writeReviewButton.nativeElement) {
      this.writeReviewButton.nativeElement.focus();
    }
  }

  setRating(rating: number): void {
    this.reviewForm.controls.rating.setValue(rating);
  }

  submitReview(product: Product) {
    if (this.reviewForm.valid) {
      this.addReview(product);
    } else {
      this.reviewForm.markAllAsTouched();
    }
  }

  addReview(product: Product): void {
    const reviewFormControls = this.reviewForm.controls;
    const review: Review = {
      headline: reviewFormControls.title.value,
      comment: reviewFormControls.comment.value,
      rating: reviewFormControls.rating.value,
      alias: reviewFormControls.reviewerName.value,
    };

    this.reviewService.add(product.code ?? '', review);

    this.isWritingReview = false;
    this.resetReviewForm();

    this.cd.detectChanges();

    if (this.writeReviewButton && this.writeReviewButton.nativeElement) {
      this.writeReviewButton.nativeElement.focus();
    }
  }

  private resetReviewForm(): void {
    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      comment: ['', Validators.required],
      rating: [null, CustomFormValidators.starRatingEmpty],
      reviewerName: '',
    });
  }

  aiPositiveSentiments$ = this.reviews$.pipe(
    filter(isNotNullable),
    map((reviews) => reviews ?? []),
    distinctUntilChanged(),
    switchMap((reviews) => {
      return this.reviewService
        .getAiReponse(reviews, 'positiveSentiments')
        .pipe(
          map((sentiments) => {
            let sentimentArray =
              sentiments?.choices[0]?.message?.content.split('\n');
            return sentimentArray;
          })
        );
    })
  );
  aiNegativeSentiments$ = this.reviews$.pipe(
    filter(isNotNullable),
    map((reviews) => reviews ?? []),
    distinctUntilChanged(),
    switchMap((reviews) => {
      return this.reviewService
        .getAiReponse(reviews, 'negativeSentiments')
        .pipe(
          map((sentiments) => {
            let sentimentArray =
              sentiments?.choices[0]?.message?.content.split('\n');
            return sentimentArray;
          })
        );
    })
  );

  aiSummary$ = this.reviews$.pipe(
    filter(isNotNullable),
    map((reviews) => reviews ?? []),
    distinctUntilChanged(),
    switchMap((reviews) => this.reviewService.getAiReponse(reviews, 'summary'))
  );

  aiSentimentPercentage$ = this.reviews$.pipe(
    filter(isNotNullable),
    map((reviews) => reviews ?? []),
    distinctUntilChanged(),
    switchMap((reviews) => {
      return this.reviewService
        .getAiReponse(reviews, 'sentimentsPercentage')
        .pipe(
          map((sentiments) => {
            return this.convertStringToNumberArray(
              sentiments?.choices[0]?.message?.content
            );
          })
        );
    })
  );

  convertStringToNumberArray(x: String): number[] {
    x = x.substring(1, x.length - 1);
    var y = x.split(',').map(function (item) {
      return parseInt(item, 10);
    });
    return y;
  }

  getReview(product: Product) {
    let reviewFormControls = this.reviewForm.controls;
    let review: Review = {
      headline: reviewFormControls.title.value,
      rating: reviewFormControls.rating.value,
    };
    this.reviewService.getComment(review, product).subscribe((response) => {
      this.reviewForm.patchValue({ comment: response });
    });
  }
}
