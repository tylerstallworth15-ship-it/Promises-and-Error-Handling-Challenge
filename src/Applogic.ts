import {
  fetchProductCatalog,
  fetchProductReviews,
  fetchSalesReport,
  Product,
  Review,
  SalesReport,
  NetworkError,
  DataError,
} from "./apiSimulator";

import { retryPromise } from "./retryPromise";

interface ProductWithReviews {
  product: Product;
  reviews: Review[];
}

function runDashboard(): void {
  console.log("Starting e-commerce dashboard...");

  retryPromise(fetchProductCatalog, 3, 500)
    .then((products) => {
      console.log("Product catalog fetched:");
      products.forEach((p) =>
        console.log(`- [${p.id}] ${p.name} - $${p.price}`)
      );

      const reviewPromises: Promise<ProductWithReviews>[] = products.map(
        (product) =>
          retryPromise(
            () => fetchProductReviews(product.id),
            3,
            500
          ).then((reviews) => ({
            product,
            reviews,
          }))
      );

      return Promise.all(reviewPromises);
    })
    .then((productsWithReviews) => {
      console.log("\nProduct reviews:");
      productsWithReviews.forEach(({ product, reviews }) => {
        console.log(`\nReviews for ${product.name} (ID: ${product.id}):`);
        reviews.forEach((r, index) =>
          console.log(
            `Review #${index + 1}: Rating ${r.rating} - "${r.comment}"`
          )
        );
      });

      return retryPromise(fetchSalesReport, 3, 500);
    })
    .then((salesReport: SalesReport) => {
      console.log("\nSales Report:");
      console.log(`Total Sales: $${salesReport.totalSales}`);
      console.log(`Units Sold: ${salesReport.unitsSold}`);
      console.log(`Average Price: $${salesReport.averagePrice.toFixed(2)}`);
    })
    .catch((error) => {
      if (error instanceof NetworkError) {
        console.error("[Network Error]", error.message);
      } else if (error instanceof DataError) {
        console.error("[Data Error]", error.message);
      } else if (error instanceof Error) {
        console.error("[Unknown Error]", error.message);
      } else {
        console.error("[Non-Error throw]", error);
      }
    })
    .finally(() => {
      console.log("\nAll API calls have been attempted. (finally block)");
    });
}

runDashboard();
