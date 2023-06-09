import { Pagination, PaginationParams } from "../types/common";
import { Field, Form, Submission } from "../types/formTypes";
import { User } from "../types/userTypes";

const BASE_URL = "https://tsapi.coronasafe.live/api/";

type RequestMethods = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type Payload =
  | PaginationParams
  | User
  | Form
  | Field
  | { options: Field["options"] }
  | { title: string }
  | Submission
  | { label: Field["label"] }
  | {};
export const request = async (
  endpoint: string,
  method: RequestMethods = "GET",
  payload: Payload = {}
) => {
  let url;

  if (method === "GET") {
    const requestParams = payload
      ? `${Object.keys(payload)
          .map((key) => `${key}=${payload[key as keyof Payload]}`)
          .join("&")}`
      : "";

    url = `${BASE_URL}${endpoint}?${requestParams}`;
  } else {
    url = `${BASE_URL}${endpoint}`;
  }

  const token = localStorage.getItem("token");
  const auth = token ? `Token ${token}` : "";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: method !== "GET" ? JSON.stringify(payload) : undefined,
  });

  if (response.ok) {
    return await response.json();
  }

  throw new Error(response.statusText);
};

export const me = async () => {
  return await request("users/me/", "GET");
};

export const login = async (username: string, password: string) => {
  const user: User = { username, password };
  return await request("auth-token/", "POST", user);
};

export const createForm = async (form: Form) => {
  return await request("forms/", "POST", form);
};

export const listForms = async (pageParams: PaginationParams) => {
  const forms: Pagination<Form> = await request("forms/", "GET", pageParams);
  return forms;
};

export const loadForm = async (id: number) => {
  const form: Form = await request(`forms/${id}/`, "GET");
  return form;
};

export const updateTitle = async (id: number, title: string) => {
  return await request(`forms/${id}/`, "PATCH", { title });
};

export const updateDescription = async (id: number, description: string) => {
  return await request(`forms/${id}/`, "PATCH", { description });
};

export const loadFormFields = async (form_pk: number) => {
  return await request(`forms/${form_pk}/fields/`, "GET");
};

export const createNewField = async (form_pk: number, field: Field) => {
  return await request(`forms/${form_pk}/fields/`, "POST", field);
};

export const deleteField = async (form_pk: number, id: number) => {
  return await request(`forms/${form_pk}/fields/${id}/`, "DELETE");
};

export const updateLabel = async (
  form_pk: number,
  id: number,
  label: Field["label"]
) => {
  return await request(`forms/${form_pk}/fields/${id}/`, "PATCH", { label });
};

export const updateOptions = async (
  form_pk: number,
  id: number,
  options: Field["options"]
) => {
  return await request(`forms/${form_pk}/fields/${id}/`, "PATCH", { options });
};

export const submitSubmission = async (
  form_pk: number,
  submission: Submission
) => {
  return await request(`forms/${form_pk}/submission/`, "POST", submission);
};
