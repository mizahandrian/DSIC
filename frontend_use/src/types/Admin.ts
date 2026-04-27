export interface Admin {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    password? : string; //optionnel
}