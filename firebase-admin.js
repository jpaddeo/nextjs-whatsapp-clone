const admin = require('firebase-admin');

try {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    databaseURL: 'https://wsapp-clone-2.firebaseio.com',
  });
} catch (e) {}

export const firestore = admin.firestore();
