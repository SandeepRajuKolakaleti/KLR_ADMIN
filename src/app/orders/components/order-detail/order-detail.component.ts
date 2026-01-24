import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../app/products/services/product.service';
import { AuthService } from '../../../../app/auth/services/auth/auth.service';
import { CommonService } from '../../../../app/shared/services/common/common.service';
import { jsPDF } from 'jspdf';
import { autoTable, CellInput } from 'jspdf-autotable'
@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    standalone: false
})
export class OrderDetailComponent implements OnInit {
    products = signal<any[]>([]);
    orderDetail: any = {};
    orderDate = '';
    user: any = {};
    subTotal = computed(() =>
        this.products().reduce(
        (total, item) => total + item.UnitPrice * item.Quantity,
        0
        )
    );

    total = computed(() => this.subTotal());

    constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService, private authService: AuthService,
        private commonService: CommonService
    ) {}
    ngOnInit() {
        console.log(JSON.parse(this.route.snapshot.params['data']));
        const orderData = JSON.parse(this.route.snapshot.params['data']);
        this.orderDetail = orderData;
        this.orderDate = this.commonService.formatDateTime(new Date(orderData.OrderDate));
        if(orderData.Items && orderData.Items.length > 0) {
            this.getProductsByIds(orderData.Items);
        }
        if(orderData.UserId) {
            this.getProfileDetails(orderData.UserId);
        }
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
