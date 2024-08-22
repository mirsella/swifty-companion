type ImageVersions = {
  large: string;
  medium: string;
  small: string;
  micro: string;
};

type Image = {
  link: string;
  versions: ImageVersions;
};

type User = {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  usual_first_name: string | null;
  url: string;
  phone: string;
  displayname: string;
  kind: string;
  image: Image;
  "staff?": boolean;
  correction_point: number;
  pool_month: string;
  pool_year: string;
  location: string | null;
  wallet: number;
  anonymize_date: string;
  data_erasure_date: string;
  created_at: string;
  updated_at: string;
  alumnized_at: string | null;
  "alumni?": boolean;
  "active?": boolean;
};

type Skill = {
  id: number;
  name: string;
  level: number;
};

type Cursus = {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  kind: string;
};

type CursusUser = {
  grade: string | null;
  level: number;
  skills: Skill[];
  blackholed_at: string | null;
  id: number;
  begin_at: string;
  end_at: string | null;
  cursus_id: number;
  has_coalition: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  cursus: Cursus;
};

type Project = {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
};

type ProjectUser = {
  id: number;
  occurrence: number;
  final_mark: number | null;
  status: string;
  "validated?": boolean | null;
  current_team_id: number | null;
  project: Project;
  cursus_ids: number[];
  marked_at: string | null;
  marked: boolean;
  retriable_at: string | null;
  created_at: string;
  updated_at: string;
};

type UserApiResponse = {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  usual_first_name: string | null;
  url: string;
  phone: string;
  displayname: string;
  kind: string;
  image: Image;
  "staff?": boolean;
  correction_point: number;
  pool_month: string;
  pool_year: string;
  location: string | null;
  wallet: number;
  anonymize_date: string;
  data_erasure_date: string;
  created_at: string;
  updated_at: string;
  alumnized_at: string | null;
  "alumni?": boolean;
  "active?": boolean;
  groups: any[];
  cursus_users: CursusUser[];
  projects_users: ProjectUser[];
};
