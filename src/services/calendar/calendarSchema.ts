import { ObjectType,InputType, Field } from "type-graphql";

@ObjectType()
export class CalendarEvent {
    @Field({ nullable: true })
    summary?: string;

    @Field({ nullable: true })
    start?: string;

    @Field({ nullable: true })
    end?: string;
}

