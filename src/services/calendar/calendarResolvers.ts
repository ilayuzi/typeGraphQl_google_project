import { Resolver, Query, Ctx } from "type-graphql";
import { CalendarEvent } from "./calendarSchema";
import { google } from "googleapis";

@Resolver(CalendarEvent)
export class CalendarResolver {
    
    @Query(() => [CalendarEvent])
    async events(@Ctx() ctx: { oAuth2Client: any }): Promise<CalendarEvent[]> {
        try {
            const calendar = google.calendar({ version: 'v3', auth: ctx.oAuth2Client }); // initializing the Google Calendar API client.
            const response = await calendar.events.list({
                calendarId: 'primary', // Specifies the calendar from which to retrieve events
                timeMin: (new Date()).toISOString(), // Specifies the minimum time for which events should be retrieved. Here, it's set to the current time, meaning only future events will be fetched.
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            });

            
            const events = response.data.items || [];
            
            return events.map(event => {
                const summary = event.summary || "";
                const start = event.start?.dateTime || event.start?.date || "";
                const end = event.end?.dateTime || event.end?.date || "";
                return { summary, start, end };
            });

        } catch (error) {
            console.error("Error fetching contacts:", error);
            throw new Error("Failed to fetch contacts");
        }
    }
}
