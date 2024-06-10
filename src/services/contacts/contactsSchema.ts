import { ObjectType,InputType, Field } from "type-graphql";

@ObjectType()
export class Contact {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field({ nullable: true })
    email?: string;


    @Field({ nullable: true })
    address?: string;

}

@InputType()
export class PhoneNumberFilterInput {
    @Field({ nullable: true })
    startsWith?: string;
}