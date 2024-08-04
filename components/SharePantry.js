// components/SharePantry.js
import { useState } from 'react';
import { firestore } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function SharePantry({ pantryId }) {
  const [email, setEmail] = useState('');

  const sharePantry = async () => {
    // Add logic to share pantry with specified email
    const pantryRef = doc(firestore, 'pantries', pantryId);
    await updateDoc(pantryRef, {
      sharedWith: firebase.firestore.FieldValue.arrayUnion(email)
    });
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={sharePantry}>Share Pantry</button>
    </div>
  );
}
