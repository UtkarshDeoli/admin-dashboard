export interface Play{
    play_no:number;
    title:string;
    play_type:string[];
}
export interface PlayProduction {
    production_no: number;
    play_no: number | null;
    company_no: number | null;
    start_date: string | null; 
    end_date: string | null;   
    season: string | null;     
    festival: string | null;   
    canceled: boolean;         
    archived: boolean; 
}
export interface PlayContributor{
    pc_no:number;
    play_no:number | null;
    people_no:number | null;
    play_contributor_type:string;
}