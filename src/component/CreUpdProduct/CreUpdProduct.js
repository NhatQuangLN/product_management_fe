import React from "react";
import classNames from "classnames/bind";
import styles from "./CreUpdProduct.module.scss";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { MODE } from "~/utils/SystemCode";
import { request } from "~/config/apiRequest";
import { Toast } from "primereact/toast";

const CreUpdProduct = ({
  mode = MODE.CREATE,
  productCode,
  setIsDataChange,
}) => {
  const cx = React.useMemo(() => classNames.bind(styles), []);
  const [categoryList, setCategoryList] = React.useState([]);
  const [reloadData, setReloadData] = React.useState(0);
  const toast = React.useRef(null);

  React.useEffect(() => {
    request
      .get("/api/products/" + productCode)
      .then((response) => {
        formik.setValues({
          ...formik.values,
          productName: response.data.product.productName,
          productCategoryId: response.data.product.productCategoryId,
          productBrand: response.data.product.productBrand,
          productType: response.data.product.productType,
          productDescription: response.data.product.productDescription,
        });
        setCategoryList(response.data.categoryList);
      })
      .catch((error) => {
        setCategoryList(error.response.data.categoryList);
      });
  }, [reloadData]);

  const formik = useFormik({
    initialValues: {
      productCode: productCode || "",
      productName: "",
      productCategoryId: "",
      productBrand: "",
      productType: "",
      productDescription: "",
    },
    enableReinitialize: true,
    validate: (data) => {
      let errors = {};
      if (!data.productCode) {
        errors.productCode = "Please input product code";
      }
      if (!data.productName) {
        errors.productName = "Please input product name";
      } else if (data.productName.length <= 10) {
        errors.productName =
          "Kindly include a minimum of 10 characters to describe the product.";
      }
      if (!data.productCategoryId) {
        errors.productCategoryId = "Please select a category";
      }

      return errors;
    },
    onSubmit: (data) => {
      if (mode === MODE.CREATE) {
        request
          .post("/api/products", {
            ...data,
          })
          .then((response) => {
            toast.current.show({
              severity: "success",
              summary: "Create Successfully",
              detail: "Create product successfully!",
            });
            setIsDataChange(true);
          })
          .catch((error) => {
            console.log(error);
            toast.current.show({
              severity: "error",
              summary: "Create Failed",
              detail: error.response?.data?.message,
            });
          });
      } else {
        request
          .put("/api/products/" + productCode, {
            ...data,
          })
          .then((response) => {
            toast.current.show({
              severity: "success",
              summary: "Update Successfully",
              detail: "Update product successfully!",
            });
            setIsDataChange(true);
            setReloadData((pre) => pre + 1);
          })
          .catch((error) => {
            console.log(error);
            toast.current.show({
              severity: "error",
              summary: "Update Failed",
              detail: error.response?.data?.message,
            });
          });
      }
    },
  });
  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <>
          <span className="grid-column-4"></span>
          <small className="p-error grid-column-8">{formik.errors[name]}</small>
        </>
      )
    );
  };
  return (
    <section className={cx("product-cover")}>
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="mb-3 w-100">
          <div className="mb-2 grid">
            <label
              htmlFor="productCode"
              className={cx(
                {
                  "p-error": isFormFieldValid("productCode"),
                },
                "font-bold grid-column-4 m-auto"
              )}
            >
              Code*:
            </label>
            <InputText
              id="productCode"
              name="productCode"
              value={formik.values.productCode}
              onChange={formik.handleChange}
              autoFocus
              className={cx(
                {
                  "p-invalid": isFormFieldValid("productCode"),
                },
                "grid-column-8"
              )}
              placeholder="Ex: P123"
              disabled={mode === MODE.UPDATE}
            />
            {getFormErrorMessage("productCode")}
          </div>
        </div>

        <div className="mb-3">
          <div className="mb-2 grid">
            <label
              htmlFor="productName"
              className={cx(
                {
                  "p-error": isFormFieldValid("productName"),
                },
                "font-bold grid-column-4 m-auto"
              )}
            >
              Name*:
            </label>
            <InputText
              autoFocus={mode === MODE.UPDATE}
              id="productName"
              name="productName"
              value={formik.values.productName}
              onChange={formik.handleChange}
              className={cx(
                {
                  "p-invalid": isFormFieldValid("productName"),
                },
                "grid-column-8"
              )}
              placeholder="Ex: Male T-shirt"
            />
            {getFormErrorMessage("productName")}
          </div>
        </div>

        <div className="mb-3">
          <div className="mb-2 grid">
            <label
              htmlFor="productCategoryId"
              className={cx(
                {
                  "p-error": isFormFieldValid("productCategoryId"),
                },
                "font-bold grid-column-4 m-auto"
              )}
            >
              Category*:
            </label>
            <Dropdown
              inputId="productCategoryId"
              name="productCategoryId"
              optionLabel="categoryName"
              optionValue="categoryId"
              value={formik.values.productCategoryId}
              options={categoryList}
              placeholder="Select a category"
              onChange={(e) => {
                formik.setFieldValue("productCategoryId", e.value);
              }}
              className={cx(
                {
                  "p-invalid": isFormFieldValid("productCategoryId"),
                },
                "grid-column-8"
              )}
            />
            {getFormErrorMessage("productCategoryId")}
          </div>
        </div>
        <div className="mb-3">
          <div className="mb-2 grid">
            <label
              htmlFor="productBrand"
              className={cx("font-bold grid-column-4 m-auto")}
            >
              Brand:
            </label>
            <InputText
              id="productBrand"
              name="productBrand"
              value={formik.values.productBrand}
              onChange={formik.handleChange}
              className={cx("grid-column-8")}
              placeholder="Ex: Calvin Klein"
            />
          </div>
        </div>
        <div className="mb-3">
          <div className="mb-2 grid">
            <label
              htmlFor="productType"
              className={cx("font-bold grid-column-4 m-auto")}
            >
              Type:
            </label>
            <InputText
              id="productType"
              name="productType"
              value={formik.values.productType}
              onChange={formik.handleChange}
              className={cx("grid-column-8")}
              placeholder="Ex: Male Clothes"
            />
          </div>
        </div>
        <div className="mb-3">
          <div className="mb-2 grid">
            <label
              htmlFor="productDescription"
              className={cx("font-bold grid-column-4 m-auto")}
            >
              Description:
            </label>
            <InputTextarea
              inputid="productDescription"
              name="productDescription"
              rows={4}
              className={classNames(
                {
                  "p-invalid": isFormFieldValid("productDescription"),
                },
                "grid-column-8"
              )}
              value={formik.values.productDescription}
              onChange={(e) => {
                formik.setFieldValue("productDescription", e.target.value);
              }}
            />
          </div>
        </div>
        <div className="text-center">
          <Button type="submit" className="w-25" label="Save" />
        </div>
      </form>
      <Toast ref={toast} />
    </section>
  );
};

export default CreUpdProduct;
