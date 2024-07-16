import { REPORTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVaccinatedByGender: builder.query({
      query: ({ hospitalId }) => `${REPORTS_URL}/byGender/${hospitalId}`,
      providesTags: ["Reports"],
    }),
    getVaccinatedByAgeGroup: builder.query({
      query: ({ hospitalId }) => `${REPORTS_URL}/byAgeGroup/${hospitalId}`,
      providesTags: ["Reports"],
    }),
    getVaccinatedByVaccineType: builder.query({
      query: ({ hospitalId }) => `${REPORTS_URL}/byVaccineType/${hospitalId}`,
      providesTags: ["Reports"],
    }),
    getWatchList: builder.query({
      query: () => `${REPORTS_URL}/watchlist`,
      providesTags: ["Reports"],
    }),
  }),
});
export const {
  useGetVaccinatedByGenderQuery,
  useGetVaccinatedByAgeGroupQuery,
  useGetVaccinatedByVaccineTypeQuery,
  useGetWatchListQuery,
} = reportsApiSlice;
