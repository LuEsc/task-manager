import { computed, effect, Injectable, resource, Signal, signal } from "@angular/core";
import { TaskItem } from "../../../../shared/types/task-item";
import { loadFromLocalStorage, saveToLocalStorage } from "../../../../shared/utils/storage";

@Injectable({providedIn: 'root'})
export class Task {
    private PREFIX_ID = 'task-';
    
    // Signal to store the list of tasks
    private tasksSignal = signal<TaskItem[]>(this.loadTasks());

    // Computed signal to retrieve pending tasks
    public pendingTasks = computed(() =>
        this.tasksSignal().filter((task) => task.status !== "completed")
    );

    // Computed signal to retrieve completed tasks
    public completedTasks = computed(() =>
        this.tasksSignal().filter((task) => task.status === "completed")
    );

    // Computed signal to retrieve pinned tasks
    public pinnedTasks = computed(() =>
        this.tasksSignal().filter((task) => task.pinned)
    );

    /**
     * Retrieves all tasks sorted by creation date in descending order.
     * @returns {TaskItem[]} An array of tasks sorted by creation date in descending order.
     */
    allTasks(): TaskItem[] {
        return [...this.tasksSignal()].sort((a, b) => 
            (b?.createdAt?.getTime() ?? 0) - (a?.createdAt?.getTime() ?? 0)
        );
    }
    

    /**
     * Loads tasks from localStorage.
     * @returns {TaskItem[]} An array of tasks retrieved from storage or an empty array if none exist.
     */
    private loadTasks(): TaskItem[] {
        return loadFromLocalStorage<TaskItem[]>('tasks') || [];
    }

    /**
     * Creates a new task and adds it to the task list.
     * @param {string} title - The title of the new task.
     */
    public addTask(task: TaskItem): void {
        const newTask: TaskItem = {
            id: `${this.PREFIX_ID + Date.now()}`, 
            title: task.title,
            description: task.description,  
            status: "pending",
            pinned: false,
            createdAt: new Date(),
            assignedTo: "User",
        };
        
        this.tasksSignal.update((tasks) => [...tasks, newTask]);
    }

    /**
     * Deletes a task from the task list by its ID.
     * @param {string} id - The ID of the task to be deleted.
     */
    public deleteTask(id: string): void {
        this.tasksSignal.update((tasks) => tasks.filter((task) => task.id !== id));
    }

    /**
     * Updates the title of a task identified by its ID.
     * @param {string} id - The ID of the task to be updated.
     * @param {string} newTitle - The new title for the task.
     */
    public editTask(id: string, newTitle: string): void {
        this.tasksSignal.update((tasks) =>
            tasks.map((task) =>
                task.id === id ? { ...task, title: newTitle } : task
            )
        );
    }

    /**
     * Toggles a task's completion status. If the task is not completed, it marks it as completed.
     * @param {string} id - The ID of the task to toggle completion status.
     */
    public toggleTaskCompletion(id: string): void {
        this.tasksSignal.update((tasks) =>
            tasks.map((task) =>
                task.id === id ? { ...task, status: "completed" } : task
            )
        );
    }

    /**
     * Toggles the pinned status of a task. If pinned, it unpins it and vice versa.
     * @param {string} id - The ID of the task to toggle pin status.
     */
    public toggleTaskPin(id: string): void {
        this.tasksSignal.update((tasks) =>
            tasks.map((task) =>
                task.id === id ? { ...task, pinned: !task.pinned } : task
            )
        );
    }
}