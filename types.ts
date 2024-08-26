export type Placemark = {
  name: string;
  description: string;
  styleUrl: string;
  Point: {
    coordinates: string;
  };
  fullName: string | undefined;
};
