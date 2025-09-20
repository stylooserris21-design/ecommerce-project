'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import EditAction from "@/components/Application/Admin/EditAction"
import ViewAction from "@/components/Application/Admin/ViewAction"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DT_COUPON_COLUMN, DT_ORDER_COLUMN, } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_COUPON_ADD, ADMIN_COUPON_EDIT, ADMIN_COUPON_SHOW, ADMIN_DASHBOARD, ADMIN_ORDER_DETAILS, ADMIN_TRASH } from "@/routes/AdminPanelRoute"
import Link from "next/link"
import { useCallback, useMemo } from "react"
import { FiPlus } from "react-icons/fi"

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: "", label: 'Orders' },
]
const ShowOrder = () => {

    const columns = useMemo(() => {
        return columnConfig(DT_ORDER_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<ViewAction key="view" href={ADMIN_ORDER_DETAILS(row.original.order_id)} />)
        actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />

            <Card className="py-0 rounded shadow-sm gap-0">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <div className="flex justify-between items-center">
                        <h4 className='text-xl font-semibold'>Orders</h4>

                    </div>
                </CardHeader>
                <CardContent className="px-0 pt-0">
                    <DatatableWrapper
                        queryKey="orders-data"
                        fetchUrl="/api/orders"
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint="/api/orders/export"
                        deleteEndpoint="/api/orders/delete"
                        deleteType="SD"
                        trashView={`${ADMIN_TRASH}?trashof=orders`}
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowOrder