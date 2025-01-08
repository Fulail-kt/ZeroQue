'use client'
import React, { useState } from "react";
import SwipeCard from "../../global/swipeCard";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Pagination from "~/app/_components/global/pagination";
import { api } from "~/trpc/react";
import { Types } from "mongoose";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import ProductDialog from "./productDialog";
import { CustomAlert } from "../../global/customAlert";
import { useSession } from "next-auth/react";

interface ProductSize {
  name: string;
  stock: number;
  price: number;
}

interface Product {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  price?:number;
  subcategory?: {
    _id: string;
    name: string;
  };
  sizes: ProductSize[];
  isDisabled?: boolean;
}

const ProductList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const utils = api.useUtils()
  const { data: session } = useSession();
  const companyId:string=session?.user?.companyId ?? ""


  // Use the query with search and pagination
  const { data: productsData, isLoading } = api.product.getProducts.useQuery({
    companyId,
    page: currentPage,
    pageSize:6,
    search: debouncedSearchQuery,
    status: activeTab,
  },{enabled:!!companyId});

  const deleteProduct=api.product.deleteProduct.useMutation()


  console.log(productsData, "data")

  const toggleProductStatusMutation = api.product.updateProduct.useMutation({
    onSuccess: () => {
      void utils.product.getProducts.refetch();
      // toast.success('Product status updated successfully');
    },
    onError: (error) => {
      console.error('Toggle Product Status Error:', error);
      // toast.error('Failed to update product status');
    }
  });

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchQuery(searchValue);

    if (searchValue === "") {
      void utils.product.getProducts.refetch({
        companyId,
        page: currentPage,
        search: '',
        status: activeTab === 'active' ? 'active' : 'inactive',
      });

      setDebouncedSearchQuery('');
    }
  };

  const handleSearch = () => {
    setDebouncedSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: 'active' | 'inactive') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setDebouncedSearchQuery('');
    setSearchQuery('');
  };

  // const handleDeleteConfirmation=()=>{

  // }
  const handleDelete=async (productId:string)=>{
   await deleteProduct.mutateAsync({
      productId:productId
    })
  }
  

  // Filter products locally as a fallback (optional)
  const filteredProducts = productsData?.products ?? [];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200">
        <button
          onClick={() => handleTabChange('active')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === 'active'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Active
        </button>
        <button
          onClick={() => handleTabChange('inactive')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === 'inactive'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Inactive
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search products by name, description, or category..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">Loading products...</div>
      )}

      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.map((product, index) => (
          <SwipeCard
            activeTab={activeTab}
            onSwipeLeft={() => {
              if (activeTab === 'active') {
                void toggleProductStatusMutation.mutateAsync({
                  productId: product._id as string,
                  status: 'inactive'
                });
              }
            }}
            onSwipeRight={() => {
              if (activeTab === 'inactive') {
                void toggleProductStatusMutation.mutateAsync({
                  productId: product._id as string,
                  status: 'active'
                });
              }
            }}

            key={`${product._id as string ?? index}`}
            className="w-full"
          >
            <div className="flex p-4 justify-between">
              {/* Left Section: Image */}
              <div className="flex gap-4 w-[70%]">
                <div className="flex justify-start items-center">
                  <img
                    height={100}
                    width={100}
                    src={product.images[0]}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                {/* Middle Section: Details */}
                <div className="flex flex-col gap-2 justify-center">
                  <h3 className="text-lg font-bold">{product.title}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                 {product?.sizes.length>0 && <p className="text-sm font-semibold flex gap-2">
                    <span><span className="font-thin">Name:</span> {product?.sizes[0]?.name ?? 'N/A'}</span>
                    <span><span className="font-thin">Stock:</span> {product?.sizes[0]?.stock ?? 'N/A'}</span>
                    <span><span className="font-thin">Price:</span> {product?.sizes[0]?.price ?? 'N/A'}</span>
                  </p>}
                </div>
              </div>

              {/* Right Section: Category and Actions */}
              <div className="flex flex-col justify-between items-end">
                <span className="px-3 mt-2 bg-gray-200 text-gray-800 text-xs rounded-full">
                  {typeof product.category === 'object' && 'name' in product.category
                    ? product.category.name
                    : 'Unknown Category'}
                </span>
               {product.subcategory && <span className="px-3 mt-2 bg-gray-200 text-gray-800 text-xs rounded-full">
                {typeof product.subcategory === 'object' && 'name' in product.subcategory
                    ? product.subcategory.name
                    : 'Unknown sub Category'}
                </span>}
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2">
                    <div className="w-6 h-6 flex items-center justify-center">⋮</div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => {
                        setSelectedProduct({
                        ...product,
                          _id: product._id as string,
                          category:
                            typeof product.category === "object" && "name" in product.category
                              ? { _id: product.category._id.toString(), name: product.category.name }
                              : { _id: product?.category, name: "" },
                          subcategory:
                            product.subcategory && "name" in product.subcategory
                              ? { _id: product.subcategory._id?.toString(), name: product.subcategory.name }
                              : undefined,
                        });
                        setIsEditDialogOpen(true);
                      }}

                    >
                      Edit
                    </DropdownMenuItem>
                    {activeTab === 'active' ? (
                      <DropdownMenuItem>Disable</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>Activate</DropdownMenuItem>
                    )}
                    <DropdownMenuItem  onSelect={() => setDeleteProductId(product._id as string)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SwipeCard>
        ))}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Update Product</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <ProductDialog
                action='edit'
                initialData={{ ...selectedProduct, _id: selectedProduct._id.toString() }}
                onClose={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

{/* delete product */}
        {deleteProductId && (
          <CustomAlert 
            triggerText="Delete"
            title="Delete Product"
            description="Are you sure you want to permanently delete this product? This action cannot be undone."
            confirmText="Delete"
            variant="destructive"
            onConfirm={async() => {
              if (deleteProductId) {
               await handleDelete(deleteProductId);
              }
            }}
            onCancel={() => setDeleteProductId(null)}
          />
        )}
      </div>

      {/* Pagination */}
      {productsData?.pagination && (
        <Pagination
          currentPage={productsData.pagination.currentPage}
          pageSize={productsData.pagination.pageSize}
          totalPages={productsData.pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* No Results State */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No {activeTab} products found matching your search.
        </div>
      )}
    </div>
  );
};

export default ProductList;