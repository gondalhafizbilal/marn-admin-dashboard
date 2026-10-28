import { API_ENDPOINTS } from "@/constants";

import { api } from "../api";

export type AdminList<T> = { data: T[]; total?: number };
export type AdminRecord = { uuid?: string; id?: string; status?: string; [key: string]: unknown };
export type AgencyDocument = {
  uuid: string;
  file_name?: string;
  file_url?: string;
  doc_type?: string;
  verified?: boolean;
};

class AdminRepositoryClass {
  agencies(params?: Record<string, unknown>) {
    return api.get<AdminRecord[]>(API_ENDPOINTS.AGENCIES.ROOT, { params });
  }
  agency(id: string) {
    return api.get<AdminRecord>(API_ENDPOINTS.AGENCIES.BY_ID(id));
  }
  updateAgencyStatus(id: string, status: string) {
    return api.put<AdminRecord>(API_ENDPOINTS.AGENCIES.STATUS(id), { status });
  }
  createAgency(payload: Record<string, unknown>) {
    return api.post<AdminRecord>(API_ENDPOINTS.AGENCIES.ROOT, payload);
  }
  updateAgency(id: string, payload: Record<string, unknown>) {
    return api.put<AdminRecord>(API_ENDPOINTS.AGENCIES.BY_ID(id), payload);
  }
  updateAgencyEmail(id: string, emailAddress: string) {
    return api.put<AdminRecord>(API_ENDPOINTS.AGENCIES.EMAIL(id), { emailAddress });
  }
  updateAgencyPhone(id: string, countryCode: string, phoneNumber: string) {
    return api.put<AdminRecord>(API_ENDPOINTS.AGENCIES.PHONE(id), { countryCode, phoneNumber });
  }
  updateAgencyPassword(id: string, password: string) {
    return api.put<AdminRecord>(API_ENDPOINTS.AGENCIES.PASSWORD(id), { password });
  }
  agencyDocuments(id: string) {
    return api.get<AgencyDocument[]>(API_ENDPOINTS.AGENCIES.DOCUMENTS(id));
  }
  verifyAgencyDocument(documentUuid: string, verified: boolean) {
    return api.patch<AgencyDocument>(API_ENDPOINTS.AGENCIES.VERIFY_DOCUMENT, {
      documentUuid,
      verified,
    });
  }
  reactivateAgency(emailAddress: string) {
    return api.post<AdminRecord>(API_ENDPOINTS.AGENCIES.REACTIVATE, { emailAddress });
  }
  deleteAgency(id: string, hard = false) {
    return api.delete(
      hard ? API_ENDPOINTS.AGENCIES.HARD_DELETE(id) : API_ENDPOINTS.AGENCIES.BY_ID(id),
    );
  }

  agencyCategoryTree() {
    return api.get<AdminRecord[]>(API_ENDPOINTS.AGENCY_CATEGORIES.TREE);
  }
  createAgencyCategory(payload: Record<string, unknown>) {
    return api.post<AdminRecord>(API_ENDPOINTS.AGENCY_CATEGORIES.ROOT, payload);
  }
  updateAgencyCategory(id: string, payload: Record<string, unknown>) {
    return api.put<AdminRecord>(API_ENDPOINTS.AGENCY_CATEGORIES.BY_ID(id), payload);
  }
  reorderAgencyCategories(payload: Record<string, unknown>) {
    return api.post<AdminRecord[]>(API_ENDPOINTS.AGENCY_CATEGORIES.REORDER, payload);
  }
  deleteAgencyCategory(id: string) {
    return api.delete(API_ENDPOINTS.AGENCY_CATEGORIES.BY_ID(id));
  }

  skills() {
    return api.get<AdminRecord[]>(API_ENDPOINTS.SKILLS.ROOT);
  }
  workforceCategories() {
    return api.get<AdminRecord[]>(API_ENDPOINTS.SKILLS.WORKFORCE_CATEGORIES);
  }
  createSkill(payload: Record<string, unknown>) {
    return api.post<AdminRecord>(API_ENDPOINTS.SKILLS.ROOT, payload);
  }
  updateSkill(id: string, payload: Record<string, unknown>) {
    return api.put<AdminRecord>(API_ENDPOINTS.SKILLS.BY_ID(id), payload);
  }
  deleteSkill(id: string) {
    return api.delete(API_ENDPOINTS.SKILLS.BY_ID(id));
  }

  workers(params?: Record<string, unknown>) {
    return api.get<AdminList<AdminRecord>>(API_ENDPOINTS.WORKERS.ROOT, { params });
  }
  updateWorkerStatus(id: string, status: string, rejectionReason?: string) {
    return api.put<AdminRecord>(API_ENDPOINTS.WORKERS.STATUS(id), { status, rejectionReason });
  }
  services(params?: Record<string, unknown>) {
    return api.get<AdminList<AdminRecord>>(API_ENDPOINTS.SERVICES.ROOT, { params });
  }
  updateServiceStatus(id: string, status: string, rejectionReason?: string) {
    return api.put<AdminRecord>(API_ENDPOINTS.SERVICES.STATUS(id), { status, rejectionReason });
  }

  customers(params?: Record<string, unknown>) {
    return api.get<AdminRecord[]>(API_ENDPOINTS.CUSTOMERS.ROOT, { params });
  }
  customer(id: string) {
    return api.get<AdminRecord>(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
  }
  createCustomer(payload: Record<string, unknown>) {
    return api.post<AdminRecord>(API_ENDPOINTS.CUSTOMERS.ROOT, payload);
  }
  updateCustomer(id: string, payload: Record<string, unknown>) {
    return api.put<AdminRecord>(API_ENDPOINTS.CUSTOMERS.BY_ID(id), payload);
  }
  updateCustomerEmail(id: string, emailAddress: string) {
    return api.put<AdminRecord>(API_ENDPOINTS.CUSTOMERS.EMAIL(id), { emailAddress });
  }
  updateCustomerPassword(id: string, password: string) {
    return api.put<AdminRecord>(API_ENDPOINTS.CUSTOMERS.PASSWORD(id), { password });
  }
  reactivateCustomer(emailAddress: string) {
    return api.post<AdminRecord>(API_ENDPOINTS.CUSTOMERS.REACTIVATE, { emailAddress });
  }
  deleteCustomer(id: string) {
    return api.delete(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
  }

  subscriptionPlans() {
    return api.get<AdminRecord[]>(API_ENDPOINTS.SUBSCRIPTIONS.PLANS);
  }
  createSubscriptionPlan(payload: Record<string, unknown>) {
    return api.post<AdminRecord>(API_ENDPOINTS.SUBSCRIPTIONS.PLANS, payload);
  }
  updateSubscriptionPlan(id: string, payload: Record<string, unknown>) {
    return api.put<AdminRecord>(API_ENDPOINTS.SUBSCRIPTIONS.PLAN_BY_ID(id), payload);
  }
  deleteSubscriptionPlan(id: string) {
    return api.delete(API_ENDPOINTS.SUBSCRIPTIONS.PLAN_BY_ID(id));
  }

  tiers() {
    return api.get<AdminRecord[]>(API_ENDPOINTS.TIERS.ROOT);
  }
  createTier(payload: Record<string, unknown>) {
    return api.post<AdminRecord>(API_ENDPOINTS.TIERS.ROOT, payload);
  }
  updateTier(id: string, payload: Record<string, unknown>) {
    return api.put<AdminRecord>(API_ENDPOINTS.TIERS.BY_ID(id), payload);
  }
  setTierPromo(id: string, payload: Record<string, unknown>) {
    return api.post<AdminRecord>(API_ENDPOINTS.TIERS.PROMO(id), payload);
  }
  removeTierPromo(id: string) {
    return api.delete(API_ENDPOINTS.TIERS.PROMO(id));
  }

  countries(params?: Record<string, unknown>) {
    return api.get<AdminRecord[]>(API_ENDPOINTS.COUNTRIES.ROOT, { params });
  }
  createCountry(payload: Record<string, unknown>) {
    return api.post<AdminRecord>(API_ENDPOINTS.COUNTRIES.ROOT, payload);
  }
  updateCountry(id: string, payload: Record<string, unknown>) {
    return api.patch<AdminRecord>(API_ENDPOINTS.COUNTRIES.BY_ID(id), payload);
  }
  deleteCountry(id: string) {
    return api.delete(API_ENDPOINTS.COUNTRIES.BY_ID(id));
  }
  cities(params?: Record<string, unknown>) {
    return api.get<AdminList<AdminRecord>>(API_ENDPOINTS.CITIES.ROOT, { params });
  }
  createCity(payload: Record<string, unknown>) {
    return api.post<AdminRecord>(API_ENDPOINTS.CITIES.ROOT, payload);
  }
  updateCity(id: string, payload: Record<string, unknown>) {
    return api.patch<AdminRecord>(API_ENDPOINTS.CITIES.BY_ID(id), payload);
  }
  deleteCity(id: string) {
    return api.delete(API_ENDPOINTS.CITIES.BY_ID(id));
  }

  payments(params?: Record<string, unknown>) {
    return api.get<AdminRecord[]>(API_ENDPOINTS.PAYMENTS.ROOT, { params });
  }
  pushNotifications() {
    return api.get<AdminRecord[]>(API_ENDPOINTS.PUSH_NOTIFICATIONS.ROOT);
  }
  createPushNotification(payload: Record<string, unknown>) {
    return api.post<AdminRecord>(API_ENDPOINTS.PUSH_NOTIFICATIONS.ROOT, payload);
  }
  updatePushNotification(id: string, payload: Record<string, unknown>) {
    return api.put<AdminRecord>(API_ENDPOINTS.PUSH_NOTIFICATIONS.BY_ID(id), payload);
  }
  sendPushNotification(notificationUUID: string[], receiverType: string) {
    return api.post<void>(API_ENDPOINTS.PUSH_NOTIFICATIONS.SEND, {
      notificationUUID,
      receiverType,
    });
  }
  stopPushNotification(id: string) {
    return api.put<void>(API_ENDPOINTS.PUSH_NOTIFICATIONS.STOP(id));
  }
  deletePushNotification(id: string) {
    return api.delete(API_ENDPOINTS.PUSH_NOTIFICATIONS.BY_ID(id));
  }
  async uploadPushNotificationImage(id: string, file: File) {
    const body = new FormData();
    body.set("file", file);
    return api.post<AdminRecord, FormData>(API_ENDPOINTS.PUSH_NOTIFICATIONS.IMAGE(id), body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  reviews(agencyId: string, params?: Record<string, unknown>) {
    return api.get<AdminList<AdminRecord>>(API_ENDPOINTS.REVIEWS.FOR_AGENCY(agencyId), { params });
  }
  review(agencyId: string, reviewId: string) {
    return api.get<AdminRecord>(API_ENDPOINTS.REVIEWS.BY_ID(agencyId, reviewId));
  }
  updateReview(agencyId: string, reviewId: string, payload: Record<string, unknown>) {
    return api.put<AdminRecord>(API_ENDPOINTS.REVIEWS.BY_ID(agencyId, reviewId), payload);
  }
  deleteReview(agencyId: string, reviewId: string) {
    return api.delete(API_ENDPOINTS.REVIEWS.BY_ID(agencyId, reviewId));
  }
}

export const AdminRepository = new AdminRepositoryClass();
