export interface Product {
    id: number;
    name: string;
    price: number;
}

export interface Review {
    productId:number;
    rating: number;
    comment: string;
}

export interface SalesReport {
    totalSales: number;
    unitsSold: number;
    averagePrice: number;
}

export class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NetworkError";
    }
}

export class DataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DataError";
    }
}

const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

export const fetchProductCatalog = (): Promise<Product[]> => {
    return new Promise(async (resolve, reject) => {
        await delay(1000); 

        const random = Math.random();

        if (random < 0.1) {
            return reject(new DataError("Product catalog data is corrupted"));
        } else if (random < 0.2) {
            return reject(new NetworkError("Failed to fetch product catalog"));
        }

        resolve([
            { id: 1, name: "Laptop", price: 1200 },
            { id: 2, name: "Headphones", price: 200 },
            { id: 3, name: "Mouse", price: 50 },
        ]);
    });
};

export const fetchProductReviews = (
    productId: number
): Promise<Review[]> => {
    return new Promise(async (resolve, reject) => {
        await delay(1500);

        const random = Math.random();

        if (random < 0.15) {
            return reject(
                new NetworkError('Failed to fetch reviews for product ID ${productId}')
            );
        } else if (random < 0.25) {
            return reject(
                new DataError('Review data is invalid for product ID ${productId}')
            );
        }

        const reviews: Review[] = [
            { productId, rating: 5, comment: "Excellent product!" },
            { productId, rating: 4, comment: "Very good, worth the price." },
            { productId, rating: 3, comment: "It's okay, not outstanding." },
        ];

        resolve(reviews);
    });
};

export const fetchSalesReport = (): Promise<SalesReport> => {
    return new Promise(async (resolve, reject) => {
        await delay(1000);

        const random = Math.random();

        if (random < 0.15) {
            return reject(new NetworkError("Failed to fetch sales report"));
        } else if (random < 0.25) {
            return reject(
                new DataError("Sales report contains inconsistent data.")
            );
        }
        resolve({
            totalSales: 100000,
            unitsSold: 850,
            averagePrice: 117.65,
        });
    });
};


