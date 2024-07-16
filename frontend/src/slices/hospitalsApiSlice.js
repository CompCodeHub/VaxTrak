import { HOSPITALS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const hospitalsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHospital: builder.query({
      query: (hospitalId) => `${HOSPITALS_URL}/${hospitalId}`,
      providesTags: ["Hospital"],
    }),
    addVaccine: builder.mutation({
      query: (vaccineData) => ({
        url: `${HOSPITALS_URL}/${vaccineData.hospitalId}/vaccines`,
        method: "PUT",
        body: { vaccineId: vaccineData.vaccineId },
      }),
      invalidatesTags: ["Hospital"],
    }),
    removeVaccine: builder.mutation({
      query: (vaccineData) => ({
        url: `${HOSPITALS_URL}/${vaccineData.hospitalId}/vaccines`,
        method: "DELETE",
        body: { vaccineId: vaccineData.vaccineId },
      }),
      invalidatesTags: ["Hospital"],
    }),
    registerHospital: builder.mutation({
      query: (hospitalData) => ({
        url: `${HOSPITALS_URL}`,
        method: "POST",
        body: hospitalData,
      }),
    }),
    getAllHospitals: builder.query({
      query: () => HOSPITALS_URL,
      providesTags: ["Hospital"],
    }),
  }),
});

export const {
  useGetHospitalQuery,
  useAddVaccineMutation,
  useRemoveVaccineMutation,
  useRegisterHospitalMutation,
  useGetAllHospitalsQuery
} = hospitalsApiSlice;
