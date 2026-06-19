export function formatNotificationContent(content: string): string {
  const normalized = content.trim();

  const monthlyTimesheetMatch = normalized.match(
    /^Your monthly timesheet\s+(\d{1,2})\/(\d{4})\s+was\s+(approved|rejected)\.?(?:\s*Reason:\s*(.+))?$/i,
  );

  if (monthlyTimesheetMatch) {
    const [, month, year, status, reason] = monthlyTimesheetMatch;
    const statusText =
      status.toLowerCase() === 'approved' ? 'đã được phê duyệt' : 'đã bị từ chối';
    const reasonText = reason?.trim() ? ` Lý do: ${reason.trim()}` : '';

    return `Bảng công tháng ${Number(month)}/${year} của bạn ${statusText}.${reasonText}`;
  }

  const leaveReviewMatch = normalized.match(
    /^Your leave application from\s+(.+?)\s+to\s+(.+?)\s+has been\s+(approved|rejected)\.?(?:\s*Reason:\s*(.+))?$/i,
  );

  if (leaveReviewMatch) {
    const [, startDate, endDate, status, reason] = leaveReviewMatch;
    const statusText =
      status.toLowerCase() === 'approved' ? 'đã được phê duyệt' : 'đã bị từ chối';
    const reasonText = reason?.trim() ? ` Lý do: ${reason.trim()}` : '';

    return `Đơn nghỉ phép từ ${formatNotificationDate(startDate)} đến ${formatNotificationDate(endDate)} của bạn ${statusText}.${reasonText}`;
  }

  const leaveSubmitMatch = normalized.match(
    /^New leave application submitted by\s+(.+?)\s+from\s+(.+?)\s+to\s+(.+?)\s+\((\d+)\s+days?\)\.?$/i,
  );

  if (leaveSubmitMatch) {
    const [, employeeName, startDate, endDate, duration] = leaveSubmitMatch;

    return `${employeeName} đã gửi đơn nghỉ phép từ ${formatNotificationDate(startDate)} đến ${formatNotificationDate(endDate)} (${duration} ngày).`;
  }

  return normalized;
}

export function formatNotificationDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
