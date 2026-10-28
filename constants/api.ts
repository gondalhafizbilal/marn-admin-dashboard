/** API path constants — never hardcode endpoint strings in repositories. */

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/user/register",
    LOGIN: "/auth/user/login/email-address",
    LOGOUT: "/auth/user/logout",
    REQUEST_PASSWORD_RESET: "/auth/user/password/email-address/request",
    RESET_PASSWORD: "/auth/user/password/reset",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  AGENCIES: {
    ROOT: "/agencies",
    BY_ID: (id: string) => `/agencies/${id}`,
    EMAIL: (id: string) => `/agencies/${id}/email-address`,
    PHONE: (id: string) => `/agencies/${id}/phone-number`,
    PASSWORD: (id: string) => `/agencies/${id}/password`,
    STATUS: (id: string) => `/agencies/${id}/status`,
    DOCUMENTS: (id: string) => `/agencies/${id}/documents`,
    VERIFY_DOCUMENT: "/agencies/documents/verify",
    REACTIVATE: "/agencies/reactivate",
    HARD_DELETE: (id: string) => `/agencies/${id}/hard`,
  },
  CATEGORIES: {
    ROOT: "/advertisement-categories",
    BY_ID: (id: string) => `/advertisement-categories/${id}`,
    REORDER: "/advertisement-categories/reorder",
  },
  USERS: {
    ROOT: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },
  CLIENTS: {
    ROOT: "/clients",
    BY_ID: (id: string) => `/clients/${id}`,
  },
  AGENCY_CATEGORIES: {
    TREE: "/agency-categories/tree",
    ROOT: "/agency-categories",
    BY_ID: (id: string) => `/agency-categories/${id}`,
    REORDER: "/agency-categories/reorder",
  },
  SKILLS: {
    ROOT: "/skills",
    WORKFORCE_CATEGORIES: "/skills/workforce-categories",
    BY_ID: (id: string) => `/skills/${id}`,
  },
  WORKERS: {
    ROOT: "/agencies/workers",
    STATUS: (id: string) => `/agencies/workers/${id}/status`,
  },
  SERVICES: {
    ROOT: "/services",
    STATUS: (id: string) => `/services/${id}/status`,
  },
  CUSTOMERS: {
    ROOT: "/customers",
    BY_ID: (id: string) => `/customers/${id}`,
    EMAIL: (id: string) => `/customers/${id}/email-address`,
    PASSWORD: (id: string) => `/customers/${id}/password`,
    REACTIVATE: "/customers/reactivate",
  },
  SUBSCRIPTIONS: {
    PLANS: "/subscriptions/plans",
    PLAN_BY_ID: (id: string) => `/subscriptions/plans/${id}`,
  },
  TIERS: {
    ROOT: "/tiers",
    BY_ID: (id: string) => `/tiers/${id}`,
    PROMO: (id: string) => `/tiers/${id}/promo`,
  },
  COUNTRIES: {
    ROOT: "/countries",
    BY_ID: (id: string) => `/countries/${id}`,
  },
  CITIES: {
    ROOT: "/cities",
    BY_ID: (id: string) => `/cities/${id}`,
  },
  PAYMENTS: {
    ROOT: "/payments",
  },
  PUSH_NOTIFICATIONS: {
    ROOT: "/push-notifications",
    BY_ID: (id: string) => `/push-notifications/${id}`,
    SEND: "/push-notifications/push",
    STOP: (id: string) => `/push-notifications/stop/${id}`,
    IMAGE: (id: string) => `/push-notifications/${id}/images`,
  },
  REVIEWS: {
    FOR_AGENCY: (agencyId: string) => `/agency/${agencyId}/reviews`,
    BY_ID: (agencyId: string, reviewId: string) => `/agency/${agencyId}/reviews/${reviewId}`,
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const;

export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: "marn_access_token",
  REFRESH_TOKEN: "marn_refresh_token",
} as const;
