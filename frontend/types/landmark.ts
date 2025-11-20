export interface Landmark {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address?: string;
  category?: string;
  imageUrl?: string;
  accessibilityInfo?: {
    wheelchairAccessible: boolean;
    hearingAssistance: boolean;
    visualAssistance: boolean;
    notes?: string;
  };
}

