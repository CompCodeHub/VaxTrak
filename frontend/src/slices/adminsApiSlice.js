import { ADMINS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const adminsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: `${ADMINS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginAdminMutation } = adminsApiSlice;
