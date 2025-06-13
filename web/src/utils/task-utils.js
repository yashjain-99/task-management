export const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getTaskStatusColor = (dueDate) => {
  const daysUntil = getDaysUntilDue(dueDate);
  if (daysUntil < 0) return "text-red-600 bg-red-50";
  if (daysUntil <= 2) return "text-orange-600 bg-orange-50";
  return "text-green-600 bg-green-50";
};
