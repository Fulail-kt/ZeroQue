"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface IDataTableDemo {
  columns: ColumnDef<any>[];
  data: any[];
  rowClickable?: boolean;
  showColumnFilter?: boolean;
  showSearchBar?: boolean;
  searchKeys?: string[];
  title?: string;
  children?: React.ReactNode;
  paginate?: boolean;
  pageSize?: number;
  allowEdit?: boolean;
  isCaseTable?: boolean;
}
function getColorBasedOnDate(inputDate: string | Date): string {
  const currentDate = new Date();
  const givenDate = new Date(inputDate);
  if (isNaN(givenDate.getTime())) {
    // throw new Error("Invalid date provided");
    console.log("Invalid Date");
  }
  const timeDifference = currentDate.getTime() - givenDate.getTime();
  const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
  if (dayDifference < 3) {
    return "bg-green-300";
  } else if (dayDifference < 5) {
    return "bg-orange-300";
  } else {
    return "bg-red-300";
  }
}
export function CustomTable({
  columns,
  data,
  rowClickable = false,
  showColumnFilter = false,
  showSearchBar = false,
  searchKeys = [],
  children,
  title = "",
  paginate = true,
  pageSize = 10,
  allowEdit = false,
  isCaseTable = false,
}: IDataTableDemo) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [openAdvanced, setOpenAdvanced] = React.useState<boolean>(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const navigate = useRouter();
  const path = usePathname();
  const table = useReactTable({
    data,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      return searchKeys.some((key) => {
        const cellValue = row.getValue(key);
        return cellValue?.toString().toLowerCase().includes(searchValue);
      });
    },
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: paginate ? pageSize : 1000,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="w-full bg-white dark:bg-gray-950 p-5 rounded dark:text-white">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="my-2 flex flex-wrap justify-between  gap-3">
        <div className="flex flex-col">
          {showSearchBar && (
            <Input
              placeholder="Search here..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
          )}
        </div>
        {showColumnFilter && (
          <div className="flex w-full flex-wrap items-center justify-center gap-3 md:w-fit">
            {children}
            <DropdownMenu>
              <DropdownMenuTrigger className="" asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column?.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column?.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className="rounded-md border dark:border-gray-600">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel()?.rows?.length ? (
              table?.getRowModel()?.rows?.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (rowClickable)
                      navigate.replace(`${path}/${row?.original?.caseId}`);
                  }}
                  className={`${isCaseTable && getColorBasedOnDate(row?.original?.lastOpened)} ${rowClickable ? "cursor-pointer" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {paginate && (
          <>
            <div className="flex-1 text-sm text-muted-foreground">
              {table?.getFilteredSelectedRowModel()?.rows?.length} of{" "}
              {table?.getFilteredRowModel()?.rows?.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table?.previousPage()}
                disabled={!table?.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table?.nextPage()}
                disabled={!table?.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}