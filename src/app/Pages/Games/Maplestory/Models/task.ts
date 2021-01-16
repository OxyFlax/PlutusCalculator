export interface Task {
  name: string;
  image: string;
  completed: boolean;
  enabled: boolean;
  type: string;
  displayCondition: string;
}