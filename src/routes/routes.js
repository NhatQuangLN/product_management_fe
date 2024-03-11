import Home from "~/pages/Home";
import ProductDetail from "~/pages/ProductDetail";


const publicRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/product/detail",
    component: ProductDetail,
  },
];

export { publicRoutes };
