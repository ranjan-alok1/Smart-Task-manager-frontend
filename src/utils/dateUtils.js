import { format, isToday, isTomorrow, isYesterday, formatDistanceToNow } from 'date-fns';

export const formatDate = (date) => {
    const d = new Date(date);
    if (isToday(d)) return `Today at ${format(d, 'h:mm a')}`;
    if (isTomorrow(d)) return `Tomorrow at ${format(d, 'h:mm a')}`;
    if (isYesterday(d)) return `Yesterday at ${format(d, 'h:mm a')}`;
    return format(d, 'MMM d, yyyy h:mm a');
};

export const formatDueDate = (date) => {
    const d = new Date(date);
    return formatDistanceToNow(d, { addSuffix: true });
};

export const isOverdue = (date) => {
    return new Date(date) < new Date() && !isToday(new Date(date));
};

export const getDayStatus = (date) => {
    const today = new Date();
    const taskDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate < today) return 'overdue';
    if (taskDate.getTime() === today.getTime()) return 'today';
    return 'upcoming';
};

export const sortByDueDate = (tasks) => {
    return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};