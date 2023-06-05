import React, { useEffect, useState } from "react";
import { Services } from "../../config/api-middleware";
import { useNavigate, useParams, useLocation } from "react-router-dom";
// import useFetchingHooks from '../../hooks/useFetching';

import Segment from "../../component/segment";
import Card from "../../component/Card";
import Form from "../../component/Form";
import Input from "../../component/Input";
import SelectBox from "../../component/Selectbox";
import UploadImage from "../../component/UploadImage";
import {
  Row,
  Col,
  CardBody,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  FormGroup,
  FormText,
  Label,
  Spinner,
} from "reactstrap";

import "../../assets/css/global-cms-styles.css";
import "../../assets/css/form-crud-car.css";
import axios from "axios";

const categoryData = [
  {
    value: "small",
    label: "2 - 4 Orang",
  },
  {
    value: "medium",
    label: "4 - 6 Orang",
  },
  {
    value: "large",
    label: "6 - 8 Orang",
  },
];

const AddNewCar = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loader, setloader] = useState("idle");
  const location = useLocation();
  const [image, setImage] = useState(null);
  const handleImg = (e) => {
    setImage(e);
  };

  const stopLoad = useEffect(() => {
    if (location.pathname === "/add-car") {
      setloader("resolve");
    }
  }, [location.pathname]);

  const [state, setValue] = useState({
    Nama: "",
    Harga: "",
    Kapasitas: "",
    Foto: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (id) {
      axios
        .get("https://bootcamp-rent-cars.herokuapp.com/admin/car/" + id, {
          headers: {
            access_token: `${localStorage.getItem("ACCESS_TOKEN")}`,
          },
        })
        .then((response) => {
          setloader("resolve");
          console.log("DETAIL ID", response);
          setValue((prev) => ({
            ...prev,
            name: response?.data?.name,
            price: response?.data?.price,
            category: response?.data?.category,
            // Foto: response?.data?.image,
          }));
          if (response.data?.image) {
            setImage(response?.data?.image);
          }
        })
        .catch((err) => console.log(err.response.data));
    }
  }, [id]);

  console.log("FOTO", state.Foto);
  const handleSubmitNewCar = (event) => {
    console.log("SUBMIT");
    event.preventDefault();

    const fd = new FormData();

    let headers = {
      headers: {
        access_token: `${localStorage.getItem("ACCESS_TOKEN")}`,
      },
    };

    if (id) {
      console.log("MENGEDIT");
      fd.append("name", state.name);
      fd.append("category", state.category);
      fd.append("price", state.price);
      fd.append("status", false);
      fd.append("image", image);
      axios
        .put(
          `https://bootcamp-rent-cars.herokuapp.com/admin/car/${id}`,
          fd,
          headers
        )
        .then((response) => {
          setloader("resolve");
          navigate("/car-list");
        })
        .catch((err) => console.log(err.response.data));
    } else {
      console.log(image, "CREATE");
      fd.append("name", state.name);
      fd.append("category", state.category);
      fd.append("price", state.price);
      fd.append("status", false);
      fd.append("image", image);
      axios
        .post("https://bootcamp-rent-cars.herokuapp.com/admin/car", fd, headers)
        .then((response) => {
          console.log(response, "INI RESPONSE CREATE");
          setloader("resolve");
          navigate("/car-list");
        })
        .catch((err) => console.log(err.response.data));
    }
  };

  return (
    <>
      <Segment>
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>Cars</BreadcrumbItem>
          <BreadcrumbItem>List Car</BreadcrumbItem>
          <BreadcrumbItem active>Add New Car</BreadcrumbItem>
        </Breadcrumb>
        <Row className="mb-4">
          <Col className="d-flex align-items-center">
            {location.pathname === "/add-car" ? (
              <h1 className="title-page mb-0">Add New Car</h1>
            ) : (
              <h1 className="title-page mb-0">Edit Car</h1>
            )}
          </Col>
        </Row>
      </Segment>

      <Form onSubmit={handleSubmitNewCar}>
        <Segment className="container-form-add d-flex flex-column justify-content-between">
          {loader !== "resolve" && (
            <Segment className="text-center w-100">
              <Spinner size="md" color="success">
                Loading
              </Spinner>
            </Segment>
          )}
          {loader === "resolve" && (
            <Card className="card card-form-container">
              <CardBody className="p-0">
                <FormGroup className="form-group-input d-flex">
                  <Label
                    for="namaMobil"
                    className="label-input-form d-flex align-items-center mb-0"
                  >
                    Nama/Tipe Mobil<sup className="sup-star">*</sup>
                  </Label>
                  <Input
                    value={state?.name}
                    id="namaMobil"
                    name="name"
                    onChange={handleChange}
                    className="input-field-form"
                    placeholder="Input Nama/Tipe Mobil"
                    type="text"
                  />
                </FormGroup>
                <FormGroup className="form-group-input d-flex">
                  <Label
                    for="hargaMobil"
                    className="label-input-form d-flex align-items-center mb-0"
                  >
                    Harga<sup className="sup-star">*</sup>
                  </Label>
                  <Input
                    value={state?.price}
                    id="hargaMobil"
                    name="price"
                    onChange={handleChange}
                    className="input-field-form"
                    placeholder="Input Harga Sewa Mobil"
                    type="number"
                  />
                </FormGroup>
                {/* <FormGroup className="form-group-input d-flex">
                  <Label
                    for="fotoMobil"
                    className="label-input-form d-flex align-items-center mb-0"
                  >
                    Foto<sup className="sup-star">*</sup>
                  </Label>
                  <Segment>
                    <Input
                      type="file"
                      accept="image/*"
                      id="fotoMobil"
                      name="Foto"
                      onChange={handleImg}
                      className="input-field-form"
                      placeholder="Upload Foto Mobil"
                    />
                    <FormText className="form-text-info mb-0" tag="p">
                      File size max. 2MB
                    </FormText>
                  </Segment>
                </FormGroup> */}

                <FormGroup className="form-group-input d-flex">
                  <Label
                    for="fotoMobil"
                    className="label-input-form d-flex align-items-center mb-0"
                  >
                    Foto<sup className="sup-star">*</sup>
                  </Label>
                  <Segment>
                    {console.log({ state, image })}
                    <img />
                    <UploadImage onChange={handleImg} />
                  </Segment>
                </FormGroup>
                <FormGroup className="form-group-input d-flex">
                  <Label
                    for="fotoMobil"
                    className="label-input-form d-flex align-items-center mb-0"
                  >
                    Kategori<sup className="sup-star">*</sup>
                  </Label>
                  <Segment className="container-selectbox">
                    {location.pathname === "/add-car" ? (
                      <SelectBox
                        id="kategoriMobil"
                        onChange={handleChange}
                        name="category"
                        className="input-field-form select"
                        title="Pilih Kategori Mobil"
                        // value={state?.Kapasitas}
                        data={categoryData}
                      />
                    ) : (
                      <SelectBox
                        id="kategoriMobil"
                        onChange={handleChange}
                        name="category"
                        className="input-field-form select"
                        title="Pilih Kategori Mobil"
                        value={state?.category}
                        data={categoryData}
                      />
                    )}

                    <Segment className="wrapper-down-arrow d-flex align-items-center">
                      <i className="fa fa-chevron-down" aria-hidden="true"></i>
                    </Segment>
                  </Segment>
                </FormGroup>
                <FormGroup className="form-group-input d-flex">
                  <Label
                    for="createdAt"
                    className="label-input-form d-flex align-items-center mb-0"
                  >
                    Created At
                  </Label>
                  <Segment>
                    <p>-</p>
                  </Segment>
                </FormGroup>
                <FormGroup className="form-group-input d-flex">
                  <Label
                    for="updatedAt"
                    className="label-input-form d-flex align-items-center mb-0"
                  >
                    Updated At
                  </Label>
                  <Segment>
                    <p>-</p>
                  </Segment>
                </FormGroup>
              </CardBody>
            </Card>
          )}
          <Segment className="container-action-btn-form d-flex pb-3">
            <Button
              className="btn-cancel"
              type="button"
              onClick={() => navigate("/car-list")}
            >
              Cancel
            </Button>
            <Button className="btn-submit" type="submit">
              Save
            </Button>
          </Segment>
        </Segment>
      </Form>
    </>
  );
};

export default AddNewCar;
