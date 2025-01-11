'use client'
import React, { useState } from 'react'
import CategoryViewDialog from '~/app/_components/page/product/categoryList'
import ProductDialog from '~/app/_components/page/product/productDialog'
import ProductTable from '~/app/_components/page/product/productList'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
// import { auth } from '~/server/auth'
import { useSession } from 'next-auth/react'

const Page = () => {
  // product Dialog
  const [isDialogOpen, setDialogOpen] = useState(false);
  // category List
  const [isDialog2Open, setDialog2Open] = useState(false);

  const { data: session } = useSession()
  // const session = await auth();

  console.log(session)




  return (
    <div className='max-w-7xl flex flex-col items-center w-full'>
      <div className="flex h-16 mt-2 justify-between w-full items-center p-4"><h1 className='text-2xl uppercase  font-semibold'>Products</h1>
        <div className='flex gap-2  md:flex-row flex-col justify-center h-full items-end'>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button >Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductDialog onClose={() => setDialogOpen(false)} action='create' />
            </DialogContent>
          </Dialog>

          <span className='flex'>


            <Dialog open={isDialog2Open} onOpenChange={setDialog2Open}>
              <DialogTrigger asChild>
                {/* <Button className='rounded-none rounded-l'>Add Category</Button> */}
                <Button className='' onClick={() => setDialog2Open(true)}>View Category</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Categories</DialogTitle>
                </DialogHeader>
                <CategoryViewDialog />
              </DialogContent>
            </Dialog>
          </span>

        </div>

      </div>
      <div className='pt-2 p-5  w-full flex justify-center'>
        <ProductTable />
      </div>
    </div>
  )
}

export default Page

