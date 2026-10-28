export type AdminResourceField = {
  label: string;
  placeholder: string;
  type?: "text" | "email" | "number" | "select" | "textarea" | "date";
  options?: string[];
};

export type AdminResourceConfig = {
  key: AdminResourceKey;
  title: string;
  description: string;
  entityLabel: string;
  schemaTables: string[];
  columns: string[];
  rows: string[][];
  fields: AdminResourceField[];
  recordIds?: string[];
  viewBaseHref?: string;
  editBaseHref?: string;
  showAvatar?: boolean;
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
};

export type AdminResourceKey =
  | "users"
  | "agencies"
  | "ads"
  | "packages"
  | "bookings"
  | "messages"
  | "settings"
  | "categories"
  | "skills"
  | "payments"
  | "reviews"
  | "notifications";

export const adminResourceConfigs: Record<AdminResourceKey, AdminResourceConfig> = {
  users: {
    key: "users",
    title: "Users",
    description: "Manage platform users, account roles, and status based on the USERS table.",
    entityLabel: "User",
    schemaTables: ["USERS", "SOCIAL_LOGINS", "USER_LOCATIONS", "NOTIFICATIONS"],
    columns: ["User", "Contact", "Role", "Status"],
    rows: [
      ["Fatima Noor", "fatima@marn.qa", "Seeker", "Active"],
      ["Ibrahim Ali", "ibrahim@marn.qa", "Agency Owner", "Pending"],
      ["Noura Salem", "+974 5000 9912", "Seeker", "Suspended"],
    ],
    fields: [
      { label: "Full name", placeholder: "Enter user full name" },
      { label: "Email", placeholder: "Enter email address", type: "email" },
      {
        label: "Role",
        placeholder: "Select role",
        type: "select",
        options: ["Seeker", "Agency Owner", "Admin Support"],
      },
      {
        label: "Status",
        placeholder: "Select status",
        type: "select",
        options: ["Active", "Pending", "Suspended"],
      },
    ],
  },
  agencies: {
    key: "agencies",
    title: "Agencies",
    description: "Manage agencies, onboarding status, and ownership records from the AGENCIES domain.",
    entityLabel: "Agency",
    schemaTables: ["AGENCIES", "AGENCY_DOCUMENTS", "AGENCY_LOCATIONS", "AGENCY_MEDIA"],
    columns: ["Agency", "Owner", "City", "Status"],
    rows: [
      ["Smart Events", "Amina Hassan", "Doha", "Verified"],
      ["Al Aman Workforce", "Mohammed Tariq", "Al Rayyan", "Review"],
      ["Pearl Helpers", "Sara Khan", "Doha", "Inactive"],
    ],
    fields: [
      { label: "Agency name", placeholder: "Enter agency name" },
      { label: "Owner name", placeholder: "Enter owner name" },
      { label: "City", placeholder: "Enter operating city" },
      {
        label: "Verification status",
        placeholder: "Select verification status",
        type: "select",
        options: ["Verified", "Review", "Inactive"],
      },
    ],
  },
  ads: {
    key: "ads",
    title: "Ads",
    description: "Review classified ads linked with categories, agencies, and posting users.",
    entityLabel: "Ad",
    schemaTables: ["ADS", "CATEGORIES", "USERS", "AGENCIES"],
    columns: ["Ad title", "Category", "Owner", "Status"],
    rows: [
      ["Housemaid Full Time", "Domestic Help", "Ahmed Al-Marri", "Active"],
      ["Driver on Demand", "Transportation", "Smart Events", "Draft"],
      ["Chef for Events", "Catering", "Al Aman Workforce", "Paused"],
    ],
    fields: [
      { label: "Ad title", placeholder: "Enter ad title" },
      { label: "Category", placeholder: "Select category", type: "select", options: ["Domestic Help", "Transportation", "Catering"] },
      { label: "Owner", placeholder: "Enter user or agency name" },
      {
        label: "Status",
        placeholder: "Select ad status",
        type: "select",
        options: ["Active", "Draft", "Paused"],
      },
    ],
  },
  packages: {
    key: "packages",
    title: "Packages",
    description: "Configure package plans sold to agencies and tied to purchases and subscriptions.",
    entityLabel: "Package",
    schemaTables: ["PACKAGES", "PACKAGE_PURCHASES", "SUBSCRIPTIONS"],
    columns: ["Package", "Duration", "Price", "Status"],
    rows: [
      ["Starter Plan", "30 Days", "QAR 299", "Active"],
      ["Growth Plan", "90 Days", "QAR 799", "Active"],
      ["Enterprise Plan", "365 Days", "QAR 2499", "Draft"],
    ],
    fields: [
      { label: "Package name", placeholder: "Enter package name" },
      { label: "Duration", placeholder: "Enter duration, e.g. 30 Days" },
      { label: "Price", placeholder: "Enter package price", type: "number" },
      {
        label: "Status",
        placeholder: "Select package status",
        type: "select",
        options: ["Active", "Draft", "Archived"],
      },
    ],
  },
  bookings: {
    key: "bookings",
    title: "Bookings",
    description: "Track manual and system bookings connecting users, workers, and payments.",
    entityLabel: "Booking",
    schemaTables: ["BOOKINGS", "WORKER_PROFILES", "PAYMENTS", "USERS"],
    columns: ["Booking ID", "Customer", "Worker", "Status"],
    rows: [
      ["BK-2026-1001", "Fatima Noor", "Rina Jacob", "Confirmed"],
      ["BK-2026-1002", "Ali Saeed", "Joseph Mark", "Pending"],
      ["BK-2026-1003", "Maha Tariq", "Grace Ann", "Completed"],
    ],
    showAvatar: false,
    fields: [
      { label: "Booking reference", placeholder: "Enter booking reference" },
      { label: "Customer name", placeholder: "Enter customer name" },
      { label: "Worker name", placeholder: "Enter worker profile name" },
      {
        label: "Status",
        placeholder: "Select booking status",
        type: "select",
        options: ["Pending", "Confirmed", "Completed"],
      },
    ],
  },
  messages: {
    key: "messages",
    title: "Messages",
    description: "Monitor chat threads and create support or broadcast conversations.",
    entityLabel: "Thread",
    schemaTables: ["CHAT_THREADS", "CHAT_MESSAGES", "USERS", "AGENCIES"],
    columns: ["Thread", "Participant", "Last Message", "State"],
    rows: [
      ["TH-1001", "Smart Events", "Profile approved request", "Open"],
      ["TH-1002", "Fatima Noor", "Need booking support", "Waiting"],
      ["TH-1003", "Al Aman Workforce", "Package upgrade request", "Closed"],
    ],
    showAvatar: false,
    fields: [
      { label: "Thread title", placeholder: "Enter thread title" },
      { label: "Recipient", placeholder: "Enter user or agency name" },
      {
        label: "Message type",
        placeholder: "Select message type",
        type: "select",
        options: ["Support", "Broadcast", "Follow-up"],
      },
      { label: "Initial message", placeholder: "Write the first message", type: "textarea" },
    ],
  },
  settings: {
    key: "settings",
    title: "Settings",
    description: "Maintain operational settings and platform-level key value pairs used by admin.",
    entityLabel: "Setting",
    schemaTables: ["KEY_VALUE_PAIRS", "SITE_SETTINGS", "LANGUAGES"],
    columns: ["Key", "Group", "Value", "Updated"],
    rows: [
      ["default_currency", "General", "QAR", "2026-07-18"],
      ["support_email", "Support", "help@marn.qa", "2026-07-20"],
      ["booking_hold_hours", "Bookings", "24", "2026-07-21"],
    ],
    showAvatar: false,
    fields: [
      { label: "Setting key", placeholder: "Enter unique key" },
      { label: "Group", placeholder: "Enter setting group" },
      { label: "Value", placeholder: "Enter setting value" },
      { label: "Notes", placeholder: "Add optional admin notes", type: "textarea" },
    ],
  },
  categories: {
    key: "categories",
    title: "Categories",
    description: "Create category trees used by worker profiles and ads.",
    entityLabel: "Category",
    schemaTables: ["CATEGORIES"],
    columns: ["Category", "Parent", "Usage", "Status"],
    rows: [
      ["Domestic Help", "Root", "Ads + Workers", "Active"],
      ["Transportation", "Root", "Ads + Workers", "Active"],
      ["Event Staffing", "Agencies", "Workers", "Draft"],
    ],
    fields: [
      { label: "Category name", placeholder: "Enter category name" },
      { label: "Parent category", placeholder: "Select parent", type: "select", options: ["Root", "Agencies", "Domestic Help"] },
      {
        label: "Usage",
        placeholder: "Select usage",
        type: "select",
        options: ["Ads + Workers", "Workers", "Ads"],
      },
      { label: "Description", placeholder: "Write category description", type: "textarea" },
    ],
  },
  skills: {
    key: "skills",
    title: "Skills",
    description: "Maintain skill tags and map them back to categories and worker profiles.",
    entityLabel: "Skill",
    schemaTables: ["SKILLS", "WORKER_SKILLS", "CATEGORIES"],
    columns: ["Skill", "Category", "Workers", "Status"],
    rows: [
      ["Child Care", "Domestic Help", "142", "Active"],
      ["Event Setup", "Event Staffing", "84", "Active"],
      ["Defensive Driving", "Transportation", "35", "Review"],
    ],
    showAvatar: false,
    fields: [
      { label: "Skill name", placeholder: "Enter skill name" },
      { label: "Category", placeholder: "Select category", type: "select", options: ["Domestic Help", "Event Staffing", "Transportation"] },
      {
        label: "Status",
        placeholder: "Select status",
        type: "select",
        options: ["Active", "Review", "Archived"],
      },
      { label: "Notes", placeholder: "Add skill notes", type: "textarea" },
    ],
  },
  payments: {
    key: "payments",
    title: "Payments",
    description: "Track booking and package payment records and allow manual admin entries.",
    entityLabel: "Payment",
    schemaTables: ["PAYMENTS", "BOOKINGS", "PACKAGE_PURCHASES"],
    columns: ["Reference", "Payer", "Amount", "Status"],
    rows: [
      ["PAY-9001", "Fatima Noor", "QAR 1,250", "Captured"],
      ["PAY-9002", "Smart Events", "QAR 799", "Pending"],
      ["PAY-9003", "Al Aman Workforce", "QAR 2,499", "Refunded"],
    ],
    showAvatar: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
    fields: [
      { label: "Payment reference", placeholder: "Enter payment reference" },
      { label: "Payer", placeholder: "Enter payer name" },
      { label: "Amount", placeholder: "Enter amount", type: "number" },
      {
        label: "Status",
        placeholder: "Select payment status",
        type: "select",
        options: ["Pending", "Captured", "Refunded"],
      },
    ],
  },
  reviews: {
    key: "reviews",
    title: "Reviews",
    description: "Moderate review records submitted for agencies and completed services.",
    entityLabel: "Review",
    schemaTables: ["REVIEWS", "USERS", "AGENCIES", "BOOKINGS"],
    columns: ["Reviewer", "Target", "Rating", "Status"],
    rows: [
      ["Fatima Noor", "Smart Events", "4.8", "Published"],
      ["Ali Saeed", "Pearl Helpers", "2.0", "Flagged"],
      ["Maha Tariq", "Rina Jacob", "5.0", "Published"],
    ],
    showAvatar: false,
    canAdd: false,
    canEdit: false,
    fields: [
      { label: "Reviewer", placeholder: "Enter reviewer name" },
      { label: "Target", placeholder: "Enter agency or worker name" },
      { label: "Rating", placeholder: "Enter rating", type: "number" },
      { label: "Moderation note", placeholder: "Write moderation note", type: "textarea" },
    ],
  },
  notifications: {
    key: "notifications",
    title: "Notifications",
    description: "Create and monitor system notifications sent to users across the platform.",
    entityLabel: "Notification",
    schemaTables: ["NOTIFICATIONS", "USERS"],
    columns: ["Title", "Recipient", "Type", "Status"],
    rows: [
      ["Ad approved", "Ahmed Al-Marri", "System", "Delivered"],
      ["Profile incomplete", "Fatima Noor", "Reminder", "Queued"],
      ["Package expired", "Smart Events", "Billing", "Delivered"],
    ],
    canAdd: false,
    canEdit: false,
    canDelete: false,
    fields: [
      { label: "Title", placeholder: "Enter notification title" },
      { label: "Recipient", placeholder: "Enter user or agency name" },
      {
        label: "Type",
        placeholder: "Select type",
        type: "select",
        options: ["System", "Reminder", "Billing"],
      },
      { label: "Body", placeholder: "Write notification content", type: "textarea" },
    ],
  },
};

export function getAdminResourceConfig(key: AdminResourceKey) {
  return adminResourceConfigs[key];
}
