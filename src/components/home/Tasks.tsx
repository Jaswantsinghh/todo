import { useEffect, useState } from 'react';
import { TaskCard } from ".";
import { getDatabase, ref as databaseRef, DataSnapshot, onValue } from "firebase/database";
import { firebaseConfig } from '@/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useUserStore } from '@/lib/useUserStore';
import { useTodoStore } from '@/lib/useTodoStore';

type Task = {
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'doing' | 'done';
    date?: string;
    image?: string;
  };

export const Tasks = () => {
    const app = initializeApp(firebaseConfig);
    getAuth();
    const { user } = useUserStore();
    const { todos, loadTodo } = useTodoStore();
    const database = getDatabase(app);

    console.log(todos);
    const [filteredTasks, setFilteredTasks] = useState<{
        todo: Task[];
        doing: Task[];
        done: Task[];
      }>({
        todo: [],
        doing: [],
        done: [],
      });
    
    const getAllTasksForUser = (userId: string) => {
    
        const tasksRef = databaseRef(database, `tasks/${userId}`);
        return new Promise<DataSnapshot>((resolve, reject) => {
            onValue(tasksRef, (snapshot) => {
                resolve(snapshot);
            }, (error) => {
                reject(error);
            });
        });
    };

    useEffect(() => {
        console.log("run")
        getAllTasksForUser(user.userId)
        .then((snapshot) => {
        const tasksData = snapshot.val();
        if (tasksData) {
          const taskArray: Task[] = Object.values(tasksData);
          loadTodo(taskArray);
        } else {
            console.log("No tasks found for the user.");
        }
    })
    .catch((error) => {
        console.error("Error fetching tasks:", error);
    });
    }, [])

    useEffect(() => {
        const todoTasks = todos.filter((task) => task.status === 'todo');
        const doingTasks = todos.filter((task) => task.status === 'doing');
        const doneTasks = todos.filter((task) => task.status === 'done');
        
        setFilteredTasks({
          todo: todoTasks,
          doing: doingTasks,
          done: doneTasks,
        });
      }, [todos]);

    return (
        <div className="tasks">
            <div className="tasks-layout">
                <div className="tasks-layout-section">
                    <p>TODO</p>
                    <div className="tasks-layout-section-cards">
                    {filteredTasks.todo.map((task) => (
                        <TaskCard
                            id={task.id}
                            key={task.id}
                            title={task.title}
                            date={task.date || " "}
                            description={task.description}
                            image={task.image}
                        />
                    ))}
                    </div>
                </div>
                <div className="tasks-layout-section">
                    <p>DOING</p>
                    <div className="tasks-layout-section-cards">
                    {filteredTasks.doing.map((task) => (
                        <TaskCard
                            id={task.id}
                            key={task.id}
                            title={task.title}
                            date={task.date || " "}
                            description={task.description}
                            image={task.image}
                        />
                    ))}
                    </div>
                </div>
                <div className="tasks-layout-section">
                    <p>DONE</p>
                    <div className="tasks-layout-section-cards">
                    {filteredTasks.done.map((task) => (
                        <TaskCard
                            id={task.id}
                            key={task.id}
                            title={task.title}
                            date={task.date || " "}
                            description={task.description}
                            image={task.image}
                        />
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}