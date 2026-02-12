import { Gender } from "@prisma/client";
import { CleanCustomer, CustomerData } from "../types/customer";

export class CustomerDto {
    id: number 
    name : string;
    gender: Gender;
    phoneNumber : string;
    ageGroup: string | null ;
    region: string | null ;
    email: string ;
    memo: string | null ;
    userId: number | null;
    companyId: number;
    contractCount: number;

    constructor(data: CustomerData){
        this.id = data.id;
        this.name = data.name;
        this.gender = data.gender;
        this.phoneNumber = data.phoneNumber;
        this.ageGroup = data.ageGroup ;
        this.region = data.region ;
        this.email = data.email ;
        this.memo = data.memo ;
        this.userId = data.userId;
        this.companyId = data.companyId;
        this.contractCount = data.contractCount ?? 0;
    }
toResponse(): CleanCustomer {
        const { userId, companyId, ...cleanData } = this;
        return {
            ...cleanData,
            gender: this.gender.toLowerCase() as 'male' | 'female' 
        };
}

}
