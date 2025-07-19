export const courseOptions = [
  'PLM Windchill',
  'Siemens Teamcenter',
  'Cloud Solutions',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'DevOps',
  'AI/Machine Learning',
  'Cybersecurity',
  'Cloud Computing',
  'Other'
] as const;

export type CourseOption = typeof courseOptions[number];