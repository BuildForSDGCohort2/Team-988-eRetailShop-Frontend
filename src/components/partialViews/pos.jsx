import React, { useState, useEffect } from "react";
import PosTable from "./posTable";
import { Row, Col, ListGroup, Spinner, Card } from "react-bootstrap";

import { FaCartPlus, FaSyncAlt } from "react-icons/fa";
import { getCategories } from "../../services/categoryService";
import { getProducts } from "../../services/productService";

import { useDispatch } from "react-redux";
import { itemsAdded } from "../../store/cart";

export default function Pos({ user }) {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsByCateg, setProductsByCateg] = useState([]);
  const [loadingCateg, setLoadingCateg] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: responseCategories } = await getCategories();
      const { data: responseProducts } = await getProducts();
      if (responseCategories && responseProducts) {
        setLoadingCateg(false);
        setCategories(responseCategories.data);
        setProducts(responseProducts.data);
      }
    }
    fetchData();
  }, []);

  const getProductsByCateg = (categId) => {
    const response = products.filter(
      (p) =>
        p.categoryId === Number(categId) &&
        p.inventoryonhand > p.minimumurequired
    );
    setProductsByCateg(response);
  };

  const addItems = (itemid) => {
    const product = products.filter((p) => p.id === Number(itemid));
    dispatch(
      itemsAdded({
        selectedItems: {
          productID: product[0].id,
          productName: product[0].productname,
          price_unit: product[0].sellingPrice,
          quantity: 1,
          totalPrice: product[0].sellingPrice * 1,
        },
      })
    );
  };

  const reloadPage = () => {
    window.location = "/pos";
  };
  return (
    <div className="header  pb-6">
      <div className="container-fluid">
        <div className="header-body">
          <div className="row align-items-center py-4">
            <div className="col-lg-6 col-7">
              <h6 className="h2  d-inline-block mb-0">Point of Sale</h6>
            </div>
            <div className="col-lg-6 col-5 text-right">
              <button
                type="button"
                className="btn btn-primary  btn-sm"
                onClick={() => reloadPage()}
              >
                <FaSyncAlt />
              </button>
            </div>
          </div>

          <Row>
            <Col sm={2}>
              <ListGroup>
                <ListGroup.Item active>
                  {loadingCateg && <Spinner animation="border" size="sm" />}
                  Category
                </ListGroup.Item>
                {categories.map((c) => (
                  <ListGroup.Item
                    key={c.id}
                    action
                    onClick={() => getProductsByCateg(c.id)}
                  >
                    {c.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col sm={4}>
              <Card>
                <Card.Header>Products</Card.Header>
                <Card.Body>
                  <ul className="products">
                    {productsByCateg.map((p) => (
                      <li key={p.id}>
                        <h3>{p.productname}</h3>
                        <small>RWF {p.sellingPrice}</small>
                        <button
                          type="button"
                          className="btn btn-success  btn-sm"
                          onClick={() => addItems(p.id)}
                        >
                          <FaCartPlus />
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <PosTable userData={user} />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
