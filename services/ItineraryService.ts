import type { Trip, Activity } from '../types/interfaces';

export const filterByCategory = (
    trip: Trip,
    category: "outdoors" | "culinary" | "sightseeing" //or Activity["category"] (the specific property of the Activity interface)
    ): Activity[] => {
    //returns array of Activities[] objects
    return trip.activities.filter((activity) => {
        return activity.category === category; //returns only matching category activities to chosen one
    });
};