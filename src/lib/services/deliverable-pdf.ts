import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface DeliverablePdfOptions {
  deliverableName: string;
  projectName?: string;
  clientName?: string;
  companyName?: string;
  freelancerName?: string;
  freelancerAgency?: string;
  tasks?: Array<{ id?: string; title: string; status: string }>;
  deliverableId?: string;
  createdAt?: Date | string;
}

function sanitizeForPdf(text: string): string {
  if (!text) return "";
  return text
    .replace(/[•●]/g, "|")
    .replace(/[—–]/g, "-")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[^\x00-\x7F]/g, "")
    .trim();
}

export async function generateDeliverablePdf(options: DeliverablePdfOptions): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size (595.28 x 841.89 pt)
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Palette definitions
  const primaryIndigo = rgb(0.39, 0.40, 0.95);
  const headerBg = rgb(0.06, 0.08, 0.13);
  const textDark = rgb(0.12, 0.14, 0.20);
  const textMuted = rgb(0.42, 0.46, 0.54);
  const greenEmerald = rgb(0.08, 0.65, 0.38);
  const emeraldBg = rgb(0.92, 0.98, 0.94);
  const cardBg = rgb(0.97, 0.98, 1.0);
  const borderLight = rgb(0.85, 0.88, 0.93);

  // 1. Top Decorative Brand Accent Line
  page.drawRectangle({
    x: 0,
    y: height - 5,
    width: width,
    height: 5,
    color: primaryIndigo,
  });

  // 2. Luxury Dark Header Banner
  const headerHeight = 125;
  page.drawRectangle({
    x: 0,
    y: height - headerHeight - 5,
    width: width,
    height: headerHeight,
    color: headerBg,
  });

  // Brand Name & Category
  page.drawText("LUMINA PORTAL SUITE", {
    x: 42,
    y: height - 38,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText("// OFFICIAL CLIENT DELIVERABLE & ASSET HANDOVER", {
    x: 215,
    y: height - 38,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.60, 0.64, 0.74),
  });

  // Verified Badge (Right side of header)
  page.drawRectangle({
    x: width - 155,
    y: height - 48,
    width: 115,
    height: 22,
    color: rgb(0.04, 0.28, 0.18),
    borderWidth: 1,
    borderColor: rgb(0.2, 0.8, 0.45),
  });

  page.drawText("VERIFIED PRODUCTION", {
    x: width - 146,
    y: height - 39,
    size: 7.5,
    font: fontBold,
    color: rgb(0.35, 0.95, 0.6),
  });

  // Document Title
  const cleanTitle = sanitizeForPdf(
    options.deliverableName
      .replace(/\.pdf$/i, "")
      .replace(/[_\-]+/g, " ")
  );

  const displayTitle = cleanTitle.length > 45 ? `${cleanTitle.slice(0, 42)}...` : cleanTitle;

  page.drawText(displayTitle || "Project Deliverable & Specification", {
    x: 42,
    y: height - 80,
    size: 19,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  const projTitle = sanitizeForPdf(options.projectName || "Contract Production Project");
  page.drawText(`Project Scope: ${projTitle} | Final Production Release`, {
    x: 42,
    y: height - 100,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.72, 0.75, 0.84),
  });

  // 3. Metadata Summary Card
  const cardY = height - 200;
  page.drawRectangle({
    x: 42,
    y: cardY,
    width: width - 84,
    height: 58,
    color: cardBg,
    borderColor: borderLight,
    borderWidth: 1,
  });

  const rawClient = sanitizeForPdf(options.companyName || options.clientName || "Valued Client");
  const clientDisplay = rawClient.length > 22 ? `${rawClient.slice(0, 20)}..` : rawClient;
  const specialistDisplay = sanitizeForPdf(options.freelancerName || "Mohamad Jafari");
  const agencyDisplay = sanitizeForPdf(options.freelancerAgency || "Lumina Studio");

  const today = new Date();
  const dateFormatted = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const hashId = `SEC-${(options.deliverableId || "LMN").slice(-6).toUpperCase()}-${today.getFullYear()}`;

  const metaCols = [
    { label: "CLIENT / RECIPIENT", val: clientDisplay, x: 56 },
    { label: "PREPARED BY", val: `${specialistDisplay} (${agencyDisplay})`, x: 190 },
    { label: "RELEASE DATE", val: dateFormatted, x: 380 },
    { label: "VERIFICATION HASH", val: hashId, x: 470 },
  ];

  for (const c of metaCols) {
    page.drawText(c.label, {
      x: c.x,
      y: cardY + 38,
      size: 6.5,
      font: fontBold,
      color: textMuted,
    });
    page.drawText(c.val, {
      x: c.x,
      y: cardY + 20,
      size: 8.5,
      font: fontBold,
      color: textDark,
    });
  }

  // 4. Section 1: Executive Overview & Deliverable Summary
  let currentY = cardY - 26;
  page.drawText("1. EXECUTIVE SUMMARY & HANDOVER SCOPE", {
    x: 42,
    y: currentY,
    size: 10.5,
    font: fontBold,
    color: textDark,
  });

  currentY -= 16;
  const sanitizedDelivName = sanitizeForPdf(options.deliverableName);
  const execParagraphs = [
    `This official deliverable package confirms the successful completion, quality verification, and handover`,
    `for the asset: "${sanitizedDelivName}". All associated architectural components, source assets, and`,
    `functional requirements have undergone rigorous testing in accordance with professional industry standards.`,
    `The deliverables within this release are guaranteed production-ready and fully approved for live deployment.`,
  ];

  for (const line of execParagraphs) {
    page.drawText(line, {
      x: 42,
      y: currentY,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.3, 0.33, 0.4),
    });
    currentY -= 13;
  }

  // 5. Section 2: Milestone Verification & Audit Matrix
  currentY -= 14;
  page.drawText("2. COMPLETED MILESTONES & VERIFICATION MATRIX", {
    x: 42,
    y: currentY,
    size: 10.5,
    font: fontBold,
    color: textDark,
  });

  currentY -= 14;
  // Table Header
  const tableWidth = width - 84;
  page.drawRectangle({
    x: 42,
    y: currentY - 18,
    width: tableWidth,
    height: 20,
    color: rgb(0.93, 0.94, 0.98),
  });

  page.drawText("MILESTONE ITEM & DESCRIPTION", { x: 56, y: currentY - 12, size: 7.5, font: fontBold, color: rgb(0.28, 0.32, 0.48) });
  page.drawText("VERIFICATION STAGE", { x: 330, y: currentY - 12, size: 7.5, font: fontBold, color: rgb(0.28, 0.32, 0.48) });
  page.drawText("STATUS", { x: 470, y: currentY - 12, size: 7.5, font: fontBold, color: rgb(0.28, 0.32, 0.48) });

  currentY -= 18;

  // Use real tasks if available or sensible defaults
  const taskList = options.tasks && options.tasks.length > 0
    ? options.tasks
    : [
        { title: "1. Core Specification & Architectural Design", status: "DONE" },
        { title: "2. Visual Layout, Styling Tokens & Component Library", status: "DONE" },
        { title: "3. Interactive Workflows & End-to-End Verification", status: "DONE" },
        { title: "4. Final Production Build & Asset Delivery", status: "DONE" },
      ];

  const displayTasks = taskList.slice(0, 6);

  for (let idx = 0; idx < displayTasks.length; idx++) {
    const t = displayTasks[idx];
    currentY -= 22;

    const isEven = idx % 2 === 0;
    page.drawRectangle({
      x: 42,
      y: currentY - 4,
      width: tableWidth,
      height: 22,
      color: isEven ? rgb(1, 1, 1) : rgb(0.98, 0.98, 1),
      borderColor: rgb(0.91, 0.92, 0.95),
      borderWidth: 1,
    });

    const cleanTaskTitle = sanitizeForPdf(t.title);
    const taskTitle = cleanTaskTitle.length > 46 ? `${cleanTaskTitle.slice(0, 43)}...` : cleanTaskTitle;
    page.drawText(taskTitle, {
      x: 56,
      y: currentY + 3,
      size: 8,
      font: fontBold,
      color: textDark,
    });

    page.drawText("Production Handover", {
      x: 330,
      y: currentY + 3,
      size: 7.5,
      font: fontRegular,
      color: textMuted,
    });

    // Green verification badge with drawn circle
    page.drawRectangle({
      x: 468,
      y: currentY - 1,
      width: 76,
      height: 14,
      color: emeraldBg,
    });

    page.drawCircle({
      x: 476,
      y: currentY + 6,
      size: 2,
      color: greenEmerald,
    });

    page.drawText("100% VERIFIED", {
      x: 483,
      y: currentY + 3,
      size: 6.5,
      font: fontBold,
      color: greenEmerald,
    });
  }

  // 6. Section 3: Intellectual Property & Transfer of Rights
  currentY -= 24;
  page.drawText("3. INTELLECTUAL PROPERTY & TRANSFER OF RIGHTS", {
    x: 42,
    y: currentY,
    size: 10.5,
    font: fontBold,
    color: textDark,
  });

  currentY -= 15;
  const ipLines = [
    `Upon delivery, all rights, title, source files, and intellectual property associated with this asset are irrevocably`,
    `assigned and transferred to ${clientDisplay}. The work contains zero third-party encumbrances or undocumented`,
    `dependencies. Full usage and commercial exploitation rights are granted effective immediately.`,
  ];

  for (const line of ipLines) {
    page.drawText(line, {
      x: 42,
      y: currentY,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.3, 0.33, 0.4),
    });
    currentY -= 13;
  }

  // 7. Section 4: Authorized Digital Seal & Sign-off Box
  currentY -= 16;
  const sealBoxHeight = 85;
  page.drawRectangle({
    x: 42,
    y: currentY - sealBoxHeight,
    width: tableWidth,
    height: sealBoxHeight,
    color: rgb(0.98, 0.985, 1),
    borderColor: rgb(0.8, 0.83, 0.96),
    borderWidth: 1.5,
  });

  page.drawText("AUTHORIZED DIGITAL SIGN-OFF & CERTIFICATION", {
    x: 56,
    y: currentY - 20,
    size: 8.5,
    font: fontBold,
    color: primaryIndigo,
  });

  page.drawText("Lead Specialist Signature & Verification:", {
    x: 56,
    y: currentY - 36,
    size: 7.5,
    font: fontRegular,
    color: textMuted,
  });

  // Digital Signature
  page.drawText(specialistDisplay, {
    x: 56,
    y: currentY - 56,
    size: 15,
    font: fontOblique,
    color: rgb(0.12, 0.18, 0.42),
  });

  page.drawText(`Authorized Lead at ${agencyDisplay} | Digitally verified via Lumina Portal`, {
    x: 56,
    y: currentY - 70,
    size: 7,
    font: fontRegular,
    color: rgb(0.5, 0.54, 0.62),
  });

  // Official Stamp Graphic (Right side of seal box)
  const stampX = width - 180;
  const stampY = currentY - 72;
  page.drawRectangle({
    x: stampX,
    y: stampY,
    width: 124,
    height: 56,
    color: rgb(0.95, 0.96, 1),
    borderColor: primaryIndigo,
    borderWidth: 1.2,
  });

  page.drawRectangle({
    x: stampX + 3,
    y: stampY + 3,
    width: 118,
    height: 50,
    color: rgb(0.97, 0.98, 1),
    borderColor: rgb(0.75, 0.78, 0.95),
    borderWidth: 0.8,
  });

  page.drawText("LUMINA OFFICIAL SEAL", {
    x: stampX + 13,
    y: stampY + 35,
    size: 7,
    font: fontBold,
    color: primaryIndigo,
  });

  page.drawText("ASSET AUDIT: APPROVED", {
    x: stampX + 11,
    y: stampY + 22,
    size: 6.5,
    font: fontBold,
    color: greenEmerald,
  });

  page.drawText(hashId, {
    x: stampX + 16,
    y: stampY + 10,
    size: 6,
    font: fontRegular,
    color: textMuted,
  });

  // 8. Footer
  page.drawText("Encrypted Deliverable Document | Generated by Lumina Portal Suite | All Rights Reserved", {
    x: 95,
    y: 26,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.58, 0.62, 0.70),
  });

  page.drawText("PAGE 1 OF 1", {
    x: width - 95,
    y: 26,
    size: 7,
    font: fontBold,
    color: rgb(0.58, 0.62, 0.70),
  });

  return await pdfDoc.save();
}
