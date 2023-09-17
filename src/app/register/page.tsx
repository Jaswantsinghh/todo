"use client"
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { firebaseConfig } from "@/firebase/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from '@mui/material';
import { useUserStore } from "@/lib/useUserStore";
import toast, { Toaster } from 'react-hot-toast';
import { InputField } from "@/components/common";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRouter } from "next/navigation";

export default function Register() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const storage = getStorage();
  const router = useRouter();

  const { createUser, user } = useUserStore();

  const database = getDatabase(app);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      setProfilePicture(file);
    }
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const firebaseUser = userCredentials.user;
      const userData = {
        userId: firebaseUser.uid,
        username: username,
        email: email,
        image: '',
        accessToken: '',
      }
      if (profilePicture) {
        const storageRef = refStorage(storage, `profilePictures/${firebaseUser.uid}`);
        uploadBytes(storageRef, profilePicture).then(() => {
          getDownloadURL(storageRef)
          .then((url) => {
            userData.image = url;
          })
          .catch((error) => toast.error('Error while uploading photo', error));
        });
      }
      set(ref(database, 'users/' + firebaseUser.uid), {
        username: username,
        email: email,
        image: `https://firebasestorage.googleapis.com/v0/b/todo-62fd1.appspot.com/o/profilePictures/${firebaseUser.uid}`,
      }).then(() => {
        firebaseUser.getIdToken().then((idToken) => {
          userData.accessToken = idToken;
        })
        .catch((err) => {
          console.log("Error while fetching access token ", err);
        })
        createUser(userData);
        toast.success("Sign up successful");
        router.push('/')
      })
      .catch((err) => {
        toast.error("Something went wrong ", err);
      })
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      switch (errorCode) {
        case 'auth/email-already-in-use':
          toast.error('Email is already in use.');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email address.');
          break;
        case 'auth/weak-password':
          toast.error('Password is too weak.');
          break;
        default:
          toast.error('An error occurred while registering the user:', errorMessage);
          break;
      }
    })
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
          input={username}
          name="username"
          setInput={setUsername}
          type="text"
          text="Username"
          className="login-card-username"
        />
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
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          {profilePicture ? 'Picture Uploaded' : 'Upload Profile Picture'}
          <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
        </Button>
        <Button className="login-card-button" onClick={handleSignUp}>Sign Up</Button>
        <div>
          <span>OR</span>
        </div>
        <div className="link" onClick={() => router.push("/login")}><u>Log In</u></div>
        <div>

        </div>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />


    </main>
  )
}
