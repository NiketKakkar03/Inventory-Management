'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "../utils/firebase";
import { Box, Button, Modal, Stack, TextField, Typography, IconButton } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async (searchQuery = '') => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const data = { name: doc.id, ...doc.data() };
      if (data.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        inventoryList.push(data);
      }
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box className="container">
      <h1>Welcome to Your Pantry Tracker</h1>
      <Modal open={open} onClose={handleClose}>
        <Box className="modal">
          <Typography variant="h6">Add Item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <Button variant="contained" onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>Add new Item</Button>
      <Box className="inventory">
        <Box className="inventory-header">
          <Typography variant="h2">Inventory Items</Typography>
        </Box>
        <Stack spacing={2} className="inventory-list">
          {
            inventory.map(({ name, quantity }) => (
              <Box key={name} className="inventory-item">
                <Typography variant="h3">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                <Typography variant="h3">{quantity}</Typography>
                <IconButton onClick={() => removeItem(name)}>
                </IconButton>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  );
}
