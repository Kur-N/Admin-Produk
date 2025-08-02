export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer; // For Node.js, but the API response might be different.
  location: string; // Assuming the API returns a URL for the uploaded file.
}