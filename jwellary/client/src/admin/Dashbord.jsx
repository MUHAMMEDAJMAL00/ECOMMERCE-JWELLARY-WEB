import React from "react";
import { Container, Row, Col, Card, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div className="flex-grow-1">
        <Container fluid className="p-4">
          <Row>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Total Sales</Card.Title>
                  <Card.Text>$12,500</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Orders</Card.Title>
                  <Card.Text>245</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Products</Card.Title>
                  <Card.Text>52</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Users</Card.Title>
                  <Card.Text>120</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
