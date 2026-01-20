import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  searchForm: FormGroup;
  paymentForm: FormGroup;
  
  selectedEvent: any = null;
  totalAmount: number = 0;
  allocations: any[] = [];
  
  showPaymentModal: boolean = false;
  showUpiModal: boolean = false;
  showBillSummary: boolean = false;
  
  paymentId: number | null = null;
  transactionDetails: any = null;
  
  message: { type: 'success' | 'error', text: string } | null = null;
  isProcessing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    this.searchForm = this.formBuilder.group({
      searchTerm: ['', Validators.required]
    });

    this.paymentForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      upiId: ['', [Validators.required, Validators.pattern(/^[\w.\-_]{3,}@[a-zA-Z]{3,}$/)]]
    });
  }

  ngOnInit(): void {}

  // Search for event
  searchEvent(): void {
    if (this.searchForm.valid) {
      const searchTerm = this.searchForm.get('searchTerm')?.value;
      
      if (isNaN(searchTerm)) {
        // Search by title
        this.httpService.GetEventdetailsbyTitleforClient(searchTerm).subscribe(
          response => this.handleEventResponse(response),
          error => this.handleError('Event not found')
        );
      } else {
        // Search by ID
        this.httpService.getBookingDetails(searchTerm).subscribe(
          response => this.handleEventResponse(response),
          error => this.handleError('Event not found')
        );
      }
    }
  }

  // Handle event response
  private handleEventResponse(event: any): void {
    if (event && event.eventID) {
      this.selectedEvent = event;
      this.allocations = event.allocations || [];
      this.calculateTotal();
      this.showMessage('success', 'Event found! Review details and proceed to payment.');
    } else {
      this.handleError('Event not found');
    }
  }

  // Calculate total amount
  calculateTotal(): void {
    this.totalAmount = this.allocations.reduce((total, allocation) => {
      const price = allocation.resource?.price || 0;
      const quantity = allocation.quantity || 0;
      return total + (price * quantity);
    }, 0);
  }

  // Calculate subtotal for allocation
  calculateSubtotal(allocation: any): number {
    return (allocation.resource?.price || 0) * (allocation.quantity || 0);
  }

  // Open payment modal
  openPaymentModal(): void {
    if (this.totalAmount <= 0) {
      this.showMessage('error', 'No payment required for this event');
      return;
    }
    this.showPaymentModal = true;
  }

  // Close payment modal
  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentForm.patchValue({
      upiId: ''
    });
  }

  // Proceed to UPI payment
  proceedToUpi(): void {
    if (this.paymentForm.get('customerName')?.invalid ||
        this.paymentForm.get('customerEmail')?.invalid ||
        this.paymentForm.get('customerPhone')?.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    // Initiate payment
    const paymentData = {
      amount: this.totalAmount,
      paymentMethod: 'UPI',
      customerName: this.paymentForm.get('customerName')?.value,
      customerEmail: this.paymentForm.get('customerEmail')?.value,
      customerPhone: this.paymentForm.get('customerPhone')?.value
    };

    this.isProcessing = true;
    this.httpService.initiatePayment(this.selectedEvent.eventID, paymentData).subscribe(
      response => {
        this.paymentId = response.paymentID;
        this.showPaymentModal = false;
        this.showUpiModal = true;
        this.isProcessing = false;
      },
      error => {
        this.handleError('Failed to initiate payment');
        this.isProcessing = false;
      }
    );
  }

  // Process UPI payment
  processUpiPayment(): void {
    if (this.paymentForm.get('upiId')?.invalid) {
      this.paymentForm.get('upiId')?.markAsTouched();
      return;
    }

    if (!this.paymentId) {
      this.handleError('Payment ID not found');
      return;
    }

    const upiId = this.paymentForm.get('upiId')?.value;
    this.isProcessing = true;

    this.httpService.processUpiPayment(this.paymentId, { upiId }).subscribe(
      response => {
        if (response.success) {
          this.transactionDetails = response.payment;
          this.showUpiModal = false;
          this.showBillSummary = true;
          this.isProcessing = false;
        } else {
          this.handleError(response.message || 'Payment failed');
          this.isProcessing = false;
        }
      },
      error => {
        this.handleError('Payment processing failed');
        this.isProcessing = false;
      }
    );
  }

  // Close UPI modal
  closeUpiModal(): void {
    this.showUpiModal = false;
  }

  // Close bill summary
  closeBillSummary(): void {
    this.showBillSummary = false;
    this.resetAll();
  }

  // Download bill
  downloadBill(): void {
    window.print();
  }

  // Share bill
  shareBill(): void {
    const billText = this.generateBillText();
    if (navigator.share) {
      navigator.share({
        title: 'Event Payment Receipt',
        text: billText
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(billText).then(() => {
        this.showMessage('success', 'Bill details copied to clipboard!');
      });
    }
  }

  // Generate bill text
  private generateBillText(): string {
    let text = `PAYMENT RECEIPT\n\n`;
    text += `Event: ${this.selectedEvent.title}\n`;
    text += `Transaction ID: ${this.transactionDetails.transactionId}\n`;
    text += `Date: ${new Date(this.transactionDetails.paymentDate).toLocaleString()}\n\n`;
    text += `Customer: ${this.transactionDetails.customerName}\n`;
    text += `Email: ${this.transactionDetails.customerEmail}\n`;
    text += `Phone: ${this.transactionDetails.customerPhone}\n\n`;
    text += `ITEMS:\n`;
    this.allocations.forEach(alloc => {
      text += `${alloc.resource.name} x ${alloc.quantity} = ₹${this.calculateSubtotal(alloc)}\n`;
    });
    text += `\nTOTAL: ₹${this.totalAmount}`;
    return text;
  }

  // Reset all data
  resetAll(): void {
    this.selectedEvent = null;
    this.allocations = [];
    this.totalAmount = 0;
    this.paymentId = null;
    this.transactionDetails = null;
    this.searchForm.reset();
    this.paymentForm.reset();
  }

  // Show message
  private showMessage(type: 'success' | 'error', text: string): void {
    this.message = { type, text };
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  // Handle error
  private handleError(message: string): void {
    this.showMessage('error', message);
  }
}