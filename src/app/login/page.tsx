"use client"
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";
import { firebaseConfig } from "@/firebase/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button } from '@mui/material';
import { useUserStore } from "@/lib/useUserStore";
import toast, { Toaster } from 'react-hot-toast';
import { InputField } from "@/components/common";
import { useRouter } from "next/navigation";
export default function Register() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const router = useRouter();
  const { createUser, user } = useUserStore();

  const database = getDatabase(app);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
        const fetcheduser = userCredential.user;
        const userData = {
          userId: fetcheduser.uid,
          username: '',
          email: email,
          accessToken: '',
          image: '',
        }
        fetcheduser.getIdToken().then((idToken) => {
          userData.accessToken = idToken;
        })
        .catch((err) => {
          console.log("Error while fetching access token ", err);
        })
        toast.success("Log In successful");
        get(child(ref(database), `users/${fetcheduser.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              userData.username = data.username;
              userData.image = data.image;
              createUser(userData);
            } else {
              toast.error("User doesnt exist");
            }
          }).catch((error) => {
            toast.error("Something went wrong ", error);
        });
        router.push("/");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    switch (errorCode) {
        case 'auth/invalid-email':
          toast.error('Invalid email address.');
          break;

        default:
          toast.error('An error occurred while logging in the user:', errorMessage);
          break;
      }
  });
  }

  useEffect(() => {
    if(user.accessToken.length > 0) {
      router.push('/');
    }
  }, [user.accessToken, router])

  return (
    <main className="login">
      <div className="login-card">
        <InputField
            input={email}
            name="email"
            setInput={setEmail}
            type="text"
            text="Email"
            className="login-card-email"
         />
         <InputField
            input={password}
            name="password"
            setInput={setPassword}
            type="password"
            text="Password"
            className="login-card-password"
         />

        <Button className="login-card-button" onClick={handleLogIn}>Log In</Button>
        <div>
          <span>OR</span>
        </div>
        <div className="link" onClick={() => router.push("/register")}><u>Sign Up</u></div>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </main>
  )
}
