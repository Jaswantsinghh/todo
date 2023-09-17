import { useEffect, useState } from 'react'
import { useUserStore } from "@/lib/useUserStore";
import { getStorage, ref, getDownloadURL, uploadBytes, StorageReference } from "firebase/storage";
import Image from "next/image";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebase/firebase";
import { getAuth, signOut } from "firebase/auth";
import { Tasks, PlusIcon, LogOutIcon } from '@/icons';
import { Modal, InputField } from '../common';
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button } from '@mui/material';
import { getCurrentDate } from '@/utils';
import { ref as databaseRef, getDatabase, push } from 'firebase/database';
import { useTodoStore } from '@/lib/useTodoStore';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export const SideBar = () => {
    const { user, logoutUser } = useUserStore();
    const router = useRouter();
    const { todos, addTodo } = useTodoStore();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const storage = getStorage(app);
    const [profileURL, setProfileUrl] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [taskPhoto, setTaskPhoto] = useState<File | null>(null)
    const [todoTask, setTodoTask] = useState<number>(0);
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

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        
        if (files && files.length > 0) {
          const file = files[0];
          setTaskPhoto(file);
        }
      };

    getDownloadURL(ref(storage, `profilePictures/${user.userId}`))
  .then((url) => {
    setProfileUrl(url);
  })
  .catch((error) => {
    // Handle any errors
  });

  const createATask = async () => {
    let photoURL = '';
    if (taskPhoto) {
        const taskPhotoRef: StorageReference = ref(storage, `taskPhotos/${user.userId}/${title}_${Date.now()}`);
        const snapshot = await uploadBytes(taskPhotoRef, taskPhoto);
        photoURL = await getDownloadURL(snapshot.ref);
    }

    const newTask = {
        id: Date.now(),
        title,
        description,
        image: photoURL,
        date: getCurrentDate(),
        status: 'todo', // Set the default status here
    };

    const database = getDatabase(app);
    push(databaseRef(database, `tasks/${user.userId}`), newTask).then(() => {
        addTodo({...newTask, status: "todo"});
        setTitle('');
        setDescription('');
        setTaskPhoto(null);
        toast.success('Task added successfully');
    })
    .catch((err) => {
        toast.error("Error while creating a task", err);
    })
    setModalOpen(false);
  }
    const TABS = [
        {
            id: '1t',
            title: 'Create Task',
            icon: 'plus',
        },
        {
            id: '2t',
            title: 'Log Out',
            icon: 'logout',
        }
    ];

    const logOut = () => {
        signOut(auth).then(() => {
            logoutUser();
            toast.success('Logout successful');
            router.push('/login');
          }).catch((error) => {
            toast.error('Error while logging out');
            // An error happened.
          });
    }

    useEffect(() => {
        const todoTasks = todos.filter((task) => task.status === 'todo');
        setTodoTask(todoTasks?.length || 0);
    }, [todos])

    return (
        <div className="home-sidebar">
            <div className="home-sidebar-profile">
                <div className="home-sidebar-profile-image">
                    <Image className='home-sidebar-profile-image-image' src={profileURL ? profileURL : ''} width="48" height="48" alt='display' />
                </div>
                <p className="home-sidebar-profile-username">{user.username || 'User'}</p>
            </div>
            <div className='home-sidebar-tabs'>
                <div className='home-sidebar-tabs-container active-tab'>
                    <div className='home-sidebar-tabs-container-main'>
                        <Tasks />
                        <p className='home-sidebar-tabs-container-main-name'>Tasks</p>
                    </div>
                    {todoTask > 0 && (<div className='home-sidebar-tabs-container-num'>{todoTask}</div>)}
                </div>
                {TABS.map(({ id, title, icon }) => (
                    <div key={id} className='home-sidebar-tabs-container' onClick={id === '1t' ? handleModalOpen : logOut}>
                        <div className='home-sidebar-tabs-container-main'>
                            {icon === 'tasks' && <Tasks />}
                            {icon === 'plus' && <PlusIcon />}
                            {icon === 'logout' && <LogOutIcon />}
                            <p className='home-sidebar-tabs-container-main-name active'>{title}</p>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <Modal
                    title="Create Task"
                    onClose={() => setModalOpen(false)}
                >
                    <div className='create-task-modal'>
                        <InputField
                            input={title}
                            text="Title"
                            name="title"
                            setInput={setTitle}
                            type="text"
                        />
                        <InputField
                            input={description}
                            text="Description"
                            name="description"
                            setInput={setDescription}
                            type="text"
                        />
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                        >
                            {taskPhoto ? 'Picture Uploaded' : 'Upload a Picture'}
                            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                        </Button>
                        <button onClick={createATask} className="task-card-modal-buttons-container-update">Create</button>
                    </div>
                </Modal>
            )}
            <Toaster
        position="top-right"
        reverseOrder={false}
      />
        </div>
    );
}