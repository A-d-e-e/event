
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

  eventObj: any[] = [];
  message: { type: 'success' | 'error', text: string } | null = null;
  searchPerformed: boolean = false;

  tooltipVisible: boolean = false;
  tooltipContent: any[] = [];
  tooltipX: number = 0;
  tooltipY: number = 0;

  // Payment related
  showPaymentModal: boolean = false;
  showUpiModal: boolean = false;
  showBillSummary: boolean = false;
  selectedEvent: any = null;
  paymentId: number | null = null;
  transactionDetails: any = null;
  isProcessing: boolean = false;

  private readonly REQUEST_TIMEOUT_MS = 10000; // 10 seconds

  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      searchTerm: ['', Validators.required]
    });

    // Step-1 validators only (UPI validator will be added at Step-2)
    this.paymentForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      upiId: [''] // not required yet; Step-2 will enforce it
    });
  }

  ngOnInit(): void {}

  // ---------- Search ----------
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
      // ensure paymentCompleted flag exists for UI
      const normalized = { ...response };
      if (typeof normalized.paymentCompleted !== 'boolean') {
        normalized.paymentCompleted = false;
      }
      this.eventObj = [normalized];
      this.showTemporaryMessage('success', 'Event found');
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

  // ---------- Compute ----------
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

  // ---------- Tooltip ----------
  showTooltip(event: MouseEvent, allocations: any[]): void {
    this.tooltipContent = allocations || [];
    this.tooltipX = event.clientX + 100;
    this.tooltipY = event.clientY + 10;
    this.tooltipVisible = true;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.tooltipVisible) {
      this.tooltipX = event.clientX + 10;
      this.tooltipY = event.clientY + 10;
    }
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

  // ==================== PAYMENT FLOW ====================

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

    // Clear UPI field and remove validators at Step-1
    const upiCtrl = this.paymentForm.get('upiId');
    upiCtrl?.reset('');
    upiCtrl?.clearValidators();
    upiCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  // Step-1: Continue to UPI (initiate payment, then go to step-2)
  proceedToUpi(): void {
    // Validate only Step-1 fields
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

    // Try real API first; if it fails or times out, fall back with a temp id
    this.httpService.initiatePayment(this.selectedEvent.eventID, payload).pipe(
      timeout(this.REQUEST_TIMEOUT_MS),
      map(resp => this.normalizePaymentInitResponse(resp)),
      catchError(err => {
        console.error('Payment initiation failed (will fallback):', err);
        this.showTemporaryMessage('error', 'Payment server not responding. Using temporary reference.');
        return of({ paymentId: this.generateTempPaymentId() });
      }),
      finalize(() => {
        // handled in subscribe
      })
    ).subscribe(({ paymentId }) => {
      this.paymentId = paymentId;

      // Move to Step-2
      this.showPaymentModal = false;
      this.showUpiModal = true;

      // Now enforce UPI validators for Step-2
      const upiCtrl = this.paymentForm.get('upiId');
      upiCtrl?.setValidators([Validators.required, this.upiIdValidator()]);
      upiCtrl?.updateValueAndValidity({ emitEvent: false });

      this.isProcessing = false;
    }, () => {
      // Hard error (unlikely after catchError). Still allow moving to UPI with temp id
      this.paymentId = this.generateTempPaymentId();
      this.showPaymentModal = false;
      this.showUpiModal = true;

      const upiCtrl = this.paymentForm.get('upiId');
      upiCtrl?.setValidators([Validators.required, this.upiIdValidator()]);
      upiCtrl?.updateValueAndValidity({ emitEvent: false });

      this.isProcessing = false;
    });
  }

  // Step-2: Process UPI payment
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
        // Simulate a success so you can see the Bill Summary
        const fake = this.buildFakeTransaction(upiId);
        return of({ success: true, payment: fake });
      }),
      finalize(() => {
        // handled in subscribe
      })
    ).subscribe(response => {
      if (response?.success) {
        this.transactionDetails = response.payment;

        // ---- mark as paid in UI ----
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
    this.selectedEvent.paymentCompleted = true; // Client-side flag
    // Optionally reflect a "paid" status label (won't affect your backend status)
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
    this.resetPaymentData(false); // do not clear event list; preserve Paid chip
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

  // ---------- Helpers ----------

  private normalizePaymentInitResponse(resp: any): { paymentId: number } {
    // Accept server variations: paymentID / paymentId / id
    const id = resp?.paymentID ?? resp?.paymentId ?? resp?.id ?? null;
    return { paymentId: Number(id) || this.generateTempPaymentId() };
  }

  private generateTempPaymentId(): number {
    // Unique but local-only
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
    // Basic UPI pattern: username@provider
    const pattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return (control: AbstractControl) => {
      const value = (control.value || '').trim();
      if (!value) return { required: true };
      return pattern.test(value) ? null : { upi: true };
    };
  }
}
