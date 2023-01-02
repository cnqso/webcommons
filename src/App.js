import React, { useRef, useState } from 'react';
import './App.css';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth , GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";


import { useAuthState } from 'react-firebase-hooks/auth';
import { useList, useListVals } from 'react-firebase-hooks/database';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_PRIV_KEY,
  authDomain: "reactcommons.firebaseapp.com",
  databaseURL: "https://reactcommons-default-rtdb.firebaseio.com",
  projectId: "reactcommons",
  storageBucket: "reactcommons.appspot.com",
  messagingSenderId: "1065691708142",
  appId: "1:1065691708142:web:11c9050fc656410b9b11ff",
  measurementId: "G-PQHKRQWR78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);








function App() {

  const [user] = useAuthState(auth);


  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}


function SignIn() {

  const signInWithGoogle = () => {
    console.log(auth);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  // const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages, loading, error] = useList(ref(database, 'messages'));
  console.log(messages)
  const [formValue, setFormValue] = useState('');


  function writeUserData(user, text) {
    const db = getDatabase();
    const postListRef = ref(db, 'messages');
    const newPostRef = push(postListRef)
    set(newPostRef, {
      user: user,
      message: text
    });
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    await writeUserData(uid, formValue);

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
     <main>

       {messages.map(msg => <ChatMessage key={msg.key} message={msg.val().message} user={msg.val().user}/>)}

       <span ref={dummy}></span>

     </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const text = props.message;
  const uid = props.user;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      {/* <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} /> */}
      <p>{text}</p>
    </div>
  </>)
}


export default App;




// function ChatRoom() {
//   console.log(database);
//   const dummy = useRef();
//   const messagesRef = database.collection('messages');
//   // const query = messagesRef.orderBy('createdAt').limit(25);

//   const [messages] = useListVals(query, { idField: 'id' });

//   const [formValue, setFormValue] = useState('');


//   const sendMessage = async (e) => {
//     e.preventDefault();

//     const { uid, photoURL } = auth.currentUser;

//     await messagesRef.add({
//       text: formValue,
//       createdAt: database.FieldValue.serverTimestamp(),
//       uid,
//       photoURL
//     })

//     setFormValue('');
//     dummy.current.scrollIntoView({ behavior: 'smooth' });
//   }

//   return (<>
//     <main>

//       {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

//       <span ref={dummy}></span>

//     </main>

//     <form onSubmit={sendMessage}>

//       <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

//       <button type="submit" disabled={!formValue}>🕊️</button>

//     </form>
//   </>)
// }