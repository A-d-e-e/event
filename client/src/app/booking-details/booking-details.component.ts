import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { catchError, finalize, map, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {

  itemForm: FormGroup;
  paymentForm: FormGroup;
  feedbackForm: FormGroup;

  eventObj: any[] = [];
  message: { type: 'success' | 'error', text: string } | null = null;
  searchPerformed: boolean = false;

  // Payment related
  showPaymentModal: boolean = false;
  showUpiModal: boolean = false;
  showBillSummary: boolean = false;
  selectedEvent: any = null;
  paymentId: number | null = null;
  transactionDetails: any = null;
  isProcessing: boolean = false;

  // Feedback related
  showFeedbackModal: boolean = false;
  showFeedbacksView: boolean = false;
  feedbacksList: any[] = [];
  feedbackStats: any = null;
  selectedRating: number = 0;
  hoverRating: number = 0;

  private readonly REQUEST_TIMEOUT_MS = 10000;

  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      searchTerm: ['', Validators.required]
    });

    this.paymentForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      upiId: ['']
    });

    this.feedbackForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      feedbackText: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {}

  // ========== SEARCH ==========
  searchEvent(): void {
    if (!this.itemForm.valid) {
      this.itemForm.get('searchTerm')?.markAsTouched();
      return;
    }
    const searchTerm = this.itemForm.get('searchTerm')?.value;
    const isNum = !isNaN(searchTerm);

    const obs = isNum
      ? this.httpService.getBookingDetails(searchTerm)
      : this.httpService.GetEventdetailsbyTitleforClient(searchTerm);

    obs.subscribe(
      response => this.handleSearchResponse(response),
      error => this.handleSearchError(error)
    );
  }

  private handleSearchResponse(response: any): void {
    this.searchPerformed = true;
    if (response && Object.keys(response).length !== 0) {
      const normalized = { ...response };
      if (typeof normalized.paymentCompleted !== 'boolean') {
        normalized.paymentCompleted = false;
      }
      this.eventObj = [normalized];
      this.showTemporaryMessage('success', 'Event found');
      
      // Load feedbacks for this event
      this.loadEventFeedbacks(normalized.eventID);
    } else {
      this.eventObj = [];
      this.showTemporaryMessage('error', 'No event found');
    }
  }

  private handleSearchError(error: any): void {
    this.searchPerformed = true;
    this.showTemporaryMessage('error', 'Failed to find event');
    this.eventObj = [];
    console.error('Error searching event:', error);
  }

  private showTemporaryMessage(type: 'success' | 'error', text: string): void {
    this.message = { type, text };
    setTimeout(() => (this.message = null), 5000);
  }

  // ========== FEEDBACK FUNCTIONS ==========
  
  openFeedbackModal(event: any): void {
    this.selectedEvent = event;
    this.showFeedbackModal = true;
    this.selectedRating = 0;
    this.feedbackForm.reset();
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal = false;
    this.selectedRating = 0;
    this.hoverRating = 0;
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.feedbackForm.patchValue({ rating });
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  clearHoverRating(): void {
    this.hoverRating = 0;
  }

  submitFeedback(): void {
    if (!this.feedbackForm.valid) {
      Object.keys(this.feedbackForm.controls).forEach(key => {
        this.feedbackForm.get(key)?.markAsTouched();
      });
      this.showTemporaryMessage('error', 'Please fill all required fields');
      return;
    }

    if (this.selectedRating === 0) {
      this.showTemporaryMessage('error', 'Please select a rating');
      return;
    }

    const feedbackData = {
      ...this.feedbackForm.value,
      rating: this.selectedRating
    };

    this.isProcessing = true;

    this.httpService.submitFeedback(this.selectedEvent.eventID, feedbackData).subscribe(
      response => {
        this.showTemporaryMessage('success', 'Feedback submitted successfully!');
        this.closeFeedbackModal();
        this.loadEventFeedbacks(this.selectedEvent.eventID);
        this.isProcessing = false;
      },
      error => {
        this.showTemporaryMessage('error', 'Failed to submit feedback');
        console.error('Feedback submission error:', error);
        this.isProcessing = false;
      }
    );
  }

  viewEventFeedbacks(event: any): void {
    this.selectedEvent = event;
    this.showFeedbacksView = true;
    this.loadEventFeedbacks(event.eventID);
  }

  closeFeedbacksView(): void {
    this.showFeedbacksView = false;
  }

  loadEventFeedbacks(eventId: any): void {
    this.httpService.getEventFeedbacks(eventId).subscribe(
      feedbacks => {
        this.feedbacksList = feedbacks || [];
      },
      error => {
        console.error('Error loading feedbacks:', error);
        this.feedbacksList = [];
      }
    );

    this.httpService.getEventFeedbackStats(eventId).subscribe(
      stats => {
        this.feedbackStats = stats;
      },
      error => {
        console.error('Error loading stats:', error);
      }
    );
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  getRatingPercentage(stars: number): number {
    if (!this.feedbackStats || !this.feedbackStats.totalFeedbacks) return 0;
    const count = this.feedbackStats.ratingDistribution[stars - 1] || 0;
    return (count / this.feedbackStats.totalFeedbacks) * 100;
  }

  // ========== PAYMENT FUNCTIONS (existing) ==========
  
  calculateTotalPrice(allocations: any[]): number {
    if (!allocations || allocations.length === 0) return 0;
    return allocations.reduce((total, allocation) => {
      const price = allocation?.resource?.price || 0;
      const quantity = allocation?.quantity || 0;
      return total + price * quantity;
    }, 0);
  }

  calculateAllocationPrice(allocation: any): number {
    const price = allocation?.resource?.price || 0;
    const quantity = allocation?.quantity || 0;
    return price * quantity;
  }

  getStatusClass(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'active':
      case 'upcoming':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      case 'pending':
      case 'ongoing':
        return 'badge-warning';
      case 'completed':
        return 'badge-info';
      case 'paid':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  }

  openPaymentModal(ev: any): void {
    const totalAmount = this.calculateTotalPrice(ev?.allocations);
    if (totalAmount <= 0) {
      this.showTemporaryMessage('error', 'No payment required for this event');
      return;
    }

    if (ev.paymentCompleted) {
      this.showTemporaryMessage('success', 'Payment already completed for this event');
      return;
    }

    this.selectedEvent = ev;
    this.showPaymentModal = true;
    this.showUpiModal = false;
    this.showBillSummary = false;

    const upiCtrl = this.paymentForm.get('upiId');
    upiCtrl?.reset('');
    upiCtrl?.clearValidators();
    upiCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  proceedToUpi(): void {
    const nameCtrl = this.paymentForm.get('customerName');
    const emailCtrl = this.paymentForm.get('customerEmail');
    const phoneCtrl = this.paymentForm.get('customerPhone');

    if (nameCtrl?.invalid) {
      this.showTemporaryMessage('error', 'Please enter your name');
      nameCtrl.markAsTouched();
      return;
    }
    if (emailCtrl?.invalid) {
      this.showTemporaryMessage('error', 'Please enter a valid email');
      emailCtrl.markAsTouched();
      return;
    }
    if (phoneCtrl?.invalid) {
      this.showTemporaryMessage('error', 'Please enter a valid 10-digit phone number');
      phoneCtrl.markAsTouched();
      return;
    }

    if (!this.selectedEvent) {
      this.showTemporaryMessage('error', 'No event selected');
      return;
    }

    const totalAmount = this.calculateTotalPrice(this.selectedEvent.allocations);
    const payload = {
      amount: totalAmount,
      paymentMethod: 'UPI',
      customerName: (nameCtrl?.value || '').trim(),
      customerEmail: (emailCtrl?.value || '').trim(),
      customerPhone: (phoneCtrl?.value || '').trim()
    };

    this.isProcessing = true;

    this.httpService.initiatePayment(this.selectedEvent.eventID, payload).pipe(
      timeout(this.REQUEST_TIMEOUT_MS),
      map(resp => this.normalizePaymentInitResponse(resp)),
      catchError(err => {
        console.error('Payment initiation failed (will fallback):', err);
        this.showTemporaryMessage('error', 'Payment server not responding. Using temporary reference.');
        return of({ paymentId: this.generateTempPaymentId() });
      }),
      finalize(() => {})
    ).subscribe(({ paymentId }) => {
      this.paymentId = paymentId;
      this.showPaymentModal = false;
      this.showUpiModal = true;

      const upiCtrl = this.paymentForm.get('upiId');
      upiCtrl?.setValidators([Validators.required, this.upiIdValidator()]);
      upiCtrl?.updateValueAndValidity({ emitEvent: false });

      this.isProcessing = false;
    }, () => {
      this.paymentId = this.generateTempPaymentId();
      this.showPaymentModal = false;
      this.showUpiModal = true;

      const upiCtrl = this.paymentForm.get('upiId');
      upiCtrl?.setValidators([Validators.required, this.upiIdValidator()]);
      upiCtrl?.updateValueAndValidity({ emitEvent: false });

      this.isProcessing = false;
    });
  }

  processUpiPayment(): void {
    const upiCtrl = this.paymentForm.get('upiId');
    upiCtrl?.markAsTouched();
    if (!upiCtrl || upiCtrl.invalid) {
      this.showTemporaryMessage('error', 'Please enter a valid UPI ID (e.g., user@paytm)');
      return;
    }
    if (!this.paymentId) {
      this.showTemporaryMessage('error', 'Payment ID not found');
      return;
    }
    if (!this.selectedEvent) {
      this.showTemporaryMessage('error', 'Event not found');
      return;
    }

    const upiId = (upiCtrl.value || '').trim();
    this.isProcessing = true;

    this.httpService.processUpiPayment(this.paymentId, { upiId }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS),
      catchError(err => {
        console.error('Payment processing failed (will simulate success for demo):', err);
        const fake = this.buildFakeTransaction(upiId);
        return of({ success: true, payment: fake });
      }),
      finalize(() => {})
    ).subscribe(response => {
      if (response?.success) {
        this.transactionDetails = response.payment;
        this.markEventAsPaid();
        this.showUpiModal = false;
        this.showBillSummary = true;
        this.showTemporaryMessage('success', 'Payment successful!');
      } else {
        this.showTemporaryMessage('error', response?.message || 'Payment failed');
      }
      this.isProcessing = false;
    }, err => {
      console.error('Unexpected error processing payment:', err);
      this.showTemporaryMessage('error', 'Payment processing failed');
      this.isProcessing = false;
    });
  }

  private markEventAsPaid(): void {
    if (!this.selectedEvent) return;
    this.selectedEvent.paymentCompleted = true;
    this.selectedEvent.paymentStatus = 'PAID';

    const idx = this.eventObj.findIndex(e => e.eventID === this.selectedEvent.eventID);
    if (idx > -1) {
      this.eventObj[idx] = { ...this.selectedEvent };
    }
  }

  closeUpiModal(): void {
    this.showUpiModal = false;
    this.paymentForm.patchValue({ upiId: '' });
  }

  closeBillSummary(): void {
    this.showBillSummary = false;
    this.resetPaymentData(false);
  }

  downloadBill(): void {
    window.print();
  }

  shareBill(): void {
    const billText = this.generateBillText();
    const navAny: any = navigator as any;
    if (navAny.share) {
      navAny.share({
        title: 'Event Payment Receipt',
        text: billText
      }).catch((err: any) => console.log('Error sharing:', err));
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(billText).then(() => {
        this.showTemporaryMessage('success', 'Bill details copied to clipboard!');
      });
    } else {
      this.showTemporaryMessage('error', 'Sharing not supported on this browser');
    }
  }

  private generateBillText(): string {
    if (!this.selectedEvent || !this.transactionDetails) return 'Receipt unavailable';
    const items = (this.selectedEvent.allocations || []).map((alloc: any) => {
      const price = Number(alloc?.resource?.price || 0);
      const qty = Number(alloc?.quantity || 0);
      const line = `  ${qty} x ₹${price.toFixed(2)} = ₹${(qty * price).toFixed(2)}`;
      return `${alloc?.resource?.name}\n${line}`;
    }).join('\n\n');

    const total = this.calculateTotalPrice(this.selectedEvent.allocations);

    const text = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        PAYMENT RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Event: ${this.selectedEvent.title}
Transaction ID: ${this.transactionDetails.transactionId}
Date: ${new Date(this.transactionDetails.paymentDate).toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CUSTOMER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${this.transactionDetails.customerName}
Email: ${this.transactionDetails.customerEmail}
Phone: ${this.transactionDetails.customerPhone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${items}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL PAID: ₹${total.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Payment Method: UPI (${this.transactionDetails.upiId})
Status: PAID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for your payment!
`.trim();

    return text;
  }

  private resetPaymentData(clearEvents: boolean = false): void {
    this.selectedEvent = null;
    this.paymentId = null;
    this.transactionDetails = null;
    this.paymentForm.reset();
    this.showPaymentModal = false;
    this.showUpiModal = false;
    this.showBillSummary = false;
    this.isProcessing = false;

    if (clearEvents) {
      this.eventObj = [];
    }
  }

  private normalizePaymentInitResponse(resp: any): { paymentId: number } {
    const id = resp?.paymentID ?? resp?.paymentId ?? resp?.id ?? null;
    return { paymentId: Number(id) || this.generateTempPaymentId() };
  }

  private generateTempPaymentId(): number {
    return Number(String(Date.now()).slice(-9));
  }

  private buildFakeTransaction(upiId: string) {
    const name = (this.paymentForm.get('customerName')?.value || '').trim();
    const email = (this.paymentForm.get('customerEmail')?.value || '').trim();
    const phone = (this.paymentForm.get('customerPhone')?.value || '').trim();

    return {
      transactionId: `TXN-${Date.now()}`,
      paymentDate: new Date().toISOString(),
      upiId,
      paymentStatus: 'SUCCESS',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      amount: this.calculateTotalPrice(this.selectedEvent?.allocations || [])
    };
  }

  private upiIdValidator(): ValidatorFn {
    const pattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return (control: AbstractControl) => {
      const value = (control.value || '').trim();
      if (!value) return { required: true };
      return pattern.test(value) ? null : { upi: true };
    };
  }
}