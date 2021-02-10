export interface Docs {
    name: string;
    email: string;
    photo: string;
    userID: string;
    specialist: string;
}
export interface Login {
    doctorMobile: string;
    doctorPassword: string;
    languageID: string;
}
export interface FacilityLogin {
    facilityuserPassword: string;
    facilityuserEmail: string;
    languageID: string;
}
export interface ChangePassword {
    logindoctorID: string;
    doctorCurrentPassword: string;
    languageID: string;
    doctorNewPassword: string;
}
export interface ChangePasswordFacility {
    facilityuserID: string;
    facilityuserCurrentPassword: string;
    languageID: string;
    facilityNewPassword: string;
}
