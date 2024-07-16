import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getVaccinationReport: builder.query({
      query: () => ({
        url: `${USERS_URL}/vaccination-report`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
        headers: {
          "Content-Type": "application/pdf",
        },
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetVaccinationReportQuery,
  useLazyGetVaccinationReportQuery,
} = usersApiSlice;
