export type PredictResponse = {
  score?: number;
  class_?: string;        
  proba?: number[];
  model_id?: string;
  model_name?: string;
  version?: number;
  task_type?: string;
};
