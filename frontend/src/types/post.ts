export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  status: 'Publish' | 'Draft' | 'Thrash';
  created_at: string;
  updated_at: string;
}

export interface PostFormData {
  title: string;
  content: string;
  category: string;
  status: 'Publish' | 'Draft';
}

export interface PaginatedResponse {
  data: Post[];
  total: number;
  limit: number;
  offset: number;
}
