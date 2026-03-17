export interface PrComment {
  author: string;
  content: string;
  createdOn: string;
  isInline: boolean;
  filePath?: string;
  line?: number;
}
