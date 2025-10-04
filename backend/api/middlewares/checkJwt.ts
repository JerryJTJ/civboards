import { auth } from "express-oauth2-jwt-bearer";

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

const checkJwt = auth({
	issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
	audience: process.env.AUTH0_AUDIENCE,
	tokenSigningAlg: "RS256",
});

export default checkJwt;
