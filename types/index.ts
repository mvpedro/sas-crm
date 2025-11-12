// Common types used throughout the application

export type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
};

export type Person = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  avatar?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type Client = {
  id: string;
  userId: string;
  name: string;
  companyType?: string;
  industry?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  description?: string;
  status: "Active" | "Inactive" | "Prospect";
  annualRevenue?: number;
  employeeCount?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type Deal = {
  id: string;
  userId: string;
  title: string;
  value: number;
  currency: "BRL" | "USD";
  pipeline: string;
  stage: string;
  ownerId: string;
  expectedClosingDate?: string;
  description?: string;
  clientId: string;
  probability?: number;
  actualClosingDate?: string;
  status: "Open" | "Won" | "Lost" | "Abandoned";
  tags?: string[];
  notes?: Array<{
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type Activity = {
  id: string;
  userId: string;
  type: "Call" | "Email" | "Meeting" | "Note" | "Task";
  subject: string;
  description?: string;
  relatedTo: {
    entityType: "Deal" | "Client" | "Person";
    entityId: string;
  };
  scheduledDate?: string;
  completedDate?: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  assignedTo?: string;
  createdAt: string;
  createdBy: string;
};

export type Pipeline = {
  id: string;
  userId: string;
  name: string;
  stages: Array<{
    name: string;
    order: number;
    color?: string;
    probability?: number;
  }>;
  isDefault: boolean;
  createdAt: string;
  createdBy: string;
};

export type Tag = {
  id: string;
  userId: string;
  name: string;
  color?: string;
  createdAt: string;
};

// API Response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Form types
export type CreatePersonInput = Omit<Person, "id" | "userId" | "createdAt" | "updatedAt" | "createdBy">;
export type UpdatePersonInput = Partial<CreatePersonInput>;

export type CreateClientInput = Omit<Client, "id" | "userId" | "createdAt" | "updatedAt" | "createdBy">;
export type UpdateClientInput = Partial<CreateClientInput>;

export type CreateDealInput = Omit<Deal, "id" | "userId" | "createdAt" | "updatedAt" | "createdBy">;
export type UpdateDealInput = Partial<CreateDealInput>;

export type CreateActivityInput = Omit<Activity, "id" | "userId" | "createdAt" | "createdBy">;
export type UpdateActivityInput = Partial<CreateActivityInput>;

export type CreatePipelineInput = Omit<Pipeline, "id" | "userId" | "createdAt" | "createdBy">;
export type UpdatePipelineInput = Partial<CreatePipelineInput>;

