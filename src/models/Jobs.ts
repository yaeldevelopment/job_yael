export default class Jobs{
   constructor(public id:string="",public title:string,public componay:string,public publication_date:string,public job_location:string[]
    ,public job_type:string,
    public salary:string,
    public additional_conditions:string,
    public html_word:string,
    public employer:string,
   public  employees_send:string[],
public jobSentStatus?:boolean){

   }
  
  
}
export interface Job {
  id?: string;                 // חדש ⇒ undefined
  title: string;
  componay: string;
  publication_date: string;    // YYYY‑MM‑DD
  job_location: string[];      // ['ת״א', 'חיפה'…]
  job_type: string;
  salary?: number;
  additional_conditions: string;
  html_word?: string;
     employer:string,
     employees_send:string[],
 jobSentStatus?:boolean
   __isNew?: boolean; // שדה זמני לקליינט בלבד
 tempId?:string;
}

// DTO לבקשת Batch
export interface JobBatchRequest {
   EmployerId:string;
  added:   Job[];
  updated: Job[];
  deleted: string[];           // Id‑ים
}