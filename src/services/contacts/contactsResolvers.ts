import { Resolver, Query, Ctx, Arg } from "type-graphql";
import { Contact, PhoneNumberFilterInput } from "./contactsSchema";
import { google } from "googleapis";

@Resolver(Contact) //It tells TypeGraphQL that this class contains GraphQL queries and mutations related to the Contact type.
export class ContactResolver {

    @Query(() => [Contact]) //returns an array of Contact objects.
    async contacts(@Ctx() ctx: { oAuth2Client: any },
    @Arg("filter", () => PhoneNumberFilterInput, { nullable: true }) filter?: PhoneNumberFilterInput
): Promise<Contact[]> {
        try {
            const peopleService = google.people({ version: 'v1', auth: ctx.oAuth2Client });
            const response = await peopleService.people.connections.list({ // an API call to fetch the user's contacts.
                resourceName: 'people/me', // Fetches connections for the authenticated user.
                pageSize: 10,
                personFields: 'names,emailAddresses,phoneNumbers,addresses',
            });

            
            const connections = response.data.connections || []; // Extracts the list of connections (contacts) from the response

            const contacts = connections.map(connection => {
                const name = connection.names?.[0]?.displayName || "No Name";
                const email = connection.emailAddresses?.[0]?.value || "No Email";
                const phoneNumber = connection.phoneNumbers?.[0]?.value || "No Phone Number";
                const address = connection.addresses?.[0]?.formattedValue || "No Address";
                return { name, email, phoneNumber, address };
            });

            // Apply filter if provided
            if (filter?.startsWith) {
                const startsWithFilter = filter.startsWith;  // This guarantees startsWithFilter is a string
                const filteredContacts = contacts.filter(contact =>
                    contact.phoneNumber?.startsWith(startsWithFilter)
                );
                return filteredContacts;
            }

            return contacts;
            
            
            // return connections.map(connection => {
            //     const name = connection.names?.[0]?.displayName || "No Name";
            //     const email = connection.emailAddresses?.[0]?.value || "No Email";
            //     const phoneNumber = connection.phoneNumbers?.[0]?.value || "No Phone Number";
            //     const address = connection.addresses?.[0]?.formattedValue || "No Address";
            //     return { name, email, phoneNumber, address };
            // });
        } catch (error) {
            console.error("Error fetching contacts:", error);
            throw new Error("Failed to fetch contacts");
        }
    }
}
