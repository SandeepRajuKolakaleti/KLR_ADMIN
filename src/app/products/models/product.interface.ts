export interface ProductI {
    Id?: number;
    ThumnailImage: string;
    Name: string;
    Slug: string;
    Category: number;
    SubCategory: number;
    ChildCategory: number;
    Brand: number;
    SKU: string;
    Price: number;
    OfferPrice: number;
    StockQuantity: number;
    Weight: number;
    ShortDescription: string;
    LongDescription: string;
    Highlight: { [key: string]: boolean };
    Status: string; 
    SEOTitle: string;
    SEODescription: string;
    Specifications: {key: string; specification: string }[];
    Vendor: string;
}

// product.Specifications = [
//     { key: "Processor", specification: "Snapdragon 888" },
//     { key: "RAM", specification: "8GB" },
//     { key: "Battery", specification: "5000mAh" }
// ];
// product.Highlight = {
//     "Top Product": true,
//     "New Arrival": true,
//     "Best Product": true,
//     "Featured Product": false
// };