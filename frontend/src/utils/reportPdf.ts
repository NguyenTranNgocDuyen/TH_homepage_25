import type { Timesheet } from '../types';
import type { TimesheetReportFilters, TimesheetReportSummary } from '../services/timesheetService';

interface ExportTimesheetReportPdfInput {
  title: string;
  filters: TimesheetReportFilters;
  rows: Timesheet[];
  summary: TimesheetReportSummary;
  filterNames?: {
    employeeName?: string;
    departmentName?: string;
  };
}

export function exportTimesheetReportPdf({
  title,
  filters,
  rows,
  summary,
  filterNames,
}: ExportTimesheetReportPdfInput): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const contentWindow = iframe.contentWindow;
  if (!contentWindow) {
    document.body.removeChild(iframe);
    throw new Error('Cannot create print iframe.');
  }

  contentWindow.document.open();
  contentWindow.document.write(buildTimesheetReportHtml({ title, filters, rows, summary, filterNames }));
  contentWindow.document.close();

  contentWindow.focus();
  contentWindow.setTimeout(() => {
    contentWindow.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }, 250);
}

function buildTimesheetReportHtml({
  title,
  filters,
  rows,
  summary,
  filterNames,
}: ExportTimesheetReportPdfInput): string {
  const generatedAt = new Date().toLocaleString('vi-VN');

  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4 landscape; margin: 14mm; }
    body { font-family: Arial, sans-serif; color: #0f172a; margin: 0; }
    h1 { font-size: 22px; margin: 0 0 6px; }
    p { margin: 0; color: #475569; font-size: 12px; }
    .meta { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin: 16px 0; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 16px 0; }
    .box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; }
    .box span { display: block; color: #64748b; font-size: 11px; text-transform: uppercase; }
    .box strong { display: block; font-size: 16px; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th, td { border: 1px solid #cbd5e1; padding: 7px; text-align: left; vertical-align: top; }
    th { background: #e2e8f0; color: #334155; text-transform: uppercase; font-size: 10px; }
    .right { text-align: right; }
    .muted { color: #64748b; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>Đã tạo lúc ${escapeHtml(generatedAt)}</p>
  <section class="meta">
    <div class="box"><span>Từ ngày</span><strong>${escapeHtml(filters.fromDate || '--')}</strong></div>
    <div class="box"><span>Đến ngày</span><strong>${escapeHtml(filters.toDate || '--')}</strong></div>
    <div class="box"><span>Nhân viên</span><strong>${escapeHtml(filterNames?.employeeName || (filters.employeeId === 'all' ? 'Tất cả nhân viên' : filters.employeeId) || 'Tất cả nhân viên')}</strong></div>
    <div class="box"><span>Phòng ban</span><strong>${escapeHtml(filterNames?.departmentName || (filters.departmentId === 'all' ? 'Tất cả phòng ban' : filters.departmentId) || 'Tất cả phòng ban')}</strong></div>
    <div class="box"><span>Trạng thái</span><strong>${escapeHtml(formatStatusLabel(filters.status === 'all' ? 'Tất cả trạng thái' : (filters.status || 'Tất cả trạng thái')))}</strong></div>
  </section>
  <section class="summary">
    <div class="box"><span>Tổng dòng</span><strong>${summary.totalRecords}</strong></div>
    <div class="box"><span>Nhân viên</span><strong>${summary.totalEmployees}</strong></div>
    <div class="box"><span>Tổng giờ</span><strong>${formatHours(summary.totalHours)}</strong></div>
    <div class="box"><span>Cảnh báo</span><strong>${summary.warningRecords}</strong></div>
  </section>
  <table>
    <thead>
      <tr>
        <th>Mã</th>
        <th>Nhân viên</th>
        <th>Phòng ban</th>
        <th>Ngày</th>
        <th>In</th>
        <th>Out</th>
        <th class="right">Tổng giờ</th>
        <th>Trạng thái</th>
        <th>Cảnh báo</th>
      </tr>
    </thead>
    <tbody>
      ${rows.length ? rows.map(renderRow).join('') : '<tr><td colspan="9" class="muted">Không có dữ liệu timesheet phù hợp.</td></tr>'}
    </tbody>
  </table>
</body>
</html>`;
}

function renderRow(row: Timesheet): string {
  const warnings = getWarningLabels(row.warnings).join(', ') || '--';

  return `<tr>
    <td>${escapeHtml(row.code || row.id)}</td>
    <td>${escapeHtml(row.employeeName || row.employeeId || '--')}</td>
    <td>${escapeHtml((row as any).departmentName || row.departmentId || '--')}</td>
    <td>${escapeHtml(row.workDate || row.date || '--')}</td>
    <td>${escapeHtml(row.checkIn || '--')}</td>
    <td>${escapeHtml(row.checkOut || '--')}</td>
    <td class="right">${formatHours(row.totalHours || 0)}</td>
    <td>${escapeHtml(formatStatusLabel(row.status || '--'))}</td>
    <td>${escapeHtml(warnings)}</td>
  </tr>`;
}

function getWarningLabels(warnings: unknown): string[] {
  if (!Array.isArray(warnings)) {
    return [];
  }

  return warnings
    .map((warning) => {
      if (typeof warning === 'string') {
        return formatWarningLabel(warning);
      }

      if (warning && typeof warning === 'object') {
        const value = warning as { label?: string; code?: string };
        return formatWarningLabel(value.label || value.code || '');
      }

      return '';
    })
    .filter(Boolean);
}

function formatHours(value: number): string {
  return `${Number(value || 0).toFixed(1)}h`;
}

function formatStatusLabel(status: string): string {
  switch (status) {
    case 'Pending':
      return 'Chờ duyệt';
    case 'Submitted':
      return 'Đã gửi';
    case 'Approved':
      return 'Đã duyệt';
    case 'Rejected':
      return 'Từ chối';
    default:
      return status;
  }
}

function formatWarningLabel(warning: string): string {
  switch (warning) {
    case 'Missing Out':
      return 'Thiếu check-out';
    case 'Under 2h':
    case 'Duoi 2h':
      return 'Dưới 2h';
    case 'Warning':
      return 'Cảnh báo';
    case 'Rejected Entry':
      return 'Bản ghi bị từ chối';
    default:
      return warning;
  }
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
