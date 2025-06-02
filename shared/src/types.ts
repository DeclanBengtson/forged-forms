export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Form {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  createdAt: Date;
}

export interface EmailNotification {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface CreateFormInput {
  name: string;
  userId: string;
}

export interface CreateSubmissionInput {
  formId: string;
  data: Record<string, any>;
} 