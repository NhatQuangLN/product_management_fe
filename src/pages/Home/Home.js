import React from "react";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import CreUpdProduct from "~/component/CreUpdProduct";
import { MODE } from "~/utils/SystemCode";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { request } from "~/config/apiRequest";
import { Toast } from "primereact/toast";
import { useSearchParams } from "react-router-dom";
import { toArrayQueryString } from "~/utils/StringUtils";
import {
  toArrayQueryObject,
  toPagingQueryObject,
  toSortQueryObject,
} from "~/utils/ObjectUtils";
import { useLocation } from "react-router-dom";
import { safeParseInt } from "~/utils/IntegerUtils";

const Home = () => {
  const cx = React.useMemo(() => classNames.bind(styles), []);
  const [productList, setProductList] = React.useState([]);
  const [isShowCreUpdDialog, setIsShowCreUpdDialog] = React.useState(false);
  const [isDataChange, setIsDataChange] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [productCodeUpd, setProductCodeUpd] = React.useState("");
  const [mode, setMode] = React.useState(MODE.CREATE);
  const [reloadData, setReloadData] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const toast = React.useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [lazyState, setlazyState] = React.useState(() => {
    const searchString = location.search;
    const sortList = toSortQueryObject(searchString);
    const pagingObject = toPagingQueryObject(searchString);
    return {
      first: pagingObject.p
        ? (safeParseInt(pagingObject.p, 1) - 1) *
          safeParseInt(pagingObject.s, 10)
        : 0,
      rows: pagingObject.s ? safeParseInt(pagingObject.s, 10) : 10,
      multiSortMeta: sortList,
    };
  });
  React.useEffect(() => {
    setLoading(true);
    request
      .get("/api/products?" + toArrayQueryString(lazyState.multiSortMeta), {
        params: {
          p: searchParams.get("p"),
          s: searchParams.get("s"),
        },
      })
      .then((response) => {
        setProductList(response.data.productList);
        setTotalRecords(response.data.totalRecords);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reloadData, lazyState]);

  const delBodyTemplate = (product) => {
    return (
      <Button
        label="Delete"
        icon="pi pi-trash"
        severity="danger"
        onClick={() => confirmDel(product.productCode)}
      />
    );
  };

  const onHide = (action, productCode) => {
    if (action[0].result === "accept") {
      request
        .delete("/api/products/" + productCode)
        .then(() => {
          toast.current.show({
            severity: "success",
            summary: "Delete Successfully",
            detail: "Delete product successfully!",
          });
          setReloadData((pre) => pre + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const confirmDel = (productCode) => {
    confirmDialog({
      message: "Do you want to delete this product?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      onHide: (action) => onHide(action, productCode),
    });
  };

  const updBodyTemplate = (product) => {
    return (
      <Button
        label="Update"
        icon="pi pi-pencil"
        severity="info"
        onClick={() => handleEditProduct(product.productCode)}
      />
    );
  };
  const footer = `In total there are ${totalRecords ? totalRecords : 0} products.`;
  const handleEditProduct = (productCode) => {
    setIsShowCreUpdDialog(true);
    setProductCodeUpd(productCode);
    setMode(MODE.UPDATE);
  };
  const handleHideCreUpdDialog = () => {
    setIsShowCreUpdDialog(false);
    setProductCodeUpd("");
    setMode(MODE.CREATE);
    if (isDataChange) {
      setReloadData((pre) => pre + 1);
      setIsDataChange(false);
    }
  };
  const onSort = (event) => {
    setSearchParams((pre) => {
      return {
        ...toPagingQueryObject(pre.toString()),
        ...toArrayQueryObject(event.multiSortMeta),
      };
    });
    setlazyState(event);
  };
  const onPage = (event) => {
    setSearchParams(() => {
      return {
        p: event.page + 1,
        s: event.rows,
        ...toArrayQueryObject(event.multiSortMeta),
      };
    });
    setlazyState(event);
  };
  return (
    <section className={cx("container")}>
      <header className={cx("header-cover", "mb-4")}>
        <div className={cx("font-bold mb-2", "title")}>Products List</div>
        <Button
          label="Create New Product"
          onClick={() => setIsShowCreUpdDialog(true)}
        />
      </header>
      <section>
        <DataTable
          emptyMessage="There are no products available"
          totalRecords={totalRecords}
          value={productList}
          loading={loading}
          onSort={onSort}
          sortMode="multiple"
          removableSort
          onPage={onPage}
          paginator
          rows={lazyState.rows}
          lazy
          first={lazyState.first}
          multiSortMeta={lazyState.multiSortMeta}
          rowsPerPageOptions={[10, 15, 20, 25]}
          tableStyle={{ minWidth: "50rem" }}
          footer={footer}
        >
          <Column
            sortable
            field="productCode"
            header="Code"
            style={{ width: "10%" }}
          ></Column>
          <Column
            sortable
            field="productName"
            header="Name"
            style={{ width: "12%" }}
          ></Column>
          <Column
            sortable
            field="productCategoryName"
            header="Category"
            style={{ width: "12%" }}
          ></Column>
          <Column
            sortable
            field="productBrand"
            header="Brand"
            style={{ width: "12%" }}
          ></Column>
          <Column
            sortable
            field="productType"
            header="Type"
            style={{ width: "12%" }}
          ></Column>
          <Column
            field="productDescription"
            sortable
            header="Description"
          ></Column>
          <Column
            header=""
            style={{ width: "5%" }}
            body={updBodyTemplate}
          ></Column>
          <Column
            header=""
            style={{ width: "5%" }}
            body={delBodyTemplate}
          ></Column>
        </DataTable>
      </section>
      <Dialog
        header={productCodeUpd ? "Update Product" : "Create new Product"}
        visible={isShowCreUpdDialog}
        style={{ width: "50vw" }}
        onHide={handleHideCreUpdDialog}
      >
        <CreUpdProduct
          productCode={productCodeUpd}
          mode={mode}
          setIsDataChange={setIsDataChange}
        />
      </Dialog>
      <ConfirmDialog />
      <Toast ref={toast} />
    </section>
  );
};

export default Home;
