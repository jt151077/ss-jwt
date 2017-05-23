export class UserInfo {
	token: string;
	user: {
		sub: string;
		website: string;
		email_verified: boolean;
		birthdate: string;
		address: {
			street_address: string;
			locality: string;
			region: string;
			postal_code: string;
			country: string
		};
		gender: string;
		profile: string;
		phone_number_verified: boolean;
		preferred_username: string;
		given_name: string;
		middle_name: string;
		picture: string;
		nickname: string;
		phone_number: string;
		family_name: string;
		email: string;
	}
}