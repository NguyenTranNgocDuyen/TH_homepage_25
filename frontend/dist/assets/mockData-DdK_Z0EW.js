function e({title:e,filters:n,rows:r,summary:i}){let a=window.open(``,`_blank`,`noopener,noreferrer,width=1100,height=800`);if(!a)throw Error(`Cannot open PDF print window. Please allow pop-ups for this site.`);a.document.write(t({title:e,filters:n,rows:r,summary:i})),a.document.close(),a.focus(),a.setTimeout(()=>{a.print()},250)}function t({title:e,filters:t,rows:r,summary:o}){let s=new Date().toLocaleString(`vi-VN`);return`<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>${a(e)}</title>
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
  <h1>${a(e)}</h1>
  <p>Generated at ${a(s)}</p>
  <section class="meta">
    <div class="box"><span>From date</span><strong>${a(t.fromDate||`--`)}</strong></div>
    <div class="box"><span>To date</span><strong>${a(t.toDate||`--`)}</strong></div>
    <div class="box"><span>Employee</span><strong>${a(t.employeeId||`All`)}</strong></div>
    <div class="box"><span>Department</span><strong>${a(t.departmentId||`All`)}</strong></div>
    <div class="box"><span>Status</span><strong>${a(t.status||`All`)}</strong></div>
  </section>
  <section class="summary">
    <div class="box"><span>Rows</span><strong>${o.totalRecords}</strong></div>
    <div class="box"><span>Employees</span><strong>${o.totalEmployees}</strong></div>
    <div class="box"><span>Total hours</span><strong>${i(o.totalHours)}</strong></div>
    <div class="box"><span>Warnings</span><strong>${o.warningRecords}</strong></div>
  </section>
  <table>
    <thead>
      <tr>
        <th>Code</th>
        <th>Employee</th>
        <th>Department</th>
        <th>Date</th>
        <th>In</th>
        <th>Out</th>
        <th class="right">Hours</th>
        <th>Status</th>
        <th>Warnings</th>
      </tr>
    </thead>
    <tbody>
      ${r.length?r.map(n).join(``):`<tr><td colspan="9" class="muted">No timesheet rows match the current filters.</td></tr>`}
    </tbody>
  </table>
</body>
</html>`}function n(e){let t=r(e.warnings).join(`, `)||`--`;return`<tr>
    <td>${a(e.code||e.id)}</td>
    <td>${a(e.employeeName||e.employeeId||`--`)}</td>
    <td>${a(e.departmentName||e.departmentId||`--`)}</td>
    <td>${a(e.workDate||e.date||`--`)}</td>
    <td>${a(e.checkIn||`--`)}</td>
    <td>${a(e.checkOut||`--`)}</td>
    <td class="right">${i(e.totalHours||0)}</td>
    <td>${a(e.status||`--`)}</td>
    <td>${a(t)}</td>
  </tr>`}function r(e){return Array.isArray(e)?e.map(e=>{if(typeof e==`string`)return e;if(e&&typeof e==`object`){let t=e;return t.label||t.code||``}return``}).filter(Boolean):[]}function i(e){return`${Number(e||0).toFixed(1)}h`}function a(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}var o=[{id:`dept-engineering`,name:`Engineering`},{id:`dept-product`,name:`Product`},{id:`dept-hr`,name:`Human Resources`},{id:`dept-finance`,name:`Finance`}],s={id:`mgr-001`,name:`Đặng Kim An`,email:`manager@timesheet.com`,role:`manager`,departmentId:`dept-engineering`,managedEmployeeIds:[`emp-001`,`emp-002`,`emp-003`,`emp-004`]},c={id:`hr-001`,name:`Lê Thu Hà`,email:`hr@timesheet.com`,role:`hr`,departmentId:`dept-hr`,permissions:[`MANAGE_EMPLOYEES`,`EXPORT_PAYROLL`,`MANAGE_LEAVE_TYPES`]},l=[{id:`emp-001`,employeeCode:`EMP-001`,fullName:`Nguyễn Trần Ngọc Duyên`,email:`employee@timesheet.com`,departmentId:`dept-engineering`,title:`Frontend Developer`,role:`employee`,status:`Active`,isActive:!0,leaveBalance:8,monthlyHours:154.5,salaryCoefficient:2.4,phone:`0901 234 567`,location:`Ho Chi Minh City`,startedAt:`2025-08-12`,profileStatus:`verified`},{id:`emp-002`,employeeCode:`EMP-002`,fullName:`Lê Minh Quân`,email:`quan.le@timesheet.com`,departmentId:`dept-engineering`,title:`Backend Developer`,role:`employee`,status:`Active`,isActive:!0,leaveBalance:5,monthlyHours:161,salaryCoefficient:2.7,phone:`0902 456 789`,location:`Ho Chi Minh City`,startedAt:`2025-06-04`,profileStatus:`verified`},{id:`emp-003`,employeeCode:`EMP-003`,fullName:`Trần Hải Yến`,email:`yen.tran@timesheet.com`,departmentId:`dept-engineering`,title:`QA Engineer`,role:`employee`,status:`Inactive`,isActive:!1,leaveBalance:2,monthlyHours:118,salaryCoefficient:2.1,phone:`0903 567 890`,location:`Da Nang`,startedAt:`2025-02-18`,profileStatus:`inactive-recent`},{id:`emp-004`,employeeCode:`EMP-004`,fullName:`Phạm Hoàng Nam`,email:`nam.pham@timesheet.com`,departmentId:`dept-engineering`,title:`DevOps Engineer`,role:`employee`,status:`Active`,isActive:!0,leaveBalance:0,monthlyHours:168.25,salaryCoefficient:3.1,phone:`0904 678 901`,location:`Ho Chi Minh City`,startedAt:`2024-11-22`,profileStatus:`verified`},{id:`emp-005`,employeeCode:`EMP-005`,fullName:`Võ Hà Như Thủy`,email:`thuy.vo@timesheet.com`,departmentId:`dept-hr`,title:`HR Specialist`,role:`employee`,status:`Active`,isActive:!0,leaveBalance:9,monthlyHours:150,salaryCoefficient:2.3,phone:`0905 789 012`,location:`Ha Noi`,startedAt:`2025-01-15`,profileStatus:`verified`},{id:`emp-006`,employeeCode:`EMP-006`,fullName:`Bùi Gia Huy`,email:`huy.bui@timesheet.com`,departmentId:`dept-finance`,title:`Accountant`,role:`employee`,status:`Active`,isActive:!0,leaveBalance:7,monthlyHours:146.5,salaryCoefficient:2,phone:`0906 890 123`,location:`Ho Chi Minh City`,startedAt:`2025-04-02`,profileStatus:`new-review`},{id:`mgr-001`,employeeCode:`MGR-001`,fullName:`Đặng Kim An`,email:`manager@timesheet.com`,departmentId:`dept-engineering`,title:`Engineering Manager`,role:`manager`,status:`Active`,isActive:!0,leaveBalance:10,monthlyHours:166,salaryCoefficient:4,phone:`0907 901 234`,location:`Ho Chi Minh City`,startedAt:`2023-09-01`,profileStatus:`verified`},{id:`hr-001`,employeeCode:`HR-001`,fullName:`Lê Thu Hà`,email:`hr@timesheet.com`,departmentId:`dept-hr`,title:`HR Manager`,role:`hr`,status:`Active`,isActive:!0,leaveBalance:11,monthlyHours:152,salaryCoefficient:3.6,phone:`0908 012 345`,location:`Ha Noi`,startedAt:`2023-03-20`,profileStatus:`verified`}],u=[{id:`ts-001`,code:`TS-20260504-001`,employeeId:`emp-001`,departmentId:`dept-engineering`,workDate:`2026-05-04`,periodLabel:`Ngày 04/05/2026`,checkIn:`08:12`,checkOut:`17:42`,totalHours:8.5,status:`Submitted`,locked:!1,warnings:[{code:`LATE`,label:`Đi muộn`,tone:`warning`}]},{id:`ts-002`,code:`TS-20260504-002`,employeeId:`emp-002`,departmentId:`dept-engineering`,workDate:`2026-05-04`,periodLabel:`Ngày 04/05/2026`,checkIn:`08:00`,checkOut:``,totalHours:0,status:`Pending`,locked:!1,warnings:[{code:`MISSING_OUT`,label:`Missing Out`,tone:`danger`},{code:`MISSING_CHECKOUT`,label:`Thiếu check-out`,tone:`danger`}]},{id:`ts-003`,code:`TS-20260504-003`,employeeId:`emp-004`,departmentId:`dept-engineering`,workDate:`2026-05-04`,periodLabel:`Ngày 04/05/2026`,checkIn:`08:04`,checkOut:`17:30`,totalHours:8.1,status:`Submitted`,locked:!1,warnings:[{code:`CONFLICT`,label:`Xung đột đơn nghỉ`,tone:`warning`}]},{id:`ts-004`,code:`TS-20260503-004`,employeeId:`emp-003`,departmentId:`dept-engineering`,workDate:`2026-05-03`,periodLabel:`Ngày 03/05/2026`,checkIn:`08:05`,checkOut:`17:35`,totalHours:8.2,status:`Approved`,locked:!0,warnings:[]},{id:`ts-005`,code:`TS-20260502-005`,employeeId:`emp-001`,departmentId:`dept-engineering`,workDate:`2026-05-02`,periodLabel:`Ngày 02/05/2026`,checkIn:`09:10`,checkOut:`16:30`,totalHours:6.6,status:`Rejected`,locked:!1,rejectionReason:`Thiếu giải trình cho thời gian đi muộn và về sớm.`,warnings:[{code:`LATE`,label:`Đi muộn`,tone:`warning`}]},{id:`ts-006`,code:`TS-20260504-006`,employeeId:`emp-005`,departmentId:`dept-hr`,workDate:`2026-05-04`,periodLabel:`Ngày 04/05/2026`,checkIn:`08:03`,checkOut:`17:40`,totalHours:8.4,status:`Submitted`,locked:!1,warnings:[]},{id:`ts-007`,code:`TS-20260503-007`,employeeId:`emp-006`,departmentId:`dept-finance`,workDate:`2026-05-03`,periodLabel:`Ngày 03/05/2026`,checkIn:`08:01`,checkOut:`17:32`,totalHours:8.2,status:`Approved`,locked:!0,warnings:[]},{id:`ts-008`,code:`TS-20260503-008`,employeeId:`mgr-001`,departmentId:`dept-engineering`,workDate:`2026-05-03`,periodLabel:`Ngày 03/05/2026`,checkIn:`08:15`,checkOut:`18:10`,totalHours:8.9,status:`Approved`,locked:!0,warnings:[]}],d=[{id:`annual`,code:`ANNUAL`,name:`Nghỉ phép năm`,isPaid:!0,defaultDaysPerYear:12,status:`Active`,note:`Áp dụng cho nhân viên chính thức.`,hasUsageHistory:!0},{id:`sick`,code:`SICK`,name:`Nghỉ ốm`,isPaid:!0,defaultDaysPerYear:6,status:`Active`,note:`Cần bổ sung giấy xác nhận khi nghỉ dài ngày.`,hasUsageHistory:!0},{id:`personal`,code:`PERSONAL`,name:`Nghỉ việc riêng`,isPaid:!1,defaultDaysPerYear:0,status:`Active`,note:`Tùy trường hợp Manager/HR xem xét.`,hasUsageHistory:!0},{id:`unpaid`,code:`UNPAID`,name:`Nghỉ không lương`,isPaid:!1,defaultDaysPerYear:0,status:`Active`,note:`Không tính vào phép có lương.`,hasUsageHistory:!0},{id:`wfh-legacy`,code:`WFH-OLD`,name:`Làm việc từ xa cũ`,isPaid:!0,defaultDaysPerYear:0,status:`Inactive`,note:`Loại cũ, chỉ giữ để tra cứu lịch sử.`,hasUsageHistory:!1}],f=[{id:`payroll-2026-05`,month:5,year:2026,status:`Ready`,generatedAt:`2026-05-04T09:00:00.000Z`,rowCount:8},{id:`payroll-2026-04`,month:4,year:2026,status:`Ready`,generatedAt:`2026-04-30T09:00:00.000Z`,rowCount:8}];export{d as a,e as c,l as i,s as n,f as o,o as r,u as s,c as t};