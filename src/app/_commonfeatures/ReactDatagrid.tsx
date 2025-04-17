import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    gridPaginationSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";


interface dataGridProps {
    rows: any[] | [],
    columns: any,
    pageNationNumber?: number,
    getRowClassName?: any
    checkboxSelection?: any,
    autoHeight?: any
    hideFooter?: boolean
    toolsRequired?: boolean
}

const ReactDatagrid: React.FC<dataGridProps> = ({
    rows,
    columns,
    pageNationNumber,
    getRowClassName,
    checkboxSelection,
    autoHeight,
    hideFooter,
    toolsRequired
}) => {
    const CustomPagination = () => {
        const apiRef = useGridApiContext();
        const page = useGridSelector(apiRef, gridPageSelector);
        const pageCount = useGridSelector(apiRef, gridPageCountSelector);
        const paginationState = useGridSelector(apiRef, gridPaginationSelector);
        return (
            <div className="react-DataGrid-pagination">
                <Stack direction="row" spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {rows?.length == 0 ? 0 : paginationState.paginationModel.pageSize * page + 1} -{" "}
                        {rows?.length == 0 ? 0 : paginationState.paginationModel.pageSize * page + paginationState.paginationModel.pageSize} of{" "}
                        {rows?.length}
                    </Box>
                    <Pagination
                        showLastButton={true}
                        showFirstButton={true}
                        color="primary"
                        count={pageCount}
                        size={"small"}
                        page={page + 1}
                        siblingCount={0}
                        boundaryCount={0}
                        onChange={(event, value) => apiRef.current.setPage(value - 1)}
                    />
                </Stack>
            </div>
        );
    }
    const rowsget: any = rows && rows.length > 0 ? rows.map((row: any, index: any) => ({ ...row, id: index + 1 }))
        : [];
    return (
        <>
            <div className="react-DataGrid">
                <DataGrid
                    rows={rowsget}
                    columns={columns}
                    getRowId={(rowsget: any) => rowsget.id}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: pageNationNumber && pageNationNumber ? pageNationNumber : 10,
                            },
                        },
                    }}
                    hideFooter={hideFooter}
                    pageSizeOptions={[pageNationNumber && pageNationNumber ? pageNationNumber : 10]}
                    getRowClassName={getRowClassName}
                    checkboxSelection={checkboxSelection}
                    density="compact"
                    autoHeight
                    slots={{
                        pagination: CustomPagination,
                        toolbar: toolsRequired ? GridToolbar : null
                    }}

                // className="mostly-customized-scrollbar"
                // autoHeight={false}
                />
            </div>
        </>
    )
}

export default ReactDatagrid
