export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  instructorId: string;
  sections: Section[];
  instructor: User;
}

export interface Section {
  id: string;
  name: string;
  videos: Video[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  phoneNumber: string;
}

export interface EnrollmentTableProps {
  payments: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  stripeId: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
  };
  instructorName?: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
}
