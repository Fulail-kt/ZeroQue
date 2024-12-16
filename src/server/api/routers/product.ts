import { createCategory } from "../product/procedures/createCategory";
import { createProduct } from "../product/procedures/createProduct";
import { deleteProduct } from "../product/procedures/deleteProduct";
import { getProducts } from "../product/procedures/getAllProducts";
import { getCategories } from "../product/procedures/getCategories";
import { getProduct } from "../product/procedures/getProduct";
import { getProductsByCategory } from "../product/procedures/getProductsByCategory";
import { updateCategory } from "../product/procedures/updateCategory";
import { updateProduct } from "../product/procedures/updateProduct";
import { createTRPCRouter } from "../trpc";

export const productRouter=createTRPCRouter({
    createProduct,
    updateProduct,
    getProducts,
    getCategories,
    createCategory,
    updateCategory,
    getProductsByCategory,
    getProduct,
    deleteProduct
})