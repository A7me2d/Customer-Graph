import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class DashboardComponent implements OnInit {
  Cards: any[] = [];
  searchText: string = '';
  filteredCards: any[] = [];

  transactions: any[] = [];
  customerTotals: { [key: number]: number } = {};
  date1: any;
  date2: any;
  amunt1: any = 0;
  amunt2: any = 0;
  chartOptions: any = {};

  constructor(private customerService: CustomerService, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }


  filterCards(): void {
    if (!this.searchText) {
      this.filteredCards = [...this.Cards];
    } else {
      this.filteredCards = this.Cards.filter(card =>
        card.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }




  ngOnInit() {
    this.customerService.getTransactions().subscribe((transactions) => {
      this.transactions = transactions;

      this.customerService.getCustomers().subscribe((customers) => {
        this.Cards = customers;

        this.Cards.forEach(customer => {
          const customerId = (customer.id);
          let totalAmount = 0;
          this.transactions.forEach(transaction => {

            if (transaction.customer_id == Number(customerId)) {

              totalAmount += transaction.amount;
            }
          });
          this.customerTotals[customerId] = totalAmount;
        });

        this.cdr.markForCheck();
      });
    });

    this.ToSeeAllCustomer()
  }

  ToSeeAllCustomer(){

    this.chartOptions = {
      animationEnabled: true,
      title: {
        text: "Graph For All Customer"
      },
      axisY: {
        title: "EGP"
      },
      axisX: {
        title: "Customer",
        interval: 1,
        intervalType: "customer"
      },
      toolTip: {
        content: "{y} EGP"
      },
      data: [{
        type: "splineArea",
        color: "rgba(54,158,173,.7)",
        dataPoints: [
          { x: 0, label: "Ahmed Ali", y: 3000  },
          { x: 1, label: "Aya Elsayed", y: 1850 },
          { x: 2, label: "Mina Adel", y: 1750 },
          { x: 3, label: "Sarah Reda", y: 750 },
          { x: 4, label: "Mohamed Sayed", y: 3375 },
          { x: 5, label: "Ahmed Hany", y: 5500 },
          { x: 6, label: "Omer Matter", y: 2100 },
        ]
      }]
    };
  }

  


  cardid: any[] = [];
  selectedCustomer: any = null;
  selectedCustomerTransactions: any[] = [];

  async onViewDetails(cardId: number) {
    this.cardid.push(cardId);
    this.display(cardId);
    this.updateChartOptions(cardId);
  }

  onViewDetails2(cardId: number) {
    this.onViewDetails(cardId);
    this.onViewDetails(cardId);
  }


  async display(cardId: number) {
    this.selectedCustomer = this.Cards.find(c => c.id === cardId);
    this.selectedCustomerTransactions = this.transactions.filter(t => Number(t.customer_id) === Number(cardId));

    if (this.selectedCustomer) {
      this.date1 = this.selectedCustomerTransactions.length >= 1 ? this.selectedCustomerTransactions[0].date : null;
      this.date2 = this.selectedCustomerTransactions.length >= 2 ? this.selectedCustomerTransactions[1].date : null;

      this.amunt1 = this.selectedCustomerTransactions.length >= 1 ? this.selectedCustomerTransactions[0].amount : 0;
      this.amunt2 = this.selectedCustomerTransactions.length >= 2 ? this.selectedCustomerTransactions[1].amount : 0;


      this.ngZone.run(() => {
        this.cdr.detectChanges();
      });
    } else {
      console.log(`Customer with ID ${cardId} not found.`);
    }
  }


  updateChartOptions(cardId: number) {
    this.chartOptions = {
      animationEnabled: true,
      title: {
        text: `Graph For Cusomer ${cardId}`
      },
      axisX: {
        valueFormatString: "DD MMM", 
        interval: 1,
        intervalType: "day" 
      },
      axisY: {
        title: "EGP"
      },
      toolTip: {
        content: "{y} EGP"
      },
      data: [{
        type: "splineArea",
        color: "rgba(54,158,173,.7)",
        xValueFormatString: "YYYY",
        dataPoints: [
          { x: new Date(2021, 12, 31), y: 0 },
          { x: new Date(2022, 1, 1), y: this.amunt1 },
          { x: new Date(2022, 1, 2), y: this.amunt2 },
          { x: new Date(2022, 1, 3), y: 0 },
        ]
      }]
    };
  }
}