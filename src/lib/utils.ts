import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { parseISO, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export  const formatDate = (utcDateString: string) => {
  // Parse the UTC date string into a Date object
  const parsedDate = parseISO(utcDateString);

  // Format the date using the desired format (YYYY/mm/dd)
  const formattedDate = format(parsedDate, "yyyy/MM/dd");

  return formattedDate;
};