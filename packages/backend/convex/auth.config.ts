const domain = process.env.CLERK_JWT_ISSUER_DOMAIN;

if (!domain) {
  throw new Error("CLERK_JWT_ISSUER_DOMAIN must be set for Convex auth.");
}

export default {
  providers: [
    {
      domain,
      applicationID: "convex",
    },
  ],
};
