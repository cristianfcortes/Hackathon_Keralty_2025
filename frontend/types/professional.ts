export interface MedicalProfessional {
  id: string;
  name: string;
  title: string;
  specialty: string;
  organization?: string;
  contact: {
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
  };
  languages?: string[];
  accessibilityServices?: {
    signLanguage: boolean;
    wheelchairAccessible: boolean;
    hearingAssistance: boolean;
  };
  bio?: string;
}

