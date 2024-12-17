import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '~/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow
} from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react'
import CategoryDialog from './categoryDialog'
import { api } from '~/trpc/react'
import { Skeleton } from '~/components/ui/skeleton'
import { Types } from 'mongoose'

interface ICategory {
    _id: Types.ObjectId;
    name: string;
    description: string;
    subcategories: {
        _id: string;
        name: string;
        description: string;
    }[];
    company: string;
}

interface CategoryQueryResult {
    categories: ICategory[];
    count: number;
}

const CategoryList: React.FC = () => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    // Fetch categories
    const {
        data: categoryQueryResult,
        isLoading,
        error
    } = api.product.getCategories.useQuery({
        companyId: '674ac8e13644f51bd33ad5a0',
    });

    // Handle category deletion
    const handleDeleteCategory = (category: ICategory) => {
        // Implement delete logic
    };

    // Render loading state
    if (isLoading) {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>Category Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Subcategories</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2, 3].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading categories: {error.message}
            </div>
        );
    }

    // Render empty state
    if (!categoryQueryResult || categoryQueryResult.categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <p className="text-gray-500 mb-4">No categories found</p>


                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Create First Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <CategoryDialog onClose={() => setIsCreateDialogOpen(false)} action='create' />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Category
                </Button>
            </div>
            <div className='space-y-4 max-h-80 overflow-y-auto scrollbar-none p-2'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Subcategories</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categoryQueryResult?.categories.map((category, index) => (
                            <TableRow key={`${category._id?.toString() ?? index}`} className="">
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    {category.subcategories?.length ? (
                                        category.subcategories.map((sub) => (
                                            <div key={sub._id?.toString()} className="text-sm text-gray-600">
                                                {sub.name || 'N/A'}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-600">N/A</div>
                                    )}

                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    setSelectedCategory(category as unknown as ICategory);
                                                    setIsEditDialogOpen(true);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => handleDeleteCategory(category as unknown as ICategory)}
                                                className="cursor-pointer text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Update Category</DialogTitle>
                    </DialogHeader>
                    {selectedCategory && (
                        <CategoryDialog
                            action='edit'
                            initialData={{ ...selectedCategory, _id: selectedCategory._id.toString() }}
                            onClose={() => setIsEditDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                    </DialogHeader>
                    <CategoryDialog
                        action='create'
                        onClose={() => setIsCreateDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CategoryList