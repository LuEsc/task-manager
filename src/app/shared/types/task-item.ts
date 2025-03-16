export type TaskItem = {
    id?: string;
    title: string;
    description: string;
    createdAt?: Date;
    assignedTo?: string;
    status?: TaskStatus;
    pinned?: boolean;
};

export type TaskStatus = 'pending' | 'completed';