export const formatDateTime = (isoDateTime) => {
  if (!isoDateTime) return;
  const date = new Date(isoDateTime);
  const now = new Date();

  // Calculate the time difference in milliseconds
  const timeDiff = now.getTime() - date.getTime();

  // If the time difference is less than 24 hours, display relative time
  if (timeDiff < 24 * 60 * 60 * 1000) {
    if (timeDiff < 1000) {
      return 'Just now';
    } else if (timeDiff < 60 * 1000) {
      const seconds = Math.floor(timeDiff / 1000);
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (timeDiff < 60 * 60 * 1000) {
      const minutes = Math.floor(timeDiff / (60 * 1000));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(timeDiff / (60 * 60 * 1000));
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
  }

  // Format the date and time in local format
  const options = { dateStyle: 'medium', timeStyle: 'medium' };
  return new Intl.DateTimeFormat(navigator.language, options).format(date);
};
