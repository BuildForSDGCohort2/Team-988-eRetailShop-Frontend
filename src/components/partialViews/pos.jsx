import React, { useState, useEffect } from "react";
import PosTable from "./posTable";
import { Form, Row, Col, ListGroup, Spinner, Card } from "react-bootstrap";
import { toast } from "react-toastify";

import { FaCartPlus } from "react-icons/fa";
import { getCategories } from "../../services/categoryService";
import { getProductByCateg } from "../../services/productService";
import { getClients } from "../../services/clientService";

import { useDispatch } from "react-redux";
import { itemsAdded, customerAdded } from "../../store/cart";

export default function Pos({ user }) {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [loadingCateg, setLoadingCateg] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [clientID, setClientID] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: response } = await getCategories();
      const { data: clientsresponse } = await getClients();
      if (response && clientsresponse) {
        setLoadingCateg(false);
        setCategories(response.data);
        setClients(clientsresponse.data);
      }
    }
    fetchData();
  }, []);

  const handleClient = (e) => {
    setClientID(e.target.value);
    const clientid = e.target.value;
    if (Number(clientid) > 0) {
      const cl = clients.filter((c) => c.id === Number(clientid));
      dispatch(
        customerAdded({
          customerItem: {
            id: cl[0].id,
            name: cl[0].name,
            email: cl[0].email,
            phone: cl[0].phone,
            address: cl[0].address,
          },
        })
      );
    }
  };

  const getProducts = async (categoryId) => {
    setLoadingProduct(true);
    try {
      const { data: response } = await getProductByCateg(categoryId);
      if (response) {
        setLoadingProduct(false);
        setProducts(response.data);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Category not found.");
    }
  };

  const addItems = (itemid) => {
    const product = products.filter((p) => p.id === Number(itemid));
    dispatch(
      itemsAdded({
        selectedItems: {
          productID: product[0].id,
          productName: product[0].productname,
          price_unit: product[0].sellingPrice,
          quantity: qty,
          totalPrice: product[0].sellingPrice * qty,
        },
      })
    );
  };
  return (
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Shopping Cart </h1>
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
                onClick={() => getProducts(c.id)}
              >
                {c.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col sm={4}>
          <Card>
            <Card.Header bg="primary">
              <Form.Row>
                <Col xs={5}>
                  <Form.Label column sm={8}>
                    Quantity
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </Col>
                <Col xs={5}>
                  <Form.Label column sm={8}>
                    Customer
                  </Form.Label>

                  <Form.Control
                    as="select"
                    className="mr-sm-2"
                    id="inlineFormCustomSelect"
                    custom
                    onChange={handleClient}
                    value={clientID}
                  >
                    <option value="0">Select</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Row>
            </Card.Header>
            <Card.Header>
              {loadingProduct && <Spinner animation="border" size="sm" />}
              Products
            </Card.Header>
            <Card.Body>
              <ul className="products">
                {products.map((p) => (
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
    </main>
  );
}