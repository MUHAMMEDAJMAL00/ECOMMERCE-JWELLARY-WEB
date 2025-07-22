import React from "react";
import { Container, Row, Col, Card, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#343a40",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h4>E-Commerce Admin</h4>
        <Nav className="flex-column mt-4">
          <Nav.Link as={Link} to="/admin/home" style={{ color: "#fff" }}>
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/products" style={{ color: "#fff" }}>
            Products
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/orders" style={{ color: "#fff" }}>
            Orders
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/users" style={{ color: "#fff" }}>
            Users
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Navbar bg="light" className="px-4">
          <Navbar.Brand>Admin Panel</Navbar.Brand>
        </Navbar>

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
