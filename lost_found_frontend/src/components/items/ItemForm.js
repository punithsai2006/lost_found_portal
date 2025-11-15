import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";

const ItemFormComponent = ({ isEdit, initialData, categories, onSave }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      category_id: "",
      current_status: "lost"
    }
  );

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category_id) {
      setError("Title and category are required.");
      return;
    }

    await onSave(formData);
  };

  return (
    <Card>
      <Card.Header>{isEdit ? "Edit Item" : "Create Item"}</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter item title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary">
            {isEdit ? "Update Item" : "Create Item"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ItemFormComponent;
