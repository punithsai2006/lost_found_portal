import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemFormComponent from '../components/items/ItemForm';
import { getItem, updateItem, getCategories, createItem } from '../services/itemService';
import { Container, Alert } from 'react-bootstrap';
import Loading from '../components/common/Loading';

const ItemForm = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!itemId;

  const [initialData, setInitialData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);

        if (isEdit) {
          const item = await getItem(itemId);
          setInitialData(item);
        }
      } catch (err) {
        setError("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isEdit, itemId]);

  const handleSave = async (data) => {
    try {
      if (isEdit) {
        await updateItem(itemId, data);
        navigate(`/items/${itemId}`);
      } else {
        const newItem = await createItem(data);
        navigate(`/items/${newItem.item_id}`);
      }
    } catch (err) {
      setError("Save failed. Try again.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-3">
      <ItemFormComponent
        isEdit={isEdit}
        initialData={initialData}
        categories={categories}
        onSave={handleSave}
      />
    </Container>
  );
};

export default ItemForm;
