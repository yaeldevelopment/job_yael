export default class Jobs{
   constructor(public Id:string,public title:string,public componay:string,public publication_date:string,public job_location:string[]
    ,public job_type:string,
    public salary:string,
    public additional_conditions:string,
    public html_word:string,
    public employer:string,
   public  employees_send:string[],
public jobSentStatus?:boolean){

   }
  
  
}