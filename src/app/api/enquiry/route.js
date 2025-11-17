import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      restaurant_name,
      contact_person,
      email,
      phone,
      items,
    } = body;

    if (!restaurant_name || !contact_person || !email || !phone || !items || items.length === 0) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const to = 'vuppalavathsal@gmail.com';

    const lines = [];
    lines.push(`Restaurant/Business: ${restaurant_name}`);
    lines.push(`Contact Person: ${contact_person}`);
    lines.push(`Email: ${email}`);
    lines.push(`Phone: ${phone}`);
    lines.push('');
    lines.push('Items:');
    for (const item of items) {
      lines.push(`- ${item.product_name} | Qty: ${item.quantity}${item.sku ? ` | SKU: ${item.sku}` : ''}`);
    }
    const text = lines.join('\n');

    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.SMTP_PASSWORD)) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Boolean(process.env.SMTP_SECURE === 'true'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
        },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: `Paxo Enquiry <${process.env.SMTP_FROM || 'no-reply@paxosupply.com'}>`,
      to,
      subject: 'New Order Enquiry',
      text,
    });

    const previewUrl = nodemailer.getTestMessageUrl?.(info) || null;
    return Response.json({ success: true, previewUrl });
  } catch (error) {
    console.error('Error sending enquiry email:', error);
    return Response.json({ error: 'Failed to send enquiry' }, { status: 500 });
  }
}
