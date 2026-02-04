import nodemailer from 'nodemailer';
import { formatDateISTAndET } from '@/lib/date-timezones';

const ROLES_FOR_LOGIN_EMAIL = ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'DIGITAL_MARKETER'] as const;

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  DEVELOPER: 'Developer',
  DIGITAL_MARKETER: 'Digital Marketer',
};

export function shouldSendLoginSuccessEmail(role: string): boolean {
  return ROLES_FOR_LOGIN_EMAIL.includes(role as (typeof ROLES_FOR_LOGIN_EMAIL)[number]);
}

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send "Login successful" email to the user. Used for Admin, Super Admin, Developer, Digital Marketer.
 * Does nothing if EMAIL_USER/EMAIL_PASS are not set.
 */
export async function sendLoginSuccessEmail(
  to: string,
  name: string | null,
  role: string
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const displayName = name?.trim() || to;
  const now = new Date();
  const { ist: timeIST, et: timeET } = formatDateISTAndET(now);

  await transporter.sendMail({
    from: `"Doddapaneni Group" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'You have successfully logged in – Doddapaneni Group',
    text: `Hello ${displayName},\n\nYou have successfully logged in to the Doddapaneni Group dashboard (${role}).\n\nDate & time (IST): ${timeIST}\nDate & time (ET): ${timeET}\n\nIf you did not perform this login, please contact your administrator.\n\nBest regards,\nDoddapaneni Group`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #1e3a8a; border-bottom: 2px solid #eee; padding-bottom: 10px;">Login successful</h2>
        <p>Hello <strong>${displayName}</strong>,</p>
        <p>You have successfully logged in to the Doddapaneni Group dashboard.</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Date & time (IST):</strong> ${timeIST}<br/><strong>Date & time (ET):</strong> ${timeET}</p>
        <p>If you did not perform this login, please contact your administrator.</p>
        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0 0; font-weight: bold; color: #1e3a8a;">Doddapaneni Group</p>
        </div>
      </div>
    `,
  });
}

/**
 * Send email to the creator (e.g. Super Admin or Admin) when they create a new role.
 * Content: "[Role] was created by [creator role] at [date and time IST/ET]."
 */
export async function sendRoleCreatedEmailToCreator(
  creatorEmail: string,
  creatorRole: string,
  createdRole: string,
  createdAt: Date
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const creatorRoleLabel = ROLE_LABEL[creatorRole] ?? creatorRole;
  const createdRoleLabel = ROLE_LABEL[createdRole] ?? createdRole;
  const { ist, et } = formatDateISTAndET(createdAt);

  const text = `${createdRoleLabel} role was created by ${creatorRoleLabel} at ${ist} and ${et}.`;
  await transporter.sendMail({
    from: `"Doddapaneni Group" <${process.env.EMAIL_USER}>`,
    to: creatorEmail,
    subject: `Role created: ${createdRoleLabel} – Doddapaneni Group`,
    text: `Hello,\n\n${text}\n\nBest regards,\nDoddapaneni Group`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #1e3a8a; border-bottom: 2px solid #eee; padding-bottom: 10px;">Role created</h2>
        <p>${text}</p>
        <p><strong>Date & time (IST):</strong> ${ist}<br/><strong>Date & time (ET):</strong> ${et}</p>
        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0 0; font-weight: bold; color: #1e3a8a;">Doddapaneni Group</p>
        </div>
      </div>
    `,
  });
}

/**
 * Send email to the new user when they are created. Includes the password set by the creator.
 */
export async function sendRoleCreatedEmailToNewUser(
  newUserEmail: string,
  newUserName: string | null,
  createdRole: string,
  creatorRole: string,
  creatorName: string | null,
  createdAt: Date,
  password: string
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const createdRoleLabel = ROLE_LABEL[createdRole] ?? createdRole;
  const creatorRoleLabel = ROLE_LABEL[creatorRole] ?? creatorRole;
  const creatorDisplay = creatorName?.trim() ? `${creatorRoleLabel} (${creatorName.trim()})` : creatorRoleLabel;
  const { ist, et } = formatDateISTAndET(createdAt);
  const displayName = newUserName?.trim() || newUserEmail;

  const text = `You have been created as ${createdRoleLabel} for Doddapaneni Group by ${creatorDisplay}, at ${ist} and ${et}.`;
  await transporter.sendMail({
    from: `"Doddapaneni Group" <${process.env.EMAIL_USER}>`,
    to: newUserEmail,
    subject: `You have been added as ${createdRoleLabel} – Doddapaneni Group`,
    text: `Hello ${displayName},\n\n${text}\n\nLogin details:\nEmail: ${newUserEmail}\nPassword: ${password}\n\nUse the above to log in to the Doddapaneni Group dashboard.\n\nBest regards,\nDoddapaneni Group`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #1e3a8a; border-bottom: 2px solid #eee; padding-bottom: 10px;">Welcome to Doddapaneni Group</h2>
        <p>Hello <strong>${displayName}</strong>,</p>
        <p>${text}</p>
        <p><strong>Date & time (IST):</strong> ${ist}<br/><strong>Date & time (ET):</strong> ${et}</p>
        <p><strong>Login details:</strong></p>
        <p style="background: #f1f5f9; padding: 12px; border-radius: 8px; font-family: monospace;">Email: ${newUserEmail}<br/>Password: ${password}</p>
        <p>Use the above to log in to the Doddapaneni Group dashboard.</p>
        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0 0; font-weight: bold; color: #1e3a8a;">Doddapaneni Group</p>
        </div>
      </div>
    `,
  });
}

/**
 * Send email to the deleter (Admin or Super Admin) when they delete a user.
 * Content: "[Role] was deleted by [deleter role] at [date and time IST/ET]. Deleted user: email (name)."
 */
export async function sendRoleDeletedEmailToDeleter(
  deleterEmail: string,
  deleterRole: string,
  deletedUserEmail: string,
  deletedUserName: string | null,
  deletedUserRole: string,
  deletedAt: Date
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const deleterRoleLabel = ROLE_LABEL[deleterRole] ?? deleterRole;
  const deletedRoleLabel = ROLE_LABEL[deletedUserRole] ?? deletedUserRole;
  const deletedUserDisplay = deletedUserName?.trim() ? `${deletedUserEmail} (${deletedUserName.trim()})` : deletedUserEmail;
  const { ist, et } = formatDateISTAndET(deletedAt);

  const text = `${deletedRoleLabel} role was deleted by ${deleterRoleLabel} at ${ist} and ${et}. Deleted user: ${deletedUserDisplay}.`;
  await transporter.sendMail({
    from: `"Doddapaneni Group" <${process.env.EMAIL_USER}>`,
    to: deleterEmail,
    subject: `Role deleted: ${deletedRoleLabel} – Doddapaneni Group`,
    text: `Hello,\n\n${text}\n\nBest regards,\nDoddapaneni Group`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #1e3a8a; border-bottom: 2px solid #eee; padding-bottom: 10px;">Role deleted</h2>
        <p>${text}</p>
        <p><strong>Date & time (IST):</strong> ${ist}<br/><strong>Date & time (ET):</strong> ${et}</p>
        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0 0; font-weight: bold; color: #1e3a8a;">Doddapaneni Group</p>
        </div>
      </div>
    `,
  });
}

/**
 * Send email to the deleted user notifying them their account was removed.
 * Content: "Your [role] account for Doddapaneni Group was deleted by [deleter role] (Deleter Name), at [date and time IST/ET]."
 */
export async function sendRoleDeletedEmailToDeletedUser(
  deletedUserEmail: string,
  deletedUserName: string | null,
  deletedUserRole: string,
  deleterRole: string,
  deleterName: string | null,
  deletedAt: Date
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const deletedRoleLabel = ROLE_LABEL[deletedUserRole] ?? deletedUserRole;
  const deleterRoleLabel = ROLE_LABEL[deleterRole] ?? deleterRole;
  const deleterDisplay = deleterName?.trim() ? `${deleterRoleLabel} (${deleterName.trim()})` : deleterRoleLabel;
  const { ist, et } = formatDateISTAndET(deletedAt);
  const displayName = deletedUserName?.trim() || deletedUserEmail;

  const text = `Your ${deletedRoleLabel} account for Doddapaneni Group was deleted by ${deleterDisplay}, at ${ist} and ${et}.`;
  await transporter.sendMail({
    from: `"Doddapaneni Group" <${process.env.EMAIL_USER}>`,
    to: deletedUserEmail,
    subject: `Your ${deletedRoleLabel} account has been removed – Doddapaneni Group`,
    text: `Hello ${displayName},\n\n${text}\n\nIf you have questions, please contact your administrator.\n\nBest regards,\nDoddapaneni Group`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #1e3a8a; border-bottom: 2px solid #eee; padding-bottom: 10px;">Account removed</h2>
        <p>Hello <strong>${displayName}</strong>,</p>
        <p>${text}</p>
        <p><strong>Date & time (IST):</strong> ${ist}<br/><strong>Date & time (ET):</strong> ${et}</p>
        <p>If you have questions, please contact your administrator.</p>
        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0 0; font-weight: bold; color: #1e3a8a;">Doddapaneni Group</p>
        </div>
      </div>
    `,
  });
}
