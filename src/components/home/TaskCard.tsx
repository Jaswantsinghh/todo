import Image from "next/image";
import { Modal } from "../common";
import { useState } from 'react';
import Select from 'react-select';
import { getDatabase, ref as databaseRef, query, orderByChild, equalTo, get, remove, update } from "firebase/database";
import { firebaseConfig } from '@/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useUserStore } from "@/lib/useUserStore";
import { useTodoStore } from "@/lib/useTodoStore";
import toast, { Toaster } from 'react-hot-toast';

type TaskCardProps = {
    id: number,
    title: string,
    date: string,
    description: string,
    image?: string
}

export const TaskCard: React.FC<TaskCardProps> = ({ id, title, date, description, image }) => {
    const app = initializeApp(firebaseConfig);
    getAuth();
    const [openModal, setOpenModal] = useState(false);
    const [status, setStatus] = useState<'todo' | 'doing' | 'done'>('todo');

    const { user } = useUserStore();
    const { toggleTodo, removeTodo } = useTodoStore();

    const database = getDatabase(app);

    const options = [
        { value: 'todo', label: 'TODO' },
        { value: 'doing', label: 'DOING' },
        { value: 'done', label: 'DONE' }
      ];
    
    const handleClick = () => {
        setOpenModal(true);
    }
    const handleCloseModal = () => {
        setOpenModal(false);
    }
    
    const updateStatus = async () => {
        const tasksRef = databaseRef(database, `tasks/${user.userId}`);
        const taskQuery = query(
            tasksRef,
            orderByChild("id"),
            equalTo(id)
        );

        try {
            const snapshot = await get(taskQuery);
        
            // Check if a task with the specified description exists
            if (snapshot.exists()) {
              const taskKey = Object.keys(snapshot.val())[0]; // Get the key of the matched task
              const taskToUpdateRef = databaseRef(database, `tasks/${user.userId}/${taskKey}`);
        
              // Update the task with the new data
              update(taskToUpdateRef, { id, title, date, description, image, status: status}).then(() => {
                toggleTodo(id, status);
                toast.success('Task\'s status updated successfully');
              })
              .catch(() => {
                toast.error('Error while updating task\'s status');
              })
              setOpenModal(false);
            } else {
              console.log("Task with description not found.");
            }
          } catch (error) {
            console.error("Error updating task:", error);
          }
        }

    const deleteTask = async () => {
        const tasksRef = databaseRef(database, `tasks/${user.userId}`);
        const taskQuery = query(
            tasksRef,
            orderByChild("id"),
            equalTo(id)
        );

        try {
            const snapshot = await get(taskQuery);
        
            // Check if a task with the specified description exists
            if (snapshot.exists()) {
              const taskKey = Object.keys(snapshot.val())[0]; // Get the key of the matched task
              const taskToUpdateRef = databaseRef(database, `tasks/${user.userId}/${taskKey}`);
        
              // Update the task with the new data
              remove(taskToUpdateRef).then(() => {
                removeTodo(id);
                toast.success('Task removed successfully');
              })
              .catch((error) => {
                toast.error("Error while removing task ", error)
              })
              setOpenModal(false);
            } else {
              console.log("Task with description not found.");
            }
          } catch (error) {
            console.error("Error updating task:", error);
          }
    }

    return (
        <div onClick={handleClick} className="task-card">
            <div className="task-card-title">
                {title}
            </div>
            <p className="task-card-subtitle">Created on <span className="task-card-subtitle-date">{date}</span></p>
            <div className="task-card-description">{description?.length > 50 ? description?.slice(0, 50) : description}...</div>
            {image && (<div className="task-card-display">
                <Image className="task-card-display-image" width={300} height={100} src={image} alt="task image"></Image>
            </div>)}
            {openModal && (
                <Modal
                    onClose={handleCloseModal}
                    title={title}
                    onSave={() => {}}
                >
                    <p className="task-card-subtitle">Created on <span className="task-card-subtitle-date">{date}</span></p>
                    <div className="task-card-description">{description}</div>
                    {image && (<div className="task-card-display">
                        <Image className="task-card-display-image" width={300} height={100} src={image} alt="task image"></Image>
                    </div>)}
                    <div className="task-card-modal-buttons">
                        <p className="task-card-modal-buttons-label">Update Status: </p>
                        <div className="task-card-modal-buttons-container">
                            <Select options={options} onChange={(selectedOption) => setStatus(selectedOption?.value === "todo" ? "todo" : (selectedOption?.value === "doing" ? "doing" : "done"))}/>
                            <button className="task-card-modal-buttons-container-update" onClick={updateStatus}>Update</button>
                            <button className="task-card-modal-buttons-container-delete" onClick={deleteTask}>Delete</button>
                        </div>
                    </div>
                </Modal>
            )}
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div>
    );
};