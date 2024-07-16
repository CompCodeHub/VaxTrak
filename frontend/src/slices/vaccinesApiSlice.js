import { VACCINES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const vaccinesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllVaccines: builder.query({
      query: () => ({
        url: VACCINES_URL,
      }),
      providesTags: ["Vaccine"],
    }),
    createVaccine: builder.mutation({
      query: (data) => ({
        url: VACCINES_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vaccine"],
    }),
  }),
});

export const { useGetAllVaccinesQuery, useCreateVaccineMutation } =
  vaccinesApiSlice;
