import { format } from 'date-fns';

export function generateVideoUrl(date) {
  const formattedDate = format(date, 'MM-dd-yyyy');
  return `https://insession.idaho.gov/IIS/2024/Senate/Chambers/SenateChambers${formattedDate}.mp4`;
}