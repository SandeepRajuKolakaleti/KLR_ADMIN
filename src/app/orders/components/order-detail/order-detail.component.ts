import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../app/products/services/product.service';
import { AuthService } from '../../../../app/auth/services/auth/auth.service';
import { CommonService } from '../../../../app/shared/services/common/common.service';
import { jsPDF } from 'jspdf';
import { autoTable, CellInput } from 'jspdf-autotable'
import { OrdersService } from '../../services/orders/orders.service';
import { AppConstants } from 'src/app/app.constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonBaseComponent } from 'src/app/shared/components/common-base/common-base.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '../../../../app/shared/services/translate/translate-config.service';
import { StorageService } from '../../../../app/shared/services/storage/storage.service';
import { UsersService } from 'src/app/users/services/users.service';
@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    standalone: false
})
export class OrderDetailComponent extends CommonBaseComponent implements OnInit {
    products = signal<any[]>([]);
    orderDetail: any = {};
    appConstants = AppConstants;
    orderDetailObject: any = {};
    orderDate = '';
    user: any = {};
    subTotal = computed(() =>
        this.products().reduce(
        (total, item) => total + item.UnitPrice * item.Quantity,
        0
        )
    );

    total = computed(() => this.subTotal());
    orderStatuses = [
        { label: 'Pending', value: AppConstants.orderStatus.Pending },
        { label: 'Inprogress', value: AppConstants.orderStatus.Processing },
        { label: 'Delivered', value: AppConstants.orderStatus.Delivered },
        { label: 'Shipped', value: AppConstants.orderStatus.Shipped },
        { label: 'Cancelled', value: AppConstants.orderStatus.Cancelled },
    ];
    selectedStatus: string = '';
    // 🔹 Payment methods
    selectedPayment = '';
    payment = [
        { label: 'Success', value: AppConstants.payment.Success },
        { label: 'Pending', value: AppConstants.payment.Pending },
    ];

    userRole: string = '';

    // 🔹 Delivery men (usually from API)
    selectedDeliverymanId: number | null = null;
    deliveryMen: { id: number; name: string }[] = [];

    constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService, private authService: AuthService,
        private commonService: CommonService, private ordersService: OrdersService, private snackBar: MatSnackBar,
        private userService: UsersService,
        protected override translateService: TranslateService,
        protected override translateConfigService: TranslateConfigService,
        protected override storageService: StorageService
    ) {
    super(translateConfigService, translateService, storageService);
      super.ngOnInit();
    }
    override ngOnInit() {
        console.log(JSON.parse(this.route.snapshot.params['data']));
        this.loadUserRole();
        this.loadOrderDetails();
    }

    loadUserRole() {
        const apiToken: any = localStorage.getItem('ApiToken');
        const parsedApiToken = JSON.parse(apiToken);
        if(parsedApiToken && parsedApiToken.user_permission) {
            this.userRole = parsedApiToken.user_permission;
        }
    }

    loadOrderDetails() {
        const orderData = JSON.parse(this.route.snapshot.params['data']);
        this.loadOrderDetailsData(orderData.Id);
        this.getDeliveryMens();
    }

    loadOrderDetailsData(orderId: number) {
        this.ordersService.getOrderById(orderId).subscribe((response: any) => {
            console.log("Order details fetched", response);
            const orderData = response;
            this.orderDetail = response;
            this.orderDetailObject = JSON.parse(JSON.stringify(response));
            this.orderDate = this.commonService.formatDateTime(new Date(orderData.OrderDate));
            if(orderData.Items && orderData.Items.length > 0) {
                this.getProductsByIds(orderData.Items);
            }
            if(orderData.UserId) {
                this.getProfileDetails(orderData.UserId);
            }
        });
    }

    getDeliveryMens() {
        this.userService.getDeliveryMen().subscribe((response: any) => {
            this.deliveryMen = response.data;
        }); 
    }


    getProductsByIds(products: any) {
        const productIds = products.map((item: any) => item.ProductId);
        this.productService.getProductsByIds(productIds).subscribe((res: any) => {
            res.map((product: any) => {
                const item = products.find((item: any) => item.ProductId === product.Id);
                if (item) {
                    item['ProductName'] = product.Name;
                    item['ThumnailImage'] = product.ThumnailImage;
                } else {
                    item['ThumnailImage'] = 'assets/images/products/product-1.jpg';
                }
            });
            this.getImgBase64(products);
        });
    }

    getImgBase64(products: any) {
        this.commonService.processImgToBase64(products).subscribe((products: any) => {
            let Items = products.map((item: any, index: number) => ({
                productName: item.Name,
                image: item.ThumnailImage || 'assets/images/products/product-1.jpg',
                date: new Date(item.createdAt).toLocaleDateString(),
                ...item
            }));
            this.products.set(Items);
            console.log("Products fetched by IDs", this.products);
        });
    }

    getProfileDetails(id: string) {
        this.authService.getProfileInformation(id).subscribe((response)=> {
            this.user = response;
        }, (error) => {
            console.log(error);
        });
    }

    saveOrderStatus() {
        if (this.selectedStatus) {
            this.orderDetailObject.Status = this.selectedStatus;
            this.orderDetailObject.TotalAmount = Number(this.total());
            if (this.selectedPayment) {
                this.orderDetailObject.IsPaid = this.selectedPayment === AppConstants.payment.Success? true: false;
            }
            if (this.selectedDeliverymanId) {
                this.orderDetailObject.DeliveryBoyId = Number(this.selectedDeliverymanId);
            }
            this.ordersService.updateOrder(this.orderDetailObject).subscribe((response: any) => {
                console.log(response);
                this.snackBar.open(this.translateService.instant('UPDATEDORDERDETAILS'), this.translateService.instant('CLOSE'), AppConstants.SNACK_BAR_DELAY);
                this.loadOrderDetails();
            });
        } else {
            console.log("No status selected.");
        }
    }

    printPdf(orderDetail: any) {
        console.log(orderDetail);
        // window.print()
        const doc = new jsPDF();
        doc.addImage('./assets/imgs/KLR-logo.jpg','JPEG', 5, 5, 50, 60);

        doc.setFont('helvetica', "bold");
        doc.setFontSize(16);
        doc.text('KLR Store - Order Summary', 70, 20);

        doc.setFontSize(12);
        doc.setFont('', "bold");
        doc.text('Order #'+ orderDetail.OrderNumber, 80, 50);

        doc.setFont('', "bold");
        doc.text('Shipping Address: ', 10, 70);
        doc.setFont("helvetica", "normal"); 
        doc.text(orderDetail.ShippingAddress, 10, 75);

        doc.setFont('', "bold");
        doc.text('Payment information: ', 160, 70);
        doc.setFont("helvetica", "normal"); 
        doc.text(orderDetail.PaymentMethod, 160, 75);
        const paymentStatus = (orderDetail.IsPaid)? 'Paid': 'Pending';
        doc.text('Status: '+ paymentStatus, 160, 80);

        doc.setFont('', "bold");
        doc.text('Order information: ', 10,90);
        doc.setFont("helvetica", "normal"); 
        doc.text(this.orderDate, 10, 95);
        doc.text('Status: '+ orderDetail.Status, 10, 100);


        let tableData: any[] = [];
        this.products().map((product) => {
            let Total = product.UnitPrice * product.Quantity
            tableData.push({
                ProductName: product.ProductName, UnitPrice: product.UnitPrice, Quantity: product.Quantity, Total: Total
            });
        })
        autoTable(doc, {
            margin: { top: 110 },

            body: tableData, // this.products(),
            columns: [
                { header: 'Product', dataKey: 'ProductName' },
                { header: 'UnitPrice', dataKey: 'UnitPrice' },
                { header: 'Quantity', dataKey: 'Quantity' },
                { header: 'Total', dataKey: 'Total' },
            ],
        });
        doc.setFont('', "bold");
        doc.text('Subtotal: '+ this.subTotal(), 170, 170)
        doc.text('Total: '+ this.total(), 170, 180);

        doc.save(orderDetail.OrderNumber + '.pdf');
    }
}
