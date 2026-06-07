export function getStatusLabel(status) {
  if (status === "completed") return "DONE";
  if (status === "in_progress") return "LEARNING";
  return "NEW";
}

export function getStatusClass(status) {
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "in_progress") return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-800";
}

export function getActionLabel(status) {
  if (status === "completed") return "Review";
  if (status === "in_progress") return "Continue";
  return "Start";
}