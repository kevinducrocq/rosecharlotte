import axios from "axios";
import React, { useContext, useEffect, useReducer, useRef } from "react";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { dateFr, getError, logOutAndRedirect } from "../../utils";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { faEye, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Row, Table } from "react-bootstrap";
import AdminMenu from "../../components/AdminMenu";
import AdminCanvasMenu from "../../components/AdminCanvasMenu";

import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function OrderListPage() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  $.DataTable = require("datatables.net");
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setTimeout(() => {
          $(tableRef.current).DataTable({
            destroy: true,
            columnDefs: [{ type: "date-dd-MMM-yyyy", targets: 3 }],
            language: {
              url: "https://cdn.datatables.net/plug-ins/1.12.1/i18n/fr-FR.json",
            },
            order: [[3]],
            pageLength: 50,
          });
        }, 500);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (!order.isPaid) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        // .catch(function (error) {
        //   if (error.response && error.response.status === 401) {
        //     logOutAndRedirect();
        //   }
        // });

        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <Container className="my-5">
      <Helmet>
        <title>Commandes</title>
      </Helmet>
      <Row>
        <Col md={2}>
          <div className="d-none d-lg-block d-md-block">
            <AdminMenu link2 />
          </div>
          <div className="d-lg-none d-md-none text-nowrap mb-3">
            <AdminCanvasMenu />
          </div>
        </Col>

        <Col md={10} className="shadow p-5">
          <h1>Commandes</h1>
          <hr />
          {loadingDelete && <LoadingBox></LoadingBox>}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Table ref={tableRef} responsive className="table table-striped">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Client</th>
                  <th>Paiement</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payé</th>
                  <th>Livré</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 7)}</td>
                    <td>{order.user ? order.user.name : "Client supprimé"}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{dateFr(order.createdAt)}</td>
                    <td>{order.totalPrice.toFixed(2)} &euro;</td>
                    <td>
                      <div
                        className={
                          order.isPaid
                            ? "badge bg-success text-light rounded"
                            : "bg-warning badge text-light"
                        }
                      >
                        {order.isPaid ? "Le " + dateFr(order.paidAt) : "Non"}
                      </div>
                    </td>

                    <td>
                      <div
                        className={
                          order.isDelivered
                            ? "bg-success badge text-light rounded"
                            : "bg-warning badge text-light"
                        }
                      >
                        {order.isDelivered
                          ? "Le " + dateFr(order.deliveredAt)
                          : "Non"}
                      </div>
                    </td>
                    <td>
                      <Button
                        className="btn btn-sm"
                        type="button"
                        variant="light"
                        onClick={() => {
                          navigate(`/order/${order._id}`);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                      &nbsp;
                      {!order.isPaid && (
                        <Button
                          className="btn btn-sm"
                          type="button"
                          variant="danger"
                          onClick={() => deleteHandler(order)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}
